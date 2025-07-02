import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserProfile } from '../types/task';
import { mockUser } from '../data/mockData';
import toast from 'react-hot-toast';

interface AuthState {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      loading: false,

      signIn: async (email: string, password: string) => {
        set({ loading: true });
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (email && password) {
          set({ user: { ...mockUser, email }, loading: false });
          toast.success('Welcome back!');
        } else {
          set({ loading: false });
          throw new Error('Invalid credentials');
        }
      },

      signUp: async (email: string, password: string) => {
        set({ loading: true });
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (email && password) {
          set({ user: { ...mockUser, email }, loading: false });
          toast.success('Account created successfully!');
        } else {
          set({ loading: false });
          throw new Error('Invalid data');
        }
      },

      signOut: async () => {
        set({ user: null });
        toast.success('Signed out successfully');
      },

      updateProfile: async (profileData: Partial<UserProfile>) => {
        const { user } = get();
        if (!user) throw new Error('No user logged in');

        set({ loading: true });
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const updatedUser = {
          ...user,
          ...profileData,
          updated_at: new Date().toISOString(),
        };
        
        set({ user: updatedUser, loading: false });
        toast.success('Profile updated successfully');
      },

      updatePassword: async (currentPassword: string, newPassword: string) => {
        set({ loading: true });
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (currentPassword && newPassword) {
          set({ loading: false });
          toast.success('Password updated successfully');
        } else {
          set({ loading: false });
          throw new Error('Invalid password data');
        }
      },

      initialize: () => {
        // Auto-login for demo purposes
        const savedUser = localStorage.getItem('auth-storage');
        if (savedUser) {
          try {
            const parsed = JSON.parse(savedUser);
            if (parsed.state?.user) {
              set({ user: parsed.state.user, loading: false });
            }
          } catch (error) {
            console.error('Error parsing saved auth state:', error);
          }
        }
        set({ loading: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);