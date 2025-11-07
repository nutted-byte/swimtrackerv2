import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state and listen for changes
  useEffect(() => {
    // Check active session
    const initAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) throw error;

        setUser(session?.user ?? null);
      } catch (err) {
        console.error('Error initializing auth:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  /**
   * Sign in with Google OAuth
   */
  const signInWithGoogle = async () => {
    try {
      setError(null);
      setLoading(true);

      // Store the current origin to redirect back after auth
      const currentOrigin = window.location.origin;
      sessionStorage.setItem('auth_redirect_origin', currentOrigin);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: currentOrigin,
          skipBrowserRedirect: false,
        },
      });

      if (error) throw error;

      return data;
    } catch (err) {
      console.error('Error signing in with Google:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Sign out
   */
  const signOut = async () => {
    try {
      setError(null);
      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      setUser(null);
    } catch (err) {
      console.error('Error signing out:', err);
      setError(err.message);
      throw err;
    }
  };

  /**
   * Get the current user's ID
   */
  const getUserId = () => {
    return user?.id ?? null;
  };

  const value = useMemo(() => ({
    user,
    loading,
    error,
    signInWithGoogle,
    signOut,
    getUserId,
    isAuthenticated: !!user,
  }), [user, loading, error, signInWithGoogle, signOut, getUserId]);

  return (
    <AuthContext.Provider value={value}>
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
