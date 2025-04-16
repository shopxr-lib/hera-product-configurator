import { CustomTable } from "../../components";
import { IContact } from "./types";
import { BuyingPhase, NotificationType, Role } from "../../types";
import { useCallback, useEffect, useState } from "react";
import { useContact } from "../../lib/hooks/useClient";
import { useUser } from "../../lib/hooks/useUser";
import { useSearchParams } from "react-router";
import { getLeadTrackerColumns } from "../../components/TableColumn";
import { z } from "zod";
import { showNotification } from "../../lib/utils";
import { useAuthContext } from "../../lib/hooks/useAuthContext";
import { getLeadTrackerFilters } from "../../components/TableFilter";
import debounce from "lodash/debounce";

export const LeadTracker = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState<number>(parseInt(searchParams.get('page') || '1'));
  const [limit, setLimit] = useState<number>(parseInt(searchParams.get('limit') || '10'));
  const [search, setSearch] = useState<string>(searchParams.get('search') || '');
  const [debouncedSearch, setDebouncedSearch] = useState<string>(search);

  const [filters, setFilters] = useState({
    buying_phase: searchParams.get('buying_phase') || '',
    visited_showroom: searchParams.get('visited_showroom') || '',
    purchased: searchParams.get('purchased') || '',
  });
  
  const { useUsersQuery } = useUser();
  const { data: userData } = useUsersQuery();
  const { user } = useAuthContext();
  const { useContactQuery, useUpdateMutation } = useContact();
  const { data: contactData, isLoading, isError } = useContactQuery(page, limit, debouncedSearch, filters);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSetSearch = useCallback(
    debounce((value: string) => {
      setDebouncedSearch(value);
      setPage(1);
    }, 500),
    []
  );

  useEffect(() => {
    if (!userData) return;
  },[user?.role, userData]);

  useEffect(() => {
    const filtersChanged = 
      filters.buying_phase !== searchParams.get('buying_phase') || 
      filters.visited_showroom !== searchParams.get('visited_showroom') ||
      filters.purchased !== searchParams.get('purchased');
    const paramsChanged = [
      String(page) !== searchParams.get('page'),
      String(limit) !== searchParams.get('limit'),
      debouncedSearch !== searchParams.get('search'),
      filtersChanged
    ].some(Boolean);

    if (paramsChanged) {
      const newParams = new URLSearchParams();
      newParams.set('page', String(page));
      newParams.set('limit', String(limit));
      if (debouncedSearch) newParams.set('search', debouncedSearch);
      if (filters.buying_phase) newParams.set('buying_phase', filters.buying_phase);
      if (filters.visited_showroom) newParams.set('visited_showroom', filters.visited_showroom);
      if (filters.purchased) newParams.set('purchased', filters.purchased);
      setSearchParams(newParams, { replace: true });
    }
  }, [page, debouncedSearch, limit, filters, searchParams, setSearchParams]);

  if (isError) return <p>Error fetching clients</p>;

  const clientUpdateSchema = z.object({
    id: z.number(),
    sales_person: z.object({
      email: z.string().email().optional(),
    }).optional(),
    followed_up_date_1: z.number().optional(),
    followed_up_date_2: z.number().optional(),
    followed_up_date_3: z.number().optional(),
  }).passthrough()
  .refine(
    (data) => !(data.followed_up_date_2 && !data.followed_up_date_1),
    {
      message: "Follow-up date 2 cannot be set without follow-up date 1.",
      path: ["followed_up_date_2"],
    }
  ).refine(
    (data) => !(data.followed_up_date_3 && !data.followed_up_date_2),
    {
      message: "Follow-up date 3 cannot be set without follow-up date 2.",
      path: ["followed_up_date_3"],
    }
  ).refine(
    (data) => !(data.followed_up_date_1 && data.followed_up_date_2 && data.followed_up_date_2 < data.followed_up_date_1),
    {
      message: "Follow-up date 2 cannot be earlier than follow-up date 1.",
      path: ["followed_up_date_2"],
    }
  ).refine(
    (data) => !(data.followed_up_date_2 && data.followed_up_date_3 && data.followed_up_date_3 < data.followed_up_date_2),
    {
      message: "Follow-up date 3 cannot be earlier than follow-up date 2.",
      path: ["followed_up_date_3"],
    }
  );

  const handleUpdate = async (editedItem: Partial<IContact>) => {
    try {
      const validatedData = clientUpdateSchema.parse({
        ...editedItem,
        id: Number(editedItem.id),
        customer_buying_phase: editedItem.customer_buying_phase
          ? Object.values(BuyingPhase).indexOf(editedItem.customer_buying_phase as unknown as BuyingPhase)
          : undefined,
        sales_person: editedItem.sales_person
          ? { email: editedItem.sales_person }
          : undefined,
      });
      await useUpdateMutation.mutate({ contact: validatedData as Partial<IContact>, page, limit, search, filters });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMsg = error.errors.map((err) => err.message).join("\n");
        showNotification(NotificationType.Error, errorMsg)
      }
    }
  };

  return (
    <CustomTable 
      data={contactData?.contacts || []} 
      dataLoading={isLoading}
      columns={
        getLeadTrackerColumns({ 
          allUsers: userData || [], 
          role: user?.role as Role
        })
      } 
      onSave={handleUpdate}
      searchInputProps={{
        searchKey: [
          'email',
          ...(user?.role === Role.Admin ? ['assigned salesperson'] : [])
        ],
        value: search,
        onChange: (value: string) => {
          setSearch(value);
          debouncedSetSearch(value)
        }
      }}
      filterProps={{
        filters: getLeadTrackerFilters,
        values: filters,
        onChange: (key: string, value: string) => {
          setFilters(prev => ({
            ...prev,
            [key]: value
          }));
          setPage(1); 
        }
      }}
      pageProps={{
        total: contactData?.totalPages || 1,
        value: page,
        itemsPerPage: limit,
        onPageChange: (value: number) => {
          setPage(value);
        },
        onItemsPerPageChange: (value: number) => {
          setLimit(value)
        }
      }}
    />
  )
};
