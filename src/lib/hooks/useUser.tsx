import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ILoadedUser, IUser } from "../services/auth/types";
import { useService } from "./useService";
import { ApproveRequest, DeleteRequest, UserResponse } from "../services/user/types";
import { showNotification } from "../utils";
import { NotificationType } from "../../types";

export const useUser = () => {
  const queryClient = useQueryClient();
  const { user } = useService();

  const loadUser = () => {
    return queryClient.getQueryData<ILoadedUser>(['user']);
  };

  const loadAllUsers = () => {
    return queryClient.getQueryData<IUser[]>(['users']);
  }

  const useUsersQuery = () => {
    return useQuery({
      queryKey: ['users'],
      queryFn: async () => {
        const [res, err] = await user.getAllUsers();
        if (err) {
          throw err;
        }
        return res?.users || [];
      }
    });
  }

  const usePaginatedUsersQuery = (page?: number, limit?: number, search?: string, filters?: Record<string, string>) => {
    return useQuery({
      queryKey: ['paginatedUsers', page, limit, search, filters],
      queryFn: async () => {
        const [res, err] = await user.getAllUsers(page, limit, search, filters);
        if (err) {
          throw err;
        }
        return { users: res?.users || [], totalPages: res?.total_pages};
      }
    });
  }

  const useApproveMutation = useMutation<UserResponse, Error, ApproveRequest>({
    mutationFn: async (data) => {
      const [res, err] = await user.approveUser(data)
      if (err) throw err;
      return res!;
    },
    onSuccess: (payload, variables) => {
      const currentPage = variables.page ?? 1;
      const currentLimit = variables.limit ?? 10;
      const currentSearch = variables.search ?? '';
      const currentFilters = variables.filters ?? { approved: '', deleted: '' };
  
      queryClient.setQueryData(
          ['paginatedUsers', currentPage, currentLimit, currentSearch, currentFilters], 
          (oldData: { users: IUser[]; totalPages: number } | undefined) => {
        if (!oldData) return { users: [], totalPages: 0 };
        const updatedUsers = oldData.users.map((item) =>
          item.id === payload.user?.id
            ? { ...item, approved: payload.user?.approved }
            : item
        );

        return { ...oldData, users: updatedUsers };
      });
      const msgType = variables.approve === 'false'
        ? "Approved"
        : "Reset Approve";
      showNotification(NotificationType.Success, `${msgType} Successfully`);
    },
    onError: (error, variables) => {
      const msgType = variables.approve === 'false'
        ? "Approval"
        : "Reset Approval";
      showNotification(NotificationType.Error, `${msgType} Failed`, error.message);
    },
  });

  const useDeleteMutation = useMutation<UserResponse, Error, DeleteRequest>({
    mutationFn: async (data) => {
      const [res, err] = await user.deleteUser(data)
      if (err) throw err;
      return res!;
    },
    onSuccess: (payload, variables) => {
      const currentPage = variables.page ?? 1;
      const currentLimit = variables.limit ?? 10;
      const currentSearch = variables.search ?? '';
      const currentFilters = variables.filters ?? { approved: '', deleted: '' };
  
      queryClient.setQueryData(
        ['paginatedUsers', currentPage, currentLimit, currentSearch, currentFilters], 
        (oldData: { users: IUser[]; totalPages: number } | undefined) => {
        if (!oldData) return { users: [], totalPages: 0 };
        const updatedUsers = oldData.users.map((item) =>
          item.id === payload.user?.id
            ? { ...item, deleted_at: payload.user?.deleted_at }
            : item
        );

        return { ...oldData, users: updatedUsers };
      });
      const msgType = variables.delete === 'false'
        ? "Deleted"
        : "Restored";
      showNotification(NotificationType.Success, `${msgType} Successfully`);
    },
    onError: (error, variables) => {
      const msgType = variables.delete === 'false'
        ? "Deletion"
        : "Restoration";
      showNotification(NotificationType.Error, `${msgType} Failed`, error.message);
    },
  });

  return {
    loadUser,
    loadAllUsers,
    useUsersQuery,
    usePaginatedUsersQuery,

    useApproveMutation,
    useDeleteMutation
  };
};
