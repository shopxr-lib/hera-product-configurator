import { TextInput } from '@mantine/core';
import { ISearchInputProps } from './types';
import { IconSearch } from '@tabler/icons-react';
import { generateSearchPhrase } from '../../lib/utils';

const SearchInput = ({ value, onChange, searchKey }: ISearchInputProps) => {
  return (
    <TextInput
      size="md"
      w={600}
      label="Search"
      placeholder={`Search by any ${generateSearchPhrase(searchKey)}`}
      leftSection={<IconSearch size={16} stroke={1.5} />}
      value={value}
      onChange={(e) => onChange(e.currentTarget.value)}
    />
  );
};

export default SearchInput;
