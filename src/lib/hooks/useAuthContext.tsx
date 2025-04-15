import { createContext, useContext } from 'react';
import { AuthRequest, ForgotPasswordRequest, IUser, RegisterRequest, ResetPasswordRequest } from '../services/auth/types';

interface AuthContextType {
  user: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: AuthRequest) => Promise<IUser | null>;
  register: (credentials: RegisterRequest) => Promise<IUser | null>;
  forgotPassword: (credentials: ForgotPasswordRequest) => Promise<void>;
  resetPassword: (credentials: ResetPasswordRequest) => Promise<IUser | null>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  
  return context;
};