import { useState, useEffect, createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { type User, type Session, AuthChangeEvent } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

type ExtendedAuthEvent =
  | AuthChangeEvent
  | "TOKEN_REFRESH_FAILED";


type AccountRole = 'buyer' | 'supplier' | 'manufacturer' | 'admin';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
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

  const fetchUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching user role:', error);
        setUserRole(null);
      } else {
        setUserRole(data?.role as AccountRole || 'buyer');
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
      setUserRole(null);
    }
  };

  const refreshRole = async () => {
    if (user?.id) {
      await fetchUserRole(user.id);
    }
  };

  const handleProfileUpdate = async (userId: string, metadata: any) => {
    try {
      // Check if profile exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('user_id')
        .eq('user_id', userId)
        .maybeSingle();

      const profileData = {
        user_id: userId,
        first_name: metadata.firstName || '',
        last_name: metadata.lastName || '',
        company_name: metadata.companyName || '',
        updated_at: new Date().toISOString(),
      };

      if (existingProfile) {
        // Update existing profile
        await supabase
          .from('profiles')
          .update(profileData)
          .eq('user_id', userId);
      } else {
        // Insert new profile
        await supabase
          .from('profiles')
          .insert(profileData as any);
      }

      // Handle user role
      if (metadata.accountType) {
        const roleData = {
          user_id: userId,
          role: metadata.accountType as AccountRole,
          updated_at: new Date().toISOString(),
        };

        // Check if role exists
        const { data: existingRole } = await supabase
          .from('user_roles')
          .select('user_id')
          .eq('user_id', userId)
          .maybeSingle();

        if (existingRole) {
          await supabase
            .from('user_roles')
            .update(roleData)
            .eq('user_id', userId);
        } else {
          await supabase
            .from('user_roles')
            .insert(roleData);
        }

        // Refresh role after update
        await fetchUserRole(userId);
      }
    } catch (error) {
      console.error('Error updating profile/role:', error);
    }
  };

useEffect(() => {
  let subscription: { unsubscribe: () => void } | null = null;

  const initializeAuth = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    setSession(session);
    setUser(session?.user ?? null);

    if (session?.user?.id) {
      await fetchUserRole(session.user.id);
    }

    setLoading(false);
  };

  initializeAuth();

 const { data } = supabase.auth.onAuthStateChange(
  async (event: ExtendedAuthEvent, session) => {
    console.log("AUTH EVENT:", event);

    // 🚨 HANDLE SIGN OUT FIRST
    if (event === "SIGNED_OUT" || event === "TOKEN_REFRESH_FAILED") {
      setUser(null);
      setSession(null);
      setUserRole(null);
      setLoading(false);
      return; // ⛔ stop here
    }

    // Normal flow
    setSession(session);
    setUser(session?.user ?? null);

    if (event === "SIGNED_IN" && session?.user) {
      const metadata = session.user.user_metadata;
      if (
        metadata?.firstName ||
        metadata?.lastName ||
        metadata?.companyName ||
        metadata?.accountType
      ) {
        await handleProfileUpdate(session.user.id, metadata);
      }
    }

    if (session?.user?.id) {
      await fetchUserRole(session.user.id);
    } else {
      setUserRole(null);
    }

    setLoading(false);
  }
);

  subscription = data.subscription;

  return () => {
    subscription?.unsubscribe();
  };
}, []);



  const signUp = async (
    email: string, 
    password: string, 
    metadata?: { firstName?: string; lastName?: string; companyName?: string; accountType?: string }
  ) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: metadata,
      },
    });
    
    return { error: error as Error | null };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    // Fetch role for the newly signed-in user
    if (!error && data?.user?.id) {
      await fetchUserRole(data.user.id);
    }
    
    return { 
      error: error as Error | null,
      userId: data?.user?.id 
    };
  };

 const signOut = async () => {
  await supabase.auth.signOut();

  setUser(null);
  setSession(null);
  setUserRole(null);

};


  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      loading, 
      userRole,
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