import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Customer {
  id: string;
  fullName: string;
  phoneNumber?: string;
  loyaltyPoints: number;
  tier: string;
}

interface AuthState {
  token: string | null;
  customer: Customer | null;
  login: (token: string, customer: Customer) => void;
  logout: () => void;
  updatePoints: (points: number) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      customer: null,
      login: (token, customer) => set({ token, customer }),
      logout: () => set({ token: null, customer: null }),
      updatePoints: (points) => set((state) => ({ 
        customer: state.customer ? { ...state.customer, loyaltyPoints: points } : null 
      }))
    }),
    {
      name: 'taphoa-auth-storage',
    }
  )
);
