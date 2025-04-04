import { Role } from "../../../types";

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  approved: boolean | string;
  deleted_at: number | string;
}

export interface ILoadedUser extends Omit<IUser, 'approved' | 'deleted_at'> {
  token: string;
}
export interface AuthRequest extends Partial<Pick< IUser, 'email' >> {
  password: string;
  rememberMe: boolean;
};

export type RegisterRequest = IUser & AuthRequest;

export type ForgotPasswordRequest = Pick<IUser, 'email'>

export type ResetPasswordRequest = { new_password: string, reset_token: string }

export type AuthResponse = {
  user: IUser;
  token: string;
};
