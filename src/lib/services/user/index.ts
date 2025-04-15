import { AxiosInstance } from "axios";
import { to } from "../../utils";
import { ApproveRequest, UserResponse, AllUsersResponse, DeleteRequest } from "./types";

export class UserService {
  constructor(private _axios: AxiosInstance) {}

  async getAllUsers(page?: number, limit?: number, search?: string, filters?: Record<string, string>): Promise<[AllUsersResponse | null, Error | null]> {
    const params: Record<string, unknown> = {
      page,
      limit,
      search,
      ...filters
    };
    const [res, err] = await to(this._axios.get<AllUsersResponse>("/v1/users/", { params }));
    if (err) {
      return [null, err];
    }
    const result = res?.data ?? null;
    return [result, null];
  }

  async approveUser(request: ApproveRequest): Promise<[UserResponse | null, Error | null]> {
    const [res, err] = await to(this._axios.post<UserResponse>(`/v1/users/${request.id}/approve`));
    if (err) {
      return [null, err];
    }
    return [res?.data ?? null, null];
  }

  async deleteUser(request: DeleteRequest): Promise<[UserResponse | null, Error | null]> {
    const [res, err] = await to(this._axios.post<UserResponse>(`/v1/users/${request.id}/delete`));
    if (err) {
      return [null, err];
    }
    return [res?.data ?? null, null];
  }
}