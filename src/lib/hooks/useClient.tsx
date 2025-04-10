import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IContact } from "../../views/tracking/types";
import { useService } from "./useService";
import { AllContactsResponse, ContactResponse, UpdateContactRequest } from "../services/contact/types";
import { showNotification } from "../utils";
import { NotificationType } from "../../types";

export const useContact = () => {
  const queryClient = useQueryClient();
  const { contact } = useService();
  
  const loadClients = () => {
    return queryClient.getQueryData<IContact[]>(['contacts']);
  };

  const useUpdateMutation = useMutation<ContactResponse, Error, UpdateContactRequest>({
    mutationFn: async (data) => {
      const [res, err] = await contact.updateContact(data);
      if (err) throw err;
      return res!;
    },
    onSuccess: (payload, variables) => {
      const currentPage = variables.page ?? 1;
      const currentLimit = variables.limit ?? 10;
      const currentSearch = variables.search ?? '';
      const currentFilters = variables.filters ?? { buying_phase: '', visited_showroom: '', purchased: '' };

      queryClient.setQueryData(
        ['contacts', currentPage, currentLimit, currentSearch, currentFilters],
        (oldData: AllContactsResponse | undefined) => {
        if (!oldData) return { contacts: [], totalPages: 0 };
        const updatedContacts = oldData.contacts?.map((item) =>
          item.id === payload.contact?.id
            ? {
                ...item,
                interested_products: payload.contact.interested_products,
                customer_buying_phase: payload.contact.customer_buying_phase,
                key_collection_date: payload.contact.key_collection_date,
                notes: payload.contact.notes,
                visited_showroom: payload.contact.visited_showroom,
                purchased: payload.contact.purchased,
                followed_up_date_1: payload.contact.followed_up_date_1,
                followed_up_date_2: payload.contact.followed_up_date_2,
                followed_up_date_3: payload.contact.followed_up_date_3,
                next_showroom_appointment_date: payload.contact.next_showroom_appointment_date,
                sales_person: payload.contact.sales_person,
              }
            : item
        );
  
        return { ...oldData, contacts: updatedContacts };
      });
      showNotification(NotificationType.Success, "Update Successful");
    },
    onError: (error) => {
      showNotification(NotificationType.Error, "Update Failed", error.message);
    },
  });  

  const useContactQuery = (page: number, limit: number, search: string, filters: Record<string, string>) => {
    return useQuery({
      queryKey: ['contacts', page, limit, search, filters],
      queryFn: async () => {
        const [res, err] = await contact.getAllContacts(page, limit, search, filters);
        if (err) {
          throw err;
        }
        return { contacts: res?.contacts || [], totalPages: res?.total_pages };
      },
    });
  }
  
  return {
    loadClients,
    useContactQuery,
    useUpdateMutation,
  };
};
