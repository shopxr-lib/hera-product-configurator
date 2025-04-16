import { BuyingPhase } from "../../types";
import { IFilter } from "../CustomTable/types";

 export const getLeadTrackerFilters: IFilter[]= [
    {
      key: 'buying_phase',
      label: 'Buysing Phase',
      options: Object.values(BuyingPhase).map((value, index) => ({
        label: value,
        value: index.toString(),
      }))
    },
    {
      key: 'visited_showroom',
      label: 'Showroom',
      options: [
        { value: 'true', label: 'Visited' },
        { value: 'false', label: 'Not Visited' },
      ]
    },
    {
      key: 'purchased',
      label: 'Purchase',
      options: [
        { value: 'true', label: 'Done' },
        { value: 'false', label: 'Not Done' },
      ]
    }
  ];
  
  export const getUserManagementFilters: IFilter[] = [
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