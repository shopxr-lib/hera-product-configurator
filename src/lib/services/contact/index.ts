import { AxiosInstance } from "axios";
import { to } from "../../utils";
import { AllContactsResponse, ContactResponse, UpdateContactRequest } from "./types";

export class ContactService {
  constructor(private _axios: AxiosInstance) {}

  async getAllContacts(page: number, limit: number, search: string, filters: Record<string, string>): Promise<[AllContactsResponse | null, Error | null]> {
    const params: Record<string, unknown> = {
      page,
      limit,
      search,
      ...filters
    };
    const [res, err] = await to(this._axios.get<AllContactsResponse>("/v1/contacts/", { params }));
    if (err) {
      return [null, err];
    }
    const result = res?.data ?? null;
    return [result, null];
  }

  async updateContact(request: UpdateContactRequest): Promise<[ContactResponse | null, Error | null]> {
    const [res, err] = await to(this._axios.post<ContactResponse>(`/v1/contacts/${request.contact.id}/update`, request.contact));
    if (err) {
      return [null, err];
    }
    return [res?.data ?? null, null];
  }
}