import { useEffect, useState } from 'react';
import { IconChevronDown, IconChevronUp, IconLink, IconSearch, IconSelector } from '@tabler/icons-react';
import {
  Center,
  Checkbox,
  Group,
  ScrollArea,
  Table,
  Text,
  TextInput,
  UnstyledButton,
  Select,
  Textarea,
  Anchor,
  Avatar,
  Stack,
  ThemeIcon,
  Divider,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { Column, ICustomTableProps, MultilineColumn, StandardColumn } from './types';
import { MAX_LENGTH } from '../../types/constants';
import { truncateString } from '../../lib/utils';

export const CustomTable = <T extends { id: string }>({ data, columns }: ICustomTableProps<T>) => {
  const [selection, setSelection] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [sortedData, setSortedData] = useState(data);
  const [sortBy, setSortBy] = useState<keyof T | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setSortedData(sortData(data, sortBy, reverseSortDirection, search));
  }, [data]);

  const filterData = (items: T[], query: string) => {
    const lowerCaseQuery = query.toLowerCase().trim();
    return items.filter((item) =>
      columns.some((col) => String(item[col.key]).toLowerCase().includes(lowerCaseQuery))
    );
  };

  const sortData = (items: T[], sortField: keyof T | null, reversed: boolean, query: string) => {
    if (!sortField) return filterData(items, query);
    return filterData(
      [...items].sort((a, b) =>
        reversed
          ? String(b[sortField]).localeCompare(String(a[sortField]))
          : String(a[sortField]).localeCompare(String(b[sortField]))
      ),
      query
    );
  };

  const toggleRow = (id: string) =>
    setSelection((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );

  const toggleAll = () =>
    setSelection((current) => (current.length === data.length ? [] : data.map((item) => item.id)));

  const setSorting = (field: keyof T) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(data, field, reversed, search));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedData(sortData(data, sortBy, reverseSortDirection, value));
  };

  const renderIcon = (icon: React.ReactNode) =>
    icon ? (
      <ThemeIcon variant="transparent" c="gray" fw={100}>
        {icon}
      </ThemeIcon>
    ) : null;

  const renderCell = <T extends { id: string }>(item: T, col: Column<T>, onChange?: (id: string, value: string) => void) => {
    const value = item[col.key as keyof T];
  
    switch ((col as StandardColumn<T>).type) {
      case 'link':
        return value ? (
          <Anchor href={String(value)} target="_blank" rel="noopener noreferrer" title={String(value)}>
            <Group gap={5}>
              <IconLink />
              {truncateString(String(value), MAX_LENGTH.LINK)}
            </Group>
          </Anchor>
        ) : '-';
  
      case 'user':
        return (
          <Group gap="sm">
            <Avatar size={32} src={""} radius={26} />
            <Text size="sm" fw={500}>
              {String(value)}
            </Text>
          </Group>
        );
  
      case 'select':
        return (
          <Select
            variant="filled"
            data={(col as StandardColumn<T>).options}
            value={String(value ?? 'None')}
            onChange={(val) => onChange?.(item.id, val || '')}
          />
        );
  
      case 'textarea':
        return (
          <Textarea
            variant='filled'
            placeholder="Type.."
            rows={1}
            value={String(value ?? '')}
            onChange={(event) => onChange?.(item.id, event.currentTarget.value)}
          />
        );
  
      case 'date':
        return (
          <DatePickerInput
            clearable
            variant='filled'
            placeholder="Set date"
            value={value ? new Date(value as string) : null}
            onChange={(date) => onChange?.(item.id, date ? date.toISOString() : '')}
            w={"60%"}
          />
        );
  
      default:
        return <Text size="sm">{value ? String(value) : '-'}</Text>;
    }
  };  

  return (
    <>
      <TextInput
        placeholder="Search by any field"
        ml={'sm'}
        mb="md"
        w={600}
        leftSection={<IconSearch size={16} stroke={1.5} />}
        value={search}
        onChange={handleSearchChange}
      />
      <ScrollArea w={3900} h={600} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
        <Table horizontalSpacing="md" verticalSpacing="xs" miw={700} layout="fixed">
          <Table.Thead className={`sticky top-0 bg-white transition-shadow ${scrolled ? 'shadow-md' : ''}`}>
            <Table.Tr>
              <Table.Th w={40}>
                <Checkbox
                  className="hover:cursor-pointer"
                  onChange={toggleAll}
                  checked={selection.length === data.length}
                  indeterminate={selection.length > 0 && selection.length !== data.length}
                />
              </Table.Th>
              {columns.map((col: Column<T>) => (
                <Table.Th key={String(col.key)} className="p-0">
                  <UnstyledButton onClick={() => setSorting(col.key)} className="w-full flex justify-between p-2 hover:bg-gray-100">
                    <Group justify="space-between">
                      <Text fw={500} fz="sm">
                        {col.label}
                      </Text>
                      {col.type !== 'multiline' && col.sort &&
                        <Center className="w-5 h-5 rounded-md">
                          {sortBy === col.key ? (
                            reverseSortDirection ? (
                              <IconChevronUp size={16} stroke={1.5} />
                            ) : (
                              <IconChevronDown size={16} stroke={1.5} />
                            )
                          ) : (
                            <IconSelector size={16} stroke={1.5} />
                          )}
                        </Center>
                      }
                    </Group>
                  </UnstyledButton>
                </Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {sortedData.length > 0 ? (
              sortedData.map((item: T) => {
                const selected = selection.includes(item.id);
                return (
                  <Table.Tr key={item.id} className={selected ? "bg-blue-100" : ""}>
                    <Table.Td>
                      <Checkbox className="hover:cursor-pointer" checked={selected} onChange={() => toggleRow(item.id)} />
                    </Table.Td>
                    {columns.map((col: Column<T>) => (
                      <Table.Td key={String(col.key)}>
                        {col.type === 'multiline' ? (
                          <Stack gap={4}>
                            {Array.isArray(item[col.key]) ? (
                              (item[col.key] as Array<Record<string, unknown>>).map((entry, idx) => (
                                <Stack key={idx} gap="xs">
                                  {idx !== 0 && <Divider my="sm" />}
                                  {col.data.map((obj, index) => (
                                    <Group key={index} gap={5}>
                                      {renderIcon(obj.icon)}
                                      {renderCell(entry as T, obj as unknown as MultilineColumn<T>)}
                                    </Group>
                                  ))}
                                </Stack>
                              ))
                            ) : (
                              <Stack gap="sm">
                                {col.data.map((obj, index) => (
                                  <Group key={index} gap={5}>
                                    {renderIcon(obj.icon)}
                                    {renderCell(item, obj as unknown as MultilineColumn<T>)}
                                  </Group>
                                ))}
                              </Stack>
                            )}
                          </Stack>
                        ) : (
                          <Group gap={5}>
                            {col.icon &&
                              <ThemeIcon variant='transparent' c={"gray"} fw={100}>
                                {col.icon}
                              </ThemeIcon>
                            }
                            {renderCell(item, col, col.onChange)}
                          </Group>
                        )}
                    </Table.Td>
                    ))}
                  </Table.Tr>
                );
              })
            ) : (
              <Table.Tr>
                <Table.Td colSpan={columns.length + 1}>
                  <Text fw={500} ta="center">
                    Nothing found
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </ScrollArea>
      </>
  );
}
