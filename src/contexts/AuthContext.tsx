
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: UserProfile | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  register: (email: string, password: string, name: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      console.log('Fetched user profile:', data);
      
      // Type cast the role to ensure TypeScript compatibility
      return {
        ...data,
        role: data.role as 'user' | 'admin'
      } as UserProfile;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  useEffect(() => {
    console.log('Setting up auth state listener');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        
        if (session?.user) {
          // Fetch user profile from our profiles table
          const profile = await fetchUserProfile(session.user.id);
          setUser(profile);
        } else {
          setUser(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log('Initial session check:', session);
      setSession(session);
      
      if (session?.user) {
        const profile = await fetchUserProfile(session.user.id);
        setUser(profile);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      console.log('Attempting login for:', email);
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        setLoading(false);
        return { error: error.message };
      }

      console.log('Login successful');
      return {};
    } catch (error) {
      console.error('Login error:', error);
      setLoading(false);
      return { error: 'An unexpected error occurred' };
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      console.log('Attempting registration for:', email);
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          },
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        console.error('Registration error:', error);
        setLoading(false);
        return { error: error.message };
      }

      console.log('Registration successful');
      return {};
    } catch (error) {
      console.error('Registration error:', error);
      setLoading(false);
      return { error: 'An unexpected error occurred' };
    }
  };

  const logout = async () => {
    console.log('Logging out');
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
