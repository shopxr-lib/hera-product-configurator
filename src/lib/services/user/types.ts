import { IUser } from "../auth/types";

export type Response = {
  message: string;
}

export interface UserResponse extends Response {
  user: IUser | null;
}

export interface AllUsersResponse extends Response {
  users: IUser[] | null;
  total_pages?: number | null;
}

export interface UserFilters {
  approved: string;
  deleted: string;
}

export interface PaginationRequest {
  page?: number;
  limit?: number;
  search?: string;
}

export interface ApproveRequest extends PaginationRequest { 
  id: string, 
  approve: string;
  filters?: UserFilters;
};
export interface DeleteRequest extends PaginationRequest { 
  id: string, 
  delete: string; 
  filters?: UserFilters;
};