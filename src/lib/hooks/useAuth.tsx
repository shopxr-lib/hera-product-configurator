import { useMutation } from "@tanstack/react-query";
import { useService } from "./useService";
import { AuthRequest, RegisterRequest, AuthResponse } from "../services/auth/types";

export const useAuth = () => {
  const { auth } = useService();

  const loginMutation = useMutation<AuthResponse, Error, AuthRequest>({
    mutationFn: async (data) => {
      const [res, err] = await auth.login(data);
      console.log(err);
      if (err) throw err;
      localStorage.setItem("token", res?.token || "");
      localStorage.setItem('name', res?.user.name || "");
      localStorage.setItem('email', res?.user.email || "");
      return res!;
    },
  });

  const registerMutation = useMutation<AuthResponse, Error, RegisterRequest>({
    mutationFn: async (data) => {
      const [res, err] = await auth.register(data);
      if (err) throw err;
      localStorage.setItem("token", res?.token || "");
      localStorage.setItem('name', res?.user.name || "");
      localStorage.setItem('email', res?.user.email || "");
      return res!;
    },
  });

  const logoutMutation = useMutation<void, Error>({
    mutationFn: async () => {
      await auth.logout();
      localStorage.removeItem("token");
      localStorage.removeItem('name');
      localStorage.removeItem('email');
    },
  });

  return {
    login: loginMutation.mutate,
    loginStatus: loginMutation.status, // "idle" | "loading" | "error" | "success"
    loginError: loginMutation.error,

    register: registerMutation.mutate,
    registerStatus: registerMutation.status,
    registerError: registerMutation.error,

    logout: logoutMutation.mutate,
    logoutStatus: logoutMutation.status,
  };
};
