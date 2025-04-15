export interface IPageProps {
  total: number;             
  value: number;      
  itemsPerPage: number;       
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
}