import React, { useEffect, useState } from 'react';
import { IconLink } from '@tabler/icons-react';
import {
  Checkbox,
  Group,
  Table,
  Text,
  UnstyledButton,
  Select,
  Textarea,
  Anchor,
  Avatar,
  Stack,
  ThemeIcon,
  Divider,
  Tooltip,
  ComboboxItem,
  Code,
  Skeleton,
  Box,
  Badge,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { ACTION_ICONS, MAX_LENGTH } from '../../types/constants';
import { formatDate, humanize, truncateString } from '../../lib/utils';
import { Action } from '../../types';
import { ICustomTableProps, StandardColumn, Column, ActionColumn, MultilineColumn } from './types';
import { useAuthContext } from '../../lib/hooks/useAuthContext';
import { CustomModal, CustomPagination, SearchInput } from '../index';

export const CustomTable = <T extends { id: number | string }>({ data, dataLoading, columns, onSave, searchInputProps, filterProps, pageProps }: ICustomTableProps<T>) => {
   // For current selected items
   const [selection, setSelection] = useState<string[]>([]);

   // For data transformation
   const [transformedData, setTransformedData] = useState<T[] | null>(null);
 
   // To edit data
   const [editingId, setEditingId] = useState<string | null>(null);
   const [editedData, setEditedData] = useState<Record<string, unknown>>({});

   // Modal
   const [modalOpened, setModalOpened] = useState(false);
   const [pendingAction, setPendingAction] = useState<{
     action: Action;
     item: T;
     onAction?: (item: T) => void;
   } | null>(null);
   
   const { user } = useAuthContext();

  useEffect(() => {
    if (data === undefined) setTransformedData([])
    else {
      const formattedData = data.map((record) => {
        const newRecord = { ...record };
        columns.forEach((col) => {
          const key = col.key as keyof T;
          if ((col as StandardColumn<T>).options === 'boolean') {
            newRecord[key] = (record[key] ? "true" : "false") as T[keyof T];
          } else if (col.render) {
            newRecord[key] = col.render(record[key], record) as T[keyof T];
          }
        });
        return newRecord;
      });
      setTransformedData(formattedData)
    }
  }, [columns, data]);

  const toggleRow = (id: string) =>
    setSelection((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );

  const toggleAll = () =>
    setSelection((current) => (current.length === data.length ? [] : data.map((item) => String(item.id))));

  const handleEditChange = (id: string, key: string, value: unknown) => {
    setEditedData((prev) => ({
      ...prev,
      [id]: { ...(prev[id] || {}), [key]: value },
    }));
  };

  const handleAction = (action: Action, item: T, onAction?: (item: T) => void) => {
    setSelection([]);
    if (action === Action.Edit) {
      if (editingId !== String(item.id)) {
        setEditedData(prev => ({
          ...prev,
          [item.id]: { ...item }
        }));
      }
      setEditingId((prev) => (prev === String(item.id) ? null : String(item.id)));
      return;
    }
    setPendingAction({ action, item, onAction });
    setModalOpened(true);
  };

  const onConfirm = (id: number) => {
    if (editedData[id]) {
      const data = editedData[id] as Record<string, unknown>;
      Object.keys(data).forEach(key => {
        if (data[key] === 'None' || data[key] === '' || data[key] === 'N/A') {
          data[key] = undefined;
        }   
        else if (data[key] === undefined) {
          data[key] = null;
        }  
        else if (data[key] === null) {
          data[key] = 0;
        }
        else if (data[key] === 'true') {
          data[key] = true;
        }    
        else if (data[key] === 'false') {
          data[key] = false;
        }
        else if (!isNaN(Number(data[key])) && typeof data[key] === "string") {
          data[key] = Number(data[key]);
        }
      });
      if (onSave) {
        onSave(editedData[id] as Partial<T>);
      }
    }
    setEditingId(null);
    setEditedData((prev) => ({ ...prev, [id]: {} }));
  };
  
  const onClose = (id: number) => {
    setEditingId(null);
    setEditedData((prev) => ({ ...prev, [id]: {} }));
  };

  const renderIcon = (icon: React.ReactNode) =>
    icon ? (
      <ThemeIcon variant="transparent" c="gray" fw={100}>
        {icon}
      </ThemeIcon>
    ) : null;

  const renderActionButton = (
    key: Action,
    onClick: () => void
  ) => {
    const action = ACTION_ICONS[key];
    if (!action) return null;

    return (
      <Tooltip label={humanize(key)} key={key} withArrow>
        <ThemeIcon
          className="hover:cursor-pointer"
          variant="transparent"
          onClick={onClick}
          color={action.color}
        >
          {action.icon}
        </ThemeIcon>
      </Tooltip>
    );
  };

  const renderCellData = <T extends { id: string | number }>(
    item: T,
    col: Column<T>
  ) => {
    const { key, type, role, icon } = col;
    const { options } = col as StandardColumn<T>;
    const cellKey = key as keyof T;
    const value = item[cellKey];
    const editedValue = (editedData[item.id] as Record<string, unknown>)?.[String(cellKey)];

    // Editable cases
    if (editingId === String(item.id) && (!role || role === user?.role) && (type && !icon)) {
      const selectOptions: ComboboxItem[] = [
        ...(options === "boolean"
          ? [
              { label: "Yes", value: "true" },
              { label: "No", value: "false" },
            ]
          : (options || []) as ComboboxItem[]),
      ];

      switch (type) {
        case "select":
          return (
            <Select
              variant="filled"
              className='w-max'
              data={selectOptions as ComboboxItem[]}
              value={
                selectOptions?.find(opt => {
                  return (
                    opt.value === editedValue
                  )
                })?.value ?? null
              }
              onChange={val => handleEditChange(String(item.id), String(key), val)}
            />
          );
  
        case "textarea":
          return (
            <Textarea
              variant="filled"
              className='w-max'
              placeholder="Type..."
              value={editedValue ? String(editedValue): undefined}
              onChange={event => handleEditChange(String(item.id), String(key), event.currentTarget.value)}
            />
          );
  
        case "date":
          return (
            <DatePickerInput
              clearable
              className='w-full'
              variant="filled"
              placeholder="Set date"
              value={
                editedValue
                  ? new Date(Number(editedValue) * 1000)
                  : null
              }
              onChange={date =>
                handleEditChange(
                  String(item.id),
                  String(key),
                  date ? String(Math.floor(date.getTime() / 1000)) : null
                )
              }
            />
          );
      }
    }

    if (options === 'boolean') {
      const isTrue = value === 'true';
      return (
        <Badge color={isTrue ? 'green' : 'red'} fullWidth variant="light">
          {`${isTrue ? "Yes" : "No"}`}
        </Badge>
      )
    }

    // Read-only display cases
    switch (type) {
      case "user":
        return (
          <Group className='w-max' gap="sm">
            <Avatar size={32} src={""} radius={26} />
            <Text size="sm" fw={500}>{String(value)}</Text>
          </Group>
        );
  
      case "link":
        return (
          <Anchor href={String(value)} target="_blank" rel="noopener noreferrer" title={String(value)}>
            <Group gap={5}>
              <IconLink />
              {truncateString(String(value), MAX_LENGTH.LINK)}
            </Group>
          </Anchor>
        );
  
      case "date":
        return (
          <>
          {value ?
            <Text size="sm">
              {formatDate(Number(value), {
                year: "numeric",
                month: "short",
                day: "numeric",
                ...(icon && { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
              })}
            </Text>
            : <Code color="var(--mantine-color-blue-light)">Not Set</Code>}
            </>
        );
  
      default:
        return <Text size="sm">{value ? String(value) : 'N/A'}</Text>;
    }
  };

  const renderTableCell = (col: Column<T>, item: T) => {
    const { type, icon, key } = col;

    switch (type) {
      case "action": {
        const actionColumn = col as ActionColumn<T>;
        const actions = typeof actionColumn.actions === "function"
          ? actionColumn.actions(item)
          : actionColumn.actions;     

        return (
          <>
          <Group className='w-max' gap={5}>
            {editingId === null &&
              actions?.map(({ key, onAction }) =>
                renderActionButton(key, () => {
                  handleAction(key, item, onAction);
                })
              )}

            {editingId === String(item.id) &&
              ([Action.Confirm, Action.Close] as const).map((key) =>
                renderActionButton(key, () =>
                  key === Action.Close ? onClose(item.id as number) : onConfirm(item.id as number)
                )
              )}
          </Group>
          <CustomModal
            type="confirmation"
            opened={modalOpened}
            onClose={() => {
              setModalOpened(false);
              setPendingAction(null);
            }}
            onConfirm={() => {
              if (pendingAction?.onAction && pendingAction?.item) {
                pendingAction.onAction(pendingAction.item);
              }
              setModalOpened(false);
              setPendingAction(null);
            }}
          />
          </>
        )
      }
  
      case "multiline": {
        const data = item[key] as Array<Record<string, unknown>>;
        return (
          <Stack gap={4}>
            {Array.isArray(data) ? (
              data.map((entry, idx) => (
                <Stack key={idx} gap="xs">
                  {idx !== 0 && <Divider size={2} variant='dashed' my="sm" />}
                  {col.data.map((obj, index) => (
                    <Group className='w-max' key={index} gap={5}>
                      {renderIcon(obj.icon)}
                      {renderCellData(entry as T, obj as unknown as MultilineColumn<T>)}
                    </Group>
                  ))}
                </Stack>
              ))
            ) : (
              <Stack gap="sm">
                {col.data.map((obj, index) => (
                  <Group key={index} gap={5}>
                    {renderIcon(obj.icon)}
                    {renderCellData(item, obj as unknown as MultilineColumn<T>)}
                  </Group>
                ))}
              </Stack>
            )}
          </Stack>
        );
      }
  
      default:
        return (
          <Group className={`${editingId === null ? 'w-max' : 'w-full'}`} gap={5}>
            {renderIcon(icon)}
            {renderCellData(item, col)}
          </Group>
        );
    }
  };

  const renderHead = (col: Column<T>) => {
    const { key, label, visible } = col;
    if (visible !== undefined && !visible) return;
    return (
      <Table.Th key={String(key)} className="p-0 bg-brand-700 text-white">
        <UnstyledButton 
          className="w-max flex justify-between p-2 hover:bg-gray-100">
          <Group justify="space-between">
            <Text fw={500} fz="sm">{label}</Text>
          </Group>
        </UnstyledButton>
      </Table.Th>
    )
  }

  const renderBody = (item: T) => {
    const selected = selection.includes(String(item.id));
    return (
      <Table.Tr key={item.id} className={selected ? "bg-blue-100" : ""}>
        <Table.Td>
          <Checkbox
            className="hover:cursor-pointer"
            checked={selected}
            onChange={() => toggleRow(String(item.id))}
          />
        </Table.Td>

        {columns.map((col) => {
        if (col.visible !== undefined && !col.visible) return;
        return (
          <Table.Td key={String(col.key)}>
            {renderTableCell(col, item)}
          </Table.Td>
        )})}
      </Table.Tr>
    )
  }

  const tableData = {
    head: columns.map((col: Column<T>) => renderHead(col)),
    body: transformedData?.map((item: T) => (renderBody(item)))
  };

  return (
    <>
      <Group gap="xs" mb="md" w={'max-content'}>
        {searchInputProps && 
          <SearchInput 
            searchKey={searchInputProps?.searchKey}
            value={searchInputProps?.value} 
            onChange={searchInputProps?.onChange}
          />
        }
        
        {/* Filters */}
        {filterProps?.filters.map((filter) => (
          <Select
            clearable
            label={filter.label}
            key={filter.key}
            placeholder={filter.label}
            value={filterProps.values[filter.key]}
            onChange={(value) => {
              filterProps.onChange(filter.key, value || '');
            }}
            data={filter.options}
            onBlur={() => {}}
          />
        ))}
      </Group>
      <Group justify="space-between" w={'max-content'}>
        <Box className="max-h-[calc(100vh-300px)] w-full overflow-y-auto">
          <Table striped withTableBorder withColumnBorders horizontalSpacing='lg' verticalSpacing="xs" mt={20}>
            {/* Table Header */}
            <Table.Thead className={`bg-brand-500 text-brand-900 transition-shadow sticky top-0 z-10`}>
              <Table.Tr>
                <Table.Th w={40}>
                  <Checkbox
                    className="hover:cursor-pointer"
                    onChange={toggleAll}
                    checked={selection.length > 0 && selection.length === data.length}
                    indeterminate={selection.length > 0 && selection.length !== data.length}
                  />
                </Table.Th>
                {tableData.head}
              </Table.Tr>
            </Table.Thead>

            {/* Table Body */}
            <Table.Tbody>
              {dataLoading  
                ? <Table.Tr>
                    <Table.Td colSpan={columns.length + 1}>
                      <Group my={20}>
                        {Array(5).fill(null).map((_, index) => (
                          <Box key={index} w="100%">
                            {index > 0 && <Divider size={1} mb="md" />}
                            <Skeleton visible height={30} radius="sm" />
                          </Box>
                        ))}
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                : transformedData && transformedData.length > 0 ? tableData.body : (
                <Table.Tr>
                  <Table.Td colSpan={columns.length + 1}>
                    <Text fw={500} ta="center">Nothing found</Text>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </Box>
        {pageProps && (
          <CustomPagination
            total={pageProps.total}
            currentPage={pageProps.value}
            itemsPerPage={pageProps.itemsPerPage}
            onPageChange={(page) => pageProps.onPageChange(page)}
            onItemsPerPageChange={(itemsPerPage) => pageProps.onItemsPerPageChange(itemsPerPage)}
          />
        )}
      </Group>
  </>
  );
}
