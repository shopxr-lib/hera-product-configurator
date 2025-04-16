import { useUser } from "../../lib/hooks/useUser";
import { IUser } from "../../lib/services/auth/types";
import { UserFilters } from "../../lib/services/user/types";

export interface ILeadTrackerColumnsProps {
  allUsers: IUser[];
  role: string;
}

export interface IUserManagementColumnProps {
  useApproveMutation: ReturnType<typeof useUser>['useApproveMutation'];
  useDeleteMutation: ReturnType<typeof useUser>['useDeleteMutation'];
  page: number;
  limit: number;
  search: string;
  filters: UserFilters
}