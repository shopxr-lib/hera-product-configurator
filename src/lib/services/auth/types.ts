export type AuthRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = AuthRequest & {
  name: string;
  role?: string;
};

export type AuthResponse = {
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  token: string;
};
