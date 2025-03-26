import { AxiosInstance } from "axios";
import { to } from "../../utils";
import { AuthRequest, AuthResponse, RegisterRequest } from "./types";

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

  private async authenticate(
    endpoint: string,
    request: AuthRequest | RegisterRequest
  ): Promise<[AuthResponse | null, Error | null]> {
    const [res, err] = await to(
      this._axios.post<AuthResponse>(endpoint, request)
    );
    if (err) {
      return [null, err];
    }
    return [res?.data ?? null, null];
  }

  async logout() {
    return new Promise((resolve) => {
      localStorage.removeItem("token");
      resolve(true);
    });
  }
}