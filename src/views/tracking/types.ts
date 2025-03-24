export interface ITracking {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  link: string;
  lastSavedDate: string;
  customerBuyingPhase: string;
  keyCollectionDate: string | null;
  interestedProducts: string | undefined;
  followedUpDate1: string | undefined;
  followedUpDate2: string | null;
  followedUpDate3: string | null;
  visitedShowroom: string;
  purchased: string;
  salesPerson: string | undefined;
  notes: string | undefined;
}

export interface ThProps {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  onSort: () => void;
}