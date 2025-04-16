import React from 'react';
import { Select, Group, Pagination } from '@mantine/core';

interface PaginationComponentProps {
  total: number;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
}

const ItemsPerPageOptions = [10, 25, 50];

const CustomPagination: React.FC<PaginationComponentProps> = ({
  total,
  currentPage,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}) => {
  return (
    <Group justify="space-between" mt="md">
      <Select
        data={ItemsPerPageOptions.map((value) => ({
          value: String(value),
          label: `${value} items`,
        }))}
        value={String(itemsPerPage)}
        onChange={(value) => {
          onItemsPerPageChange(Number(value));
        }}
        style={{ width: 150 }}
      />
      <Pagination
        total={total}
        value={currentPage}
        onChange={onPageChange}
      />
    </Group>
  );
};

export default CustomPagination;