import { IContact } from "../../../views/tracking/types"
import { PaginationRequest } from "../user/types";

export type AllContactsResponse = {
  total_pages: number | null;
  contacts: IContact[] | null;
}

export type ContactResponse = {
  contact: IContact | null;
}

export interface ContactFilters {
  buying_phase: string;
  visited_showroom: string;
  purchased: string;
}

export interface UpdateContactRequest extends PaginationRequest {
  contact: Partial<IContact>;
  filters?: ContactFilters;
}