import { useState, useEffect, createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { type User, type Session, AuthChangeEvent } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

type ExtendedAuthEvent = AuthChangeEvent | "TOKEN_REFRESH_FAILED";

interface UserProfile {
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  full_name: string | null;
  company_name: string | null;
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
  ) => Promise<{ error: Error | null }>;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: Error | null; userId?: string }>;
  signOut: () => Promise<void>;
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
  const fetchUserProfile = async (userId: string) => {
    setProfileLoading(true);

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (!error) {
      setProfile(data as unknown as UserProfile);
    } else {
      console.error('Error fetching profile:', error);
      setProfile(null);
    }

    setProfileLoading(false);
  };

  /* ----------------------------------
     Profile Upsert
  ---------------------------------- */
  const handleProfileUpdate = async (userId: string, metadata: any) => {
    if (!userId) return;

    const profileData = {
      user_id: userId,
      first_name: metadata?.firstName ?? '',
      last_name: metadata?.lastName ?? '',
      full_name: `${metadata?.firstName ?? ''} ${metadata?.lastName ?? ''}`.trim(),
      company_name: metadata?.companyName ?? '',
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('profiles')
      .upsert(profileData as any, { onConflict: 'user_id' });

    if (error) {
      console.error('Error upserting profile:', error);
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
          await fetchUserProfile(session.user.id);
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
              await fetchUserProfile(session.user.id);
            }
            break;
            
          case 'SIGNED_OUT':
            setSession(null);
            setUser(null);
            setProfile(null);
            break;
            
          case 'TOKEN_REFRESHED':
          case 'INITIAL_SESSION':
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user?.id) {
              await fetchUserProfile(session.user.id);
            }
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
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
        emailRedirectTo: window.location.origin,
      },
    });

    if (!error && data.user?.id) {
      await handleProfileUpdate(data.user.id, metadata);
      
      // If account type is provided, set the role
      if (metadata?.accountType) {
        const { error: roleError } = await supabase
          .from('user_roles')
          .upsert({
            user_id: data.user.id,
            role: metadata.accountType,
            updated_at: new Date().toISOString()
          } as any, { onConflict: 'user_id' });
          
        if (roleError) {
          console.error('Error setting role:', roleError);
        }
      }
    }

    return { error: error as Error | null };
  };

  /* ----------------------------------
     Sign In
  ---------------------------------- */
  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return {
      error: error as Error | null,
      userId: data?.user?.id,
    };
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