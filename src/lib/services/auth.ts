import { AxiosInstance } from "axios";
import { to } from "../utils";

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
}

export type AuthRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = AuthRequest & {
  name: string;
  role?: string;
};

type AuthResponse = {
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  token: string;
};
