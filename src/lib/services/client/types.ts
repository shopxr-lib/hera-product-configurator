import { IClient } from "../../../views/tracking/types"
import { PaginationRequest } from "../user/types";

export type AllClientResponse = {
  total_pages: number | null;
  clients: IClient[] | null;
}

export type ClientResponse = {
  client: IClient | null;
}

export interface ClientFilters {
  buying_phase: string;
  visited_showroom: string;
  purchased: string;
}

export interface UpdateClientRequest extends PaginationRequest {
  client: Partial<IClient>;
  filters?: ClientFilters;
}