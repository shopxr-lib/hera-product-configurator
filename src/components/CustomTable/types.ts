import { ComboboxItem } from "@mantine/core";
import { Action, Role } from "../../types";
import { ISearchInputProps } from "../SearchInput/types";
import { IPageProps } from "../cutomPagination/types";

export interface BaseColumn<T> {
  key: keyof T;
  label: string;
  icon?: React.ReactNode;
  role?: Role;
  visible?: boolean;
  editable?: boolean;
  onChange?: (id: string, value: string) => void;
  render?: (value: T[keyof T], record: T) => React.ReactNode;
}

export interface StandardColumn<T> extends BaseColumn<T> {
  type?: 'default' | 'user' | 'select' | 'textarea' | 'link' | 'date';
  options?:'boolean' | ComboboxItem[];
  sort?: boolean;
}

export interface MultilineColumn<T> extends Omit<BaseColumn<T>, "type"> {
  type: 'multiline';
  data: Array<{
    key: string;
    type?: 'default' | 'user' | 'select' | 'textarea' | 'link' | 'date';
    icon?: React.ReactNode;
  }>;
}

export interface ActionColumn<T> extends Omit<BaseColumn<T>, "key" | "type" | "label" | "onChange"> {
  key: 'action';
  label: 'Actions';
  type: 'action';
  actions: ((item: T) => Array<{
    key: Action;
    onAction: (item: T) => void;
  }>) | Array<{
    key: Action;
    onAction: (item: T) => void;
  }>;
}

export type Column<T> = StandardColumn<T> | MultilineColumn<T> | ActionColumn<T>;

export interface IFilterOption {
  value: string;
  label: string;
}

export interface IFilter {
  key: string;
  label: string;
  options: IFilterOption[]
}

export interface IFilterProps {
  filters: IFilter[];
  values: Record<string, string>;
  onChange: (key: string, values: string) => void;
}

export interface ICustomTableProps<T> {
  data: T[];
  dataLoading: boolean;
  columns: Column<T>[];
  onSave?: (editedItem: Partial<T>) => void;
  pageProps?: IPageProps;
  filterProps?: IFilterProps;
  searchInputProps?: ISearchInputProps;
}
