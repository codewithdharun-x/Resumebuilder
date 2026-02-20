import { supabase, isSupabaseConfigured } from './supabase';
import { User } from '@supabase/supabase-js';

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
}

export const authService = {
  // Sign up with email and password
  async signUp(email: string, password: string, name?: string) {
    if (!isSupabaseConfigured) {
      throw new Error('Authentication not configured. Please set up Supabase environment variables.');
    }
    
    const { data, error } = await supabase!.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || email.split('@')[0],
        },
      },
    });

    if (error) throw error;
    return data;
  },

  // Sign in with email and password
  async signIn(email: string, password: string) {
    if (!isSupabaseConfigured) {
      throw new Error('Authentication not configured. Please set up Supabase environment variables.');
    }

    const { data, error } = await supabase!.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  // Sign in with Google (OAuth)
  async signInWithGoogle() {
    if (!isSupabaseConfigured) {
      throw new Error('Authentication not configured. Please set up Supabase environment variables.');
    }

    const { data, error } = await supabase!.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/builder`,
      },
    });

    if (error) throw error;
    return data;
  },

  // Sign out
  async signOut() {
    if (!isSupabaseConfigured) {
      return;
    }

    const { error } = await supabase!.auth.signOut();
    if (error) throw error;
  },

  // Get current user
  async getCurrentUser(): Promise<User | null> {
    if (!isSupabaseConfigured) {
      return null;
    }

    const { data: { user } } = await supabase!.auth.getUser();
    return user;
  },

  // Listen to auth changes
  onAuthChange(callback: (user: User | null) => void) {
    if (!isSupabaseConfigured) {
      return { data: { subscription: { unsubscribe: () => {} } } };
    }

    return supabase!.auth.onAuthStateChange((_event, session) => {
      callback(session?.user ?? null);
    });
  },

  // Reset password
  async resetPassword(email: string) {
    if (!isSupabaseConfigured) {
      throw new Error('Authentication not configured. Please set up Supabase environment variables.');
    }

    const { error } = await supabase!.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) throw error;
  },

  // Update password
  async updatePassword(newPassword: string) {
    if (!isSupabaseConfigured) {
      throw new Error('Authentication not configured. Please set up Supabase environment variables.');
    }

    const { error } = await supabase!.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;
  },
};
