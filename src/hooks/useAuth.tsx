import { useState, useEffect, createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { type User, type Session, AuthChangeEvent } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

type ExtendedAuthEvent = AuthChangeEvent | "TOKEN_REFRESH_FAILED";

type AccountRole = 'buyer' | 'supplier' | 'manufacturer' | 'admin';

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
  profile: UserProfile | null;
  userRole: AccountRole | null;
  signUp: (email: string, password: string, metadata?: { firstName?: string; lastName?: string; companyName?: string; accountType?: string }) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null; userId?: string }>;
  signOut: () => Promise<void>;
  refreshRole: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<AccountRole | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);


  /* ----------------------------------
     Role
  ---------------------------------- */
  const fetchUserRole = async (userId: string) => {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user role:', error);
        setUserRole(null);
        return;
      } 
        setUserRole(data?.role as AccountRole || 'buyer');
  };

  const refreshRole = async () => {
    if (user?.id) {
      await fetchUserRole(user.id);
    }
  };
const fetchUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (!error) setProfile(data as unknown as UserProfile);
};

/* ----------------------------------
     Profile + Role Upsert
  ---------------------------------- */
  const handleProfileUpdate = async (userId: string, metadata: any) => {

      if (!userId) {
        console.error('Cannot upsert profile: userId is undefined');
        return;
      }

      const profileData = {
        user_id: userId,
        first_name: metadata?.firstName ?? '',
        last_name: metadata?.lastName ?? '',
        full_name: `${metadata?.firstName} ${metadata?.lastName}`,
        company_name: metadata?.companyName ?? '',
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(profileData as any, { onConflict: 'user_id' });

      if (error) {
        console.error('Error upserting profile:', error);
      }

      if (metadata.accountType) {
        await supabase
        .from('user_roles')
        .upsert({ user_id: userId, 
          role: metadata.accountType as AccountRole, 
          updated_at: new Date().toISOString() } as any, 
          { onConflict: 'user_id' }, 
          ); 
          
          await fetchUserRole(userId);
      }
  };

  /* ----------------------------------
     Auth lifecycle
  ---------------------------------- */
useEffect(() => {
  let subscription: { unsubscribe: () => void } | null = null;

  const initializeAuth = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    setSession(session);
    setUser(session?.user ?? null);

    if (session?.user?.id) {
      await Promise.all ([
        fetchUserProfile(session.user.id), 
        fetchUserRole(session.user.id)
      ]);
    }

    setLoading(false);
  };

  initializeAuth();

 const { data } = supabase.auth.onAuthStateChange(
  async (event: ExtendedAuthEvent, session) => {
    console.log("AUTH EVENT:", event);

    // SIGN OUT
    if (event === "SIGNED_OUT" || event === "TOKEN_REFRESH_FAILED") {
      setUser(null);
      setSession(null);
      setUserRole(null);
      setProfile(null);
      setLoading(false);
      return;
    }

    // Normal flow
    setSession(session);
    setUser(session?.user ?? null);

    if (session?.user?.id) {
      await Promise.all ([
        fetchUserProfile(session.user.id), 
        fetchUserRole(session.user.id)
      ]);
    }

    setLoading(false);
  }
);

  subscription = data.subscription;

  return () => {subscription?.unsubscribe();
  };
}, []);



  const signUp = async (
    email: string, 
    password: string, 
    metadata?: { firstName?: string; lastName?: string; companyName?: string; accountType?: string }
  ) => {
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
        emailRedirectTo: window.location.origin,
      },
    });

    if (error) return { error}

    const userId = data?.user?.id;

    if(userId && metadata){
      await handleProfileUpdate(userId, metadata);
      await fetchUserProfile(userId);
      await fetchUserRole(userId);
    }
    
    return { error: null };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
        
    return { 
      error: error as Error | null,
      userId: data?.user?.id 
    };
  };

 const signOut = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Error signing out:', error);
    return;
  }

  setUser(null);  
  setSession(null);
  setUserRole(null);
  setProfile(null);
};


  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      loading, 
      userRole,
      profile,
      signUp, 
      signIn, 
      signOut,
      refreshRole 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};