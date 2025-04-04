import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { jwtUtil } from '../jwt';
import { AuthRequest, ForgotPasswordRequest, IUser, RegisterRequest, ResetPasswordRequest } from '../services/auth/types';
import { useService } from '../hooks/useService';
import { AuthContext } from '../hooks/useAuthContext';

export const AuthProvider:React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { auth } = useService();
  const [user, setUser] = useState<IUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const token = jwtUtil.getToken();
    return Boolean(token && !jwtUtil.isTokenExpired(token));
  });
  const [isLoading, setIsLoading] = useState<boolean>(() => {
    const token = jwtUtil.getToken();
    return Boolean(token && !jwtUtil.isTokenExpired(token));
  });
  const queryClient = useQueryClient();
  
  useEffect(() => {
    const initAuth = async () => {
      const token = jwtUtil.getToken();
      
      if (token && !jwtUtil.isTokenExpired(token)) {
        try {
          const [res] = await auth.getUser();
          setUser(res?.user as IUser);
          setIsAuthenticated(true);
        } catch {
          jwtUtil.clearToken();
        }
      }
      
      setIsLoading(false);
    };
    
    initAuth();
  }, []);
  
  const login = async (credentials: AuthRequest) => {
    const [ res, err ] = await auth.login(credentials as AuthRequest);
    if (err) {
      throw err;
    }
    jwtUtil.setToken(res?.token as string, credentials.rememberMe);
    setUser(res?.user as IUser);
    setIsAuthenticated(true);
    return res?.user ?? null;
  };
  
  const register = async (credentials: RegisterRequest) => {
    const [res, err] = await auth.register(credentials as RegisterRequest);
    if (err) {
      throw err;
    }
    jwtUtil.setToken(res?.token as string, true);
    setUser(res?.user as IUser);
    setIsAuthenticated(true);
    return res?.user ?? null;
  };

  const forgotPassword = async (credentials: ForgotPasswordRequest) => {
    const [, err] = await auth.forgotPassword(credentials as ForgotPasswordRequest);
    if (err) {
      throw err;
    }
  };

  const resetPassword = async (credentials: ResetPasswordRequest) => {
    const [res, err] = await auth.resetPassword(credentials as ResetPasswordRequest);
    if (err) {
      throw err;
    }
    jwtUtil.setToken(res?.token as string, true);
    setUser(res?.user as IUser);
    setIsAuthenticated(true);
    return res?.user ?? null;
  };
  
  const logout = async () => {
    jwtUtil.clearToken();
    setUser(null);
    setIsAuthenticated(false);
    queryClient.clear();
  };
  
  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    forgotPassword,
    resetPassword,
    logout,
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};