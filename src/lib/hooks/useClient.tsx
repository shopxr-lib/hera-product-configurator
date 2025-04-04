import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IClient } from "../../views/tracking/types";
import { useService } from "./useService";
import { AllClientResponse, ClientResponse, UpdateClientRequest } from "../services/client/types";
import { showNotification } from "../utils";
import { NotificationType } from "../../types";

export const useClient = () => {
  const queryClient = useQueryClient();
  const { client } = useService();
  
  const loadClients = () => {
    return queryClient.getQueryData<IClient[]>(['clients']);
  };

  const useUpdateMutation = useMutation<ClientResponse, Error, UpdateClientRequest>({
    mutationFn: async (data) => {
      const [res, err] = await client.updateClient(data);
      if (err) throw err;
      return res!;
    },
    onSuccess: (payload, variables) => {
      const currentPage = variables.page ?? 1;
      const currentLimit = variables.limit ?? 10;
      const currentSearch = variables.search ?? '';
      const currentFilters = variables.filters ?? { buying_phase: '', visited_showroom: '', purchased: '' };

      queryClient.setQueryData(
        ['clients', currentPage, currentLimit, currentSearch, currentFilters],
        (oldData: AllClientResponse | undefined) => {
        if (!oldData) return { clients: [], totalPages: 0 };
        const updatedClients = oldData.clients?.map((item) =>
          item.id === payload.client?.id
            ? {
                ...item,
                interested_products: payload.client.interested_products,
                customer_buying_phase: payload.client.customer_buying_phase,
                key_collection_date: payload.client.key_collection_date,
                notes: payload.client.notes,
                visited_showroom: payload.client.visited_showroom,
                purchased: payload.client.purchased,
                followed_up_date_1: payload.client.followed_up_date_1,
                followed_up_date_2: payload.client.followed_up_date_2,
                followed_up_date_3: payload.client.followed_up_date_3,
                next_showroom_appointment_date: payload.client.next_showroom_appointment_date,
                sales_person: payload.client.sales_person,
              }
            : item
        );
  
        return { ...oldData, clients: updatedClients };
      });
      showNotification(NotificationType.Success, "Update Successful");
    },
    onError: (error) => {
      showNotification(NotificationType.Error, "Update Failed", error.message);
    },
  });  

  const useClientQuery = (page: number, limit: number, search: string, filters: Record<string, string>) => {
    return useQuery({
      queryKey: ['clients', page, limit, search, filters],
      queryFn: async () => {
        const [res, err] = await client.getAllClients(page, limit, search, filters);
        if (err) {
          throw err;
        }
        return { clients: res?.clients || [], totalPages: res?.total_pages };
      },
    });
  }
  
  return {
    loadClients,
    useClientQuery,
    useUpdateMutation,
  };
};
