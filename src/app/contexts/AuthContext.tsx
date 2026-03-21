import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { db } from '../lib/database';
import type { User } from '../lib/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (data: SignUpData) => Promise<{ success: boolean; error?: string; user?: User }>;
  signOut: () => void;
  updateProfile: (data: Partial<User>) => Promise<{ success: boolean; error?: string }>;
  updateUserPreferences: (preferences: Partial<User['preferences']>) => Promise<{ success: boolean; error?: string }>;
  deleteAccount: () => Promise<{ success: boolean; error?: string }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
}

interface SignUpData {
  name: string;
  email: string;
  phone?: string;
  password: string;
  role?: 'customer' | 'waiter' | 'kitchen' | 'manager' | 'admin';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mark context for Fast Refresh
if (import.meta.hot) {
  import.meta.hot.accept(() => {
    // This ensures the context is preserved during hot reload
  });
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUserId = localStorage.getItem('echefs_user_id');
        if (storedUserId) {
          const userData = db.getUser(storedUserId);
          if (userData) {
            setUser(userData);
          } else {
            // User not found, clear localStorage
            localStorage.removeItem('echefs_user_id');
          }
        }
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);

      // Validate input
      if (!email || !password) {
        return { success: false, error: 'Email and password are required' };
      }

      // In a real app, this would be an API call
      // For now, we'll use the database to find user by email
      const users = db.getUsers();
      const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (!foundUser) {
        return { success: false, error: 'Invalid email or password' };
      }

      // In production, you would verify the password hash here
      // For demo purposes, we'll check if password matches a stored hash
      const storedPassword = localStorage.getItem(`echefs_password_${foundUser.id}`);
      
      if (storedPassword !== password) {
        return { success: false, error: 'Invalid email or password' };
      }

      // Set user
      setUser(foundUser);
      localStorage.setItem('echefs_user_id', foundUser.id);

      return { success: true };
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: 'An error occurred during sign in' };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (data: SignUpData): Promise<{ success: boolean; error?: string; user?: User }> => {
    try {
      setIsLoading(true);

      // Validate input
      if (!data.name || !data.email || !data.password) {
        return { success: false, error: 'Name, email, and password are required' };
      }

      if (data.password.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters' };
      }

      // Check if email already exists
      const users = db.getUsers();
      const existingUser = users.find(u => u.email.toLowerCase() === data.email.toLowerCase());

      if (existingUser) {
        return { success: false, error: 'Email already exists' };
      }

      // Create new user
      const newUser: User = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role || 'customer',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=667c67&color=fff`,
        createdAt: new Date().toISOString(),
      };

      // Save user to database
      db.createUser(newUser);

      // Store password (in production, this would be hashed)
      localStorage.setItem(`echefs_password_${newUser.id}`, data.password);

      // Set user
      setUser(newUser);
      localStorage.setItem('echefs_user_id', newUser.id);

      // Create loyalty card for customer
      if (newUser.role === 'customer') {
        db.createLoyaltyCard(newUser.id);
      }

      return { success: true, user: newUser };
    } catch (error) {
      console.error('Sign up error:', error);
      return { success: false, error: 'An error occurred during sign up' };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('echefs_user_id');
    // Don't clear language or other preferences
  };

  const updateProfile = async (data: Partial<User>): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!user) {
        return { success: false, error: 'Not authenticated' };
      }

      // Update user data
      const updatedUser = { ...user, ...data, id: user.id, email: user.email }; // Keep id and email unchanged
      
      // Save to database
      db.updateUser(user.id, updatedUser);

      // Update local state
      setUser(updatedUser);

      return { success: true };
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, error: 'Failed to update profile' };
    }
  };

  const updateUserPreferences = async (preferences: Partial<User['preferences']>): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!user) {
        return { success: false, error: 'Not authenticated' };
      }

      // Update user preferences
      const updatedUser = { ...user, preferences: { ...user.preferences, ...preferences } };
      
      // Save to database
      db.updateUser(user.id, updatedUser);

      // Update local state
      setUser(updatedUser);

      return { success: true };
    } catch (error) {
      console.error('Update user preferences error:', error);
      return { success: false, error: 'Failed to update user preferences' };
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!user) {
        return { success: false, error: 'Not authenticated' };
      }

      if (newPassword.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters' };
      }

      // Verify current password
      const storedPassword = localStorage.getItem(`echefs_password_${user.id}`);
      if (storedPassword !== currentPassword) {
        return { success: false, error: 'Current password is incorrect' };
      }

      // Update password
      localStorage.setItem(`echefs_password_${user.id}`, newPassword);

      return { success: true };
    } catch (error) {
      console.error('Change password error:', error);
      return { success: false, error: 'Failed to change password' };
    }
  };

  const deleteAccount = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!user) {
        return { success: false, error: 'Not authenticated' };
      }

      // Delete user from database
      db.deleteUser(user.id);

      // Clear password
      localStorage.removeItem(`echefs_password_${user.id}`);

      // Sign out
      signOut();

      return { success: true };
    } catch (error) {
      console.error('Delete account error:', error);
      return { success: false, error: 'Failed to delete account' };
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    updateUserPreferences,
    deleteAccount,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};