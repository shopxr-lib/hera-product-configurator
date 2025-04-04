import { CustomTable } from "../../components";
import { IClient } from "./types";
import { BuyingPhase, NotificationType, Role } from "../../types";
import { useEffect, useState } from "react";
import { useClient } from "../../lib/hooks/useClient";
import { useUser } from "../../lib/hooks/useUser";
import { useSearchParams } from "react-router";
import { getLeadTrackerColumns } from "../../components/tableColumn";
import { z } from "zod";
import { showNotification } from "../../lib/utils";
import { useAuthContext } from "../../lib/hooks/useAuthContext";

export const LeadTracker = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState<number>(parseInt(searchParams.get('page') || '1'));
  const [limit, setLimit] = useState<number>(parseInt(searchParams.get('limit') || '10'));
  const [search, setSearch] = useState<string>(searchParams.get('search') || '');

  const [filters, setFilters] = useState({
    buying_phase: searchParams.get('buying_phase') || '',
    visited_showroom: searchParams.get('visited_showroom') || '',
    purchased: searchParams.get('purchased') || '',
  });
  
  const { useUsersQuery } = useUser();
  const { data: userData } = useUsersQuery();
  const { user } = useAuthContext();
  const { useClientQuery, useUpdateMutation } = useClient();
  const { data: clientData, isLoading, isError } = useClientQuery(page, limit, search, filters);

  const filterOptions = [
    {
      key: 'buying_phase',
      label: 'Buysing Phase',
      options: Object.values(BuyingPhase).map((value, index) => ({
        label: value,
        value: index.toString(),
      }))
    },
    {
      key: 'visited_showroom',
      label: 'Showroom',
      options: [
        { value: 'true', label: 'Visited' },
        { value: 'false', label: 'Not Visited' },
      ]
    },
    {
      key: 'purchased',
      label: 'Purchase',
      options: [
        { value: 'true', label: 'Done' },
        { value: 'false', label: 'Not Done' },
      ]
    }
  ];

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
      search !== searchParams.get('search'),
      filtersChanged
    ].some(Boolean);

    if (paramsChanged) {
      const newParams = new URLSearchParams();
      newParams.set('page', String(page));
      newParams.set('limit', String(limit));
      if (search) newParams.set('search', search);
      if (filters.buying_phase) newParams.set('buying_phase', filters.buying_phase);
      if (filters.visited_showroom) newParams.set('visited_showroom', filters.visited_showroom);
      if (filters.purchased) newParams.set('purchased', filters.purchased);
      setSearchParams(newParams, { replace: true });
    }
  }, [page, search, limit, filters]);

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

  const handleUpdate = async (editedItem: Partial<IClient>) => {
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
      await useUpdateMutation.mutate({ client: validatedData as Partial<IClient>, page, limit, search, filters });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMsg = error.errors.map((err) => err.message).join("\n");
        showNotification(NotificationType.Error, errorMsg)
      }
    }
  };

  return (
    <CustomTable 
      data={clientData?.clients || []} 
      dataLoading={isLoading}
      columns={
        getLeadTrackerColumns({ 
          allUsers: userData || [], 
          role: user?.role as Role
        })
      } 
      onSave={handleUpdate}
      searchInputProps={{
        searchKey: ['email', 'assigned salesperson'],
        value: search,
        onChange: (value: string) => {
          setSearch(value);
          setPage(1);
        }
      }}
      filterProps={{
        filters: filterOptions,
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
        total: clientData?.totalPages || 1,
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
