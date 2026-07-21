import { apiClient } from '@/lib/apiClient';
import { Customer } from '@/store/authStore';

export interface LoginPayload {
  phoneNumber: string;
  fullName?: string; // Optional because returning customers don't need it
}

export interface AuthResult {
  token: string;
  customerId: string;
  fullName: string;
  loyaltyPoints: number;
  tier: string;
}

export const authService = {
  login: async (payload: LoginPayload): Promise<AuthResult> => {
    return apiClient.post<AuthResult>('/online-store/auth/login', payload);
  }
};
