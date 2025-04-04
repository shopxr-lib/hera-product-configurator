import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthRequest, RegisterRequest, IUser, ForgotPasswordRequest, ResetPasswordRequest } from "../services/auth/types";
import { useAuthContext } from "./useAuthContext";
import { useNavigate } from "react-router";
import { useService } from "./useService";
import { showNotification } from "../utils";
import { NotificationType } from "../../types";

export const useAuth = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { auth } = useService();
  const { login, register, forgotPassword, resetPassword, logout, isAuthenticated } = useAuthContext();

  const useLoginMutation = useMutation<IUser | null, Error, AuthRequest>({
    mutationFn: async (credentials) => login(credentials),
    onSuccess: (user) => {
      if (user) {
        queryClient.setQueryData(['user'], user);
        navigate('/user/tracking');
        showNotification(NotificationType.Success, 'Login Successful')
      }
    },
    onError: (error) => {
      showNotification(NotificationType.Error, 'Login Failed', error.message)
    }
  });

  const useRegisterMutation = useMutation<IUser | null, Error, RegisterRequest>({
    mutationFn: async (credentials) => register(credentials),
    onSuccess: (user) => {
      if (user) {
        queryClient.setQueryData(['user'], user);
        navigate('/user/tracking');
        showNotification(NotificationType.Success, 'Registeration Successful')
      }
    },
    onError: (error) => {
      showNotification(NotificationType.Error, 'Registeration Failed', error.message)
    }
  });

  const useForgotPasswordMutation = useMutation<void, Error, ForgotPasswordRequest>({
    mutationFn: async (credentials) => forgotPassword(credentials),
    onSuccess: () => {
      showNotification(NotificationType.Success, 'Reset Password Email Sent')
    } ,
    onError: (error) => { 
      showNotification(NotificationType.Error, 'Reset Password Failed', error.message)
    }
  });

  const useResetPasswordMutation = useMutation<IUser | null, Error, ResetPasswordRequest>({
    mutationFn: async (credentials) => resetPassword(credentials),
    onSuccess: (user) => {
      if (user) {
        queryClient.setQueryData(['user'], user);
        navigate('/user/tracking');
        showNotification(NotificationType.Success, 'Password Reset Successful')
      }
    },
    onError: (error) => {
      showNotification(NotificationType.Error, 'Password Reset Failed', error.message)
    }
  })

  const useLogoutMutation = useMutation<void, Error>({
    mutationFn: () => logout(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      navigate('/auth');
    },
  });

  const useUserQuery = () => {
    return useQuery({
      queryKey: ['user'],
      queryFn: async () => {
        const [res] = await auth.getUser();
        return res?.user;
      },
      enabled: isAuthenticated,
      staleTime: 1000 * 60 * 5,
    });
  };

  return {
    useLoginMutation,
    useRegisterMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
    useLogoutMutation,
    useUserQuery
  };
};
