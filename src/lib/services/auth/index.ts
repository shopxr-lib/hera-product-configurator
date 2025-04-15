import { AxiosInstance } from "axios";
import { to } from "../../utils";
import { AuthRequest, AuthResponse, ForgotPasswordRequest, RegisterRequest, ResetPasswordRequest } from "./types";
import { UserResponse } from "../user/types";

export class AuthService {
  constructor(private _axios: AxiosInstance) {}

  async login(
    request: AuthRequest
  ): Promise<[AuthResponse | null, Error | null]> {
    return this.authenticate("/v1/auth/login", request);
  }

  async register(
    request: RegisterRequest
  ): Promise<[AuthResponse | null, Error | null]> {
    return this.authenticate("/v1/auth/register", request);
  }

  async resetPassword(
    request: ResetPasswordRequest
  ): Promise<[AuthResponse | null, Error | null]> {
    return this.authenticate("/v1/auth/reset-password", request)
  }

  private async authenticate(
    endpoint: string,
    request: AuthRequest | RegisterRequest | ResetPasswordRequest
  ): Promise<[AuthResponse | null, Error | null]> {
    const [res, err] = await to(
      this._axios.post<AuthResponse>(endpoint, request)
    );
    if (err) {
      return [null, err];
    }
    return [res?.data ?? null, null];
  }

  async forgotPassword(
    request: ForgotPasswordRequest
  ): Promise<[void, Error | null]> {
    const [, err] = await to(
      this._axios.post<AuthResponse>("/v1/auth/forgot-password", request)
    );
    if (err) {
      return [undefined, err];
    }
    return [undefined, null];
  }
  
  async getUser(): Promise<[UserResponse | null, Error | null]> {
    const [res, err] = await to(this._axios.get<UserResponse>("/v1/users/me"));
    if (err) {
      return [null, err];
    }
    return [res?.data ?? null, null];
  }
}