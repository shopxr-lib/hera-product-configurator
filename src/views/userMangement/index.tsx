import { useEffect, useState } from "react";
import { useUser } from "../../lib/hooks/useUser";
import { Role } from "../../types";
import { CustomTable } from "../../components";
import { IUser } from "../../lib/services/auth/types";
import { useSearchParams } from "react-router";
import { getUserManagementColumns } from "../../components/tableColumn";
import { useAuthContext } from "../../lib/hooks/useAuthContext";

export const UserManagement = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState<number>(parseInt(searchParams.get('page') || '1'));
  const [limit, setLimit] = useState<number>(parseInt(searchParams.get('limit') || '10'));
  const [search, setSearch] = useState<string>(searchParams.get('search') || '');

  const [filters, setFilters] = useState({
    approved: searchParams.get('approved') || '',
    deleted: searchParams.get('deleted') || '',
  });

  const { loadUser, usePaginatedUsersQuery, useApproveMutation, useDeleteMutation } = useUser();
  
  // Fetching user data
  const { user } = useAuthContext();

  // Fetching paginated users
  const { data: usersData, isLoading, isError } = usePaginatedUsersQuery(page, limit, search, filters);


  const filterOptions = [
    {
      key: 'approved',
      label: 'Approved',
      options: [
        { value: 'true', label: 'Yes' },
        { value: 'false', label: 'No' },
      ]
    },
    {
      key: 'deleted',
      label: 'Deleted',
      options: [
        { value: 'true', label: 'Yes' },
        { value: 'false', label: 'No' },
      ]
    }
  ];

  useEffect(() => {
    const filtersChanged = 
      filters.approved !== searchParams.get('approved') || 
      filters.deleted !== searchParams.get('deleted');
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
      if (filters.approved) newParams.set('approved', filters.approved);
      if (filters.deleted) newParams.set('deleted', filters.deleted);
      setSearchParams(newParams, { replace: true });
    }
  }, [page, search, limit, filters]);

  useEffect(() => {
    if (!user) loadUser();
  }, [user]);

  if (isError) return <p>Error fetching users</p>;
  if (user?.role !== Role.Admin) return null;

  return(
    <CustomTable 
      data={usersData?.users?.filter((user: IUser) => user.role !== Role.Admin) || []} 
      dataLoading={isLoading} 
      columns={getUserManagementColumns({useApproveMutation, useDeleteMutation, page, limit, search, filters})}
      searchInputProps={{
        searchKey: ['email'],
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
        total: usersData?.totalPages || 1,
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
}