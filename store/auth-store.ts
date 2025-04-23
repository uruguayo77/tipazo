import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Worker } from '@/types';

interface AuthState {
  user: User | Worker | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<Worker>, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<Worker>) => Promise<void>;
}

// Mock function to simulate API calls
const mockApiCall = <T>(data: T, delay = 1000, shouldFail = false): Promise<T> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error("API call failed"));
      } else {
        resolve(data);
      }
    }, delay);
  });
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          // Mock API call
          const user = await mockApiCall<Worker>({
            id: '1',
            name: 'John Doe',
            email,
            userType: 'worker',
            createdAt: new Date().toISOString(),
            totalEarnings: 0,
            qrCode: 'https://example.com/qrcode',
          });
          
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : "Login failed", 
            isLoading: false 
          });
        }
      },
      
      register: async (userData: Partial<Worker>, password: string) => {
        set({ isLoading: true, error: null });
        try {
          // Mock API call
          const user = await mockApiCall<Worker>({
            id: Date.now().toString(),
            name: userData.name || '',
            email: userData.email || '',
            userType: 'worker',
            createdAt: new Date().toISOString(),
            totalEarnings: 0,
            qrCode: 'https://example.com/qrcode',
            ...userData,
          });
          
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : "Registration failed", 
            isLoading: false 
          });
        }
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
      
      updateProfile: async (userData: Partial<Worker>) => {
        set({ isLoading: true, error: null });
        try {
          // Mock API call
          await mockApiCall(null, 500);
          
          set((state) => ({
            user: state.user ? { ...state.user, ...userData } : null,
            isLoading: false
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : "Profile update failed", 
            isLoading: false 
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);