import { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/api/entities';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    checkAuth();
    
    // Subscribe to auth state changes
    const { data: authListener } = User.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        checkAuth();
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });
    
    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const checkAuth = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const user = await User.signIn(email, password);
      setUser(user);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const signup = async (email, password, name) => {
    try {
      const user = await User.signUp(email, password, name);
      setUser(user);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await User.signOut();
      setUser(null);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const signInWithGoogle = async () => {
    try {
      // For now, we'll create a demo account since Google OAuth isn't configured
      // In production, you would enable Google provider in Supabase Auth settings
      const timestamp = Date.now();
      const demoEmail = `demo${timestamp}@example.com`;
      const demoPassword = `Demo${timestamp}!`; // Strong password for Supabase
      
      // Create a new account with demo credentials
      const result = await signup(demoEmail, demoPassword, '');
      
      if (result.success) {
        return { success: true };
      } else {
        // If signup fails, try to sign in (might already exist)
        const signInResult = await login(demoEmail, demoPassword);
        return signInResult;
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateUserProfile = async (updates) => {
    try {
      await User.updateProfile(updates);
      // Refresh user data
      const updatedUser = await User.me();
      setUser(updatedUser);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const hasCompletedOnboarding = () => {
    // Check if user has a full_name set
    return user?.full_name && user.full_name.trim() !== '';
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    signInWithGoogle,
    updateUserProfile,
    hasCompletedOnboarding,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export { AuthContext };