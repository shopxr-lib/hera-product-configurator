import { IUser } from "../../lib/services/auth/types";

export interface ILink {
  id: number;
  link: string;
  last_saved_date: string;
}

export interface IClient {
  id: number;
  name: string;
  contact_email: string;
  phone_number: string;
  links: ILink[];
  customer_buying_phase: number | null;
  key_collection_date: string | null;
  interested_products: string | null;
  followed_up_date_1: string | null;
  followed_up_date_2: string | null;
  followed_up_date_3: string | null;
  visited_showroom: string;
  next_showroom_appointment_date: string | null;
  purchased: string;
  sales_person: Partial<IUser> | null;
  notes: string | null;
}

export interface ThProps {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  onSort: () => void;
}