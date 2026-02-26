import { useState, useEffect, createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { type User, type Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';


interface UserProfile {
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  full_name: string | null;
  company_name: string | null;
  role: 'buyer' | 'supplier' | 'manufacturer' | 'admin' | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  profileLoading: boolean;
  profile: UserProfile | null;
  signUp: (
    email: string,
    password: string,
    metadata?: {
      firstName?: string;
      lastName?: string;
      companyName?: string;
      accountType?: string;
    }
  ) => Promise<{ error: Error | null; data?: any }>;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: Error | null; userId?: string; data?: any }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  /* ----------------------------------
     Fetch Profile
  ---------------------------------- */
  const fetchUserProfile = async (userId: string, authUser?: User) => {
    setProfileLoading(true);

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (!error && data) {
      setProfile(data as unknown as UserProfile);
    } else {
      if (authUser?.user_metadata && Object.keys(authUser.user_metadata).length > 0) {
        await handleProfileUpdate(userId, authUser.user_metadata);

        const { data: newProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();

        setProfile(newProfile as unknown as UserProfile);
      } else {
        setProfile(null);
      }

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
      }
    }

    setProfileLoading(false);
  };

  /* ----------------------------------
     Profile Upsert
  ---------------------------------- */
  const handleProfileUpdate = async (userId: string, metadata: any) => {
    if (!userId) return;

    const firstName = metadata?.firstName ?? '';
    const lastName = metadata?.lastName ?? '';
    const accountType = metadata?.accountType ?? 'buyer';

    const profileData = {
      user_id: userId,
      first_name: firstName,
      last_name: lastName,
      email: metadata?.email ?? '',
      full_name: `${firstName} ${lastName}`.trim(),
      company_name: metadata?.companyName ?? '',
      role: accountType,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('profiles')
      .upsert(profileData, { onConflict: 'user_id' });

    if (error) {
      console.error('Error upserting profile:', error);
      throw error;
    }
  };

/*-------------------------------
  Refresh Profile
-------------------------------*/
  const refreshProfile = async () => {
    if (user?.id) {
      await fetchUserProfile(user.id, user);
    }
  };

  /* ----------------------------------
     Auth Lifecycle
  ---------------------------------- */
  useEffect(() => {
    let mounted = true;
    let subscription: { unsubscribe: () => void } | null = null;

    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!mounted) return;

        if (session) {
          setSession(session);
          setUser(session.user);
          await fetchUserProfile(session.user.id, session.user);
        } else {
          setSession(null);
          setUser(null);
          setProfile(null);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setSession(null);
        setUser(null);
        setProfile(null);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        switch (event) {
          case 'SIGNED_IN':
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user?.id) {
              setTimeout(async () => {
              await fetchUserProfile(session.user.id, session.user);
              }, 500);
            }
            setLoading(false);
            break;
            
          case 'SIGNED_OUT':
            setSession(null);
            setUser(null);
            setProfile(null);
            setLoading(false);
            break;
            
          case 'TOKEN_REFRESHED':
          case 'INITIAL_SESSION':
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user?.id) {
              await fetchUserProfile(session.user.id);
            }
            setLoading(false);
            break;
        }
      }
    );

    subscription = authSubscription;

    return () => {
      mounted = false;
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  /* ----------------------------------
     Sign Up
  ---------------------------------- */
  const signUp = async (
    email: string,
    password: string,
    metadata?: {
      firstName?: string;
      lastName?: string;
      companyName?: string;
      accountType?: string;
    }
  ) => {
    try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
        emailRedirectTo: window.location.origin,
      },
    });
    if (error) {
      return { error: error as Error, data: null };    
    }

    if (data.user?.id && metadata) {
      await handleProfileUpdate(data.user.id, metadata);

      await fetchUserProfile(data.user.id, data.user);
    }

    return { error: null, data };
    } catch (error) {
      console.error('Sign up error:', error);
      return { error: error as Error | null };
    }
  };
  /* ----------------------------------
     Sign In
  ---------------------------------- */
  const signIn = async (email: string, password: string) => {
    try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error: error as Error };
    }

    return {
      error: error as Error | null,
      userId: data?.user?.id,
      data,
    };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error: error as Error, data: null };
    }
  };

  /* ----------------------------------
     Sign Out
  ---------------------------------- */
  const signOut = async () => {
    try {
      setUser(null);
      setSession(null);
      setProfile(null);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error signing out:', error);
      }
    } catch (error) {
      console.error('Sign out error:', error);
      setUser(null);
      setSession(null);
      setProfile(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        profile,
        profileLoading,
        signUp,
        signIn,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};