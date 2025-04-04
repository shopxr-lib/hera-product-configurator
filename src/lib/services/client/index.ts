import { AxiosInstance } from "axios";
import { to } from "../../utils";
import { AllClientResponse, ClientResponse, UpdateClientRequest } from "./types";

export class ClientService {
  constructor(private _axios: AxiosInstance) {}

  async getAllClients(page: number, limit: number, search: string, filters: Record<string, string>): Promise<[AllClientResponse | null, Error | null]> {
    const params: Record<string, unknown> = {
      page,
      limit,
      search,
      ...filters
    };
    const [res, err] = await to(this._axios.get<AllClientResponse>("/v1/clients/", { params }));
    if (err) {
      return [null, err];
    }
    const result = res?.data ?? null;
    return [result, null];
  }

  async updateClient(request: UpdateClientRequest): Promise<[ClientResponse | null, Error | null]> {
    const [res, err] = await to(this._axios.post<ClientResponse>(`/v1/clients/${request.client.id}/update`, request.client));
    if (err) {
      return [null, err];
    }
    return [res?.data ?? null, null];
  }
}