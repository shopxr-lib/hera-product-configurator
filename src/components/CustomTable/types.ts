export interface BaseColumn<T> {
  key: keyof T;
  label: string;
  icon?: React.ReactNode;
  onChange?: (id: string, value: string) => void;
}

export interface StandardColumn<T> extends BaseColumn<T> {
  type?: 'default' | 'user' | 'select' | 'textarea' | 'link' | 'date';
  options?: string[];
  sort?: boolean;
  render?: (value: React.ReactNode) => string;
}

export interface MultilineColumn<T> extends BaseColumn<T> {
  type: 'multiline';
  data: Array<{
    key: string;
    type?: 'default' | 'user' | 'select' | 'textarea' | 'link' | 'date';
    icon?: React.ReactNode;
  }>;
}

export type Column<T> = StandardColumn<T> | MultilineColumn<T>;

export interface ICustomTableProps<T> {
  data: T[];
  columns: Column<T>[];
}
