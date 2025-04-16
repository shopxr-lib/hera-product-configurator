import { IconPhone, IconMail, IconCalendar } from "@tabler/icons-react";
import { IUser } from "../../lib/services/auth/types";
import { BuyingPhase, Role, Action } from "../../types";
import { IContact } from "../../views/tracking/types";
import { Column, ActionColumn } from "../CustomTable/types";
import { ILeadTrackerColumnsProps, IUserManagementColumnProps } from "./types";
import { BUYING_PHASE } from "../../types/constants";

export const getLeadTrackerColumns = ({ allUsers, role }: ILeadTrackerColumnsProps): Column<IContact>[] => [
  { 
    key: 'name', 
    label: 'Name',
    type: 'user',
    sort: true
  },
  { 
    key: 'phone', 
    label: 'Phone Number', 
    icon: <IconPhone/>,
  },
  { 
    key: 'email', 
    label: 'Email', 
    icon: <IconMail/>,
    sort: true
  },
  { 
    key: 'configuration_sessions', 
    label: 'Link to Saved Design', 
    type: 'multiline',
    data: [
      {
        key: 'session_link',
        type: 'link',
      },
      {
        key: 'created_at',
        type: 'date',
        icon: <IconCalendar/>
      }
    ]
  },
  { 
    key: 'customer_buying_phase', 
    label: 'Customer Buying Phase', 
    type: 'select', 
    render: (value: unknown) => BUYING_PHASE[value as number],
    options: Object.values(BuyingPhase).map(value => ({
      label: value,
      value: value,
    }))
  },
  { 
    key: 'key_collection_date', 
    label: 'Key Collection Date',
    type: 'date'  
  },
  { 
    key: 'interested_products', 
    label: 'List of Interested Products',
    type: 'textarea',
    render: (value: unknown) => value ? String(value) : undefined
  },
  { 
    key: 'followed_up_date_1', 
    label: 'Followed Up Date 1',
    sort: true,
    type: 'date'
  },
  { 
    key: 'followed_up_date_2', 
    label: 'Followed Up Date 2',
    sort: true,
    type: 'date'
  },
  { 
    key: 'followed_up_date_3', 
    label: 'Followed Up Date 3',
    sort: true,
    type: 'date'
  },
  {
    key: "visited_showroom",
    label: "Visited Showroom?",
    type: "select",
    options: 'boolean',
  },
  {
    key: "next_showroom_appointment_date",
    label: "Next Showroom Appointment Date",
    sort: true,
    type: 'date'
  },
  {
    key: "purchased",
    label: "Purchased?",
    type: "select",
    options: 'boolean',
  },
  {
    key: "sales_person",
    label: "Assigned Sales Person",
    sort: true,
    type: "select",
    options: allUsers
      .filter((user: IUser) => user.role !== Role.Admin && user.deleted_at === 0 && user.approved)
      .map((user: IUser) => ({
        label: user.name,
        value: user.email,
      })),
    role: Role.Admin,
    visible: role === Role.Admin,
    render: (value: unknown) => value ? String((value as unknown as IUser).email) : "N/A",
  },
  {
    key: 'notes',
    label: 'Notes',
    type: 'textarea',
    render: (value: unknown) => value ? String(value) : undefined
  },
  {
    key: 'action',
    type: 'action',
    label: 'Actions',
    actions: [{
      key: Action.Edit,
    }]
  } as ActionColumn<IContact>
];

export const getUserManagementColumns = ({ useApproveMutation, useDeleteMutation, page, limit, search, filters }: IUserManagementColumnProps): Column<IUser>[] => [
  { 
    key: 'name', 
    label: 'Name',
    type: 'user',
    sort: true
  },
  { 
    key: 'email', 
    label: 'Email', 
    icon: <IconMail/>,
    sort: true
  },
  { 
    key: 'approved', 
    label: 'Approved', 
    render: (value: unknown) => (value ? "Yes" : "No"),
    options: 'boolean'
  },
  {
    key: 'deleted_at', 
    label: 'Deleted', 
    render: (value: unknown) => (value === 0 ? "No" : "Yes"),
    options: 'boolean'
  },
  {
    key: 'action',
    label: 'Actions',
    type: 'action',
    actions: (item) => {
      return [
        {
          key: item.approved === 'false' ? Action.Approve : Action.ResetApproval,
          onAction: async(item: IUser) => {
            await useApproveMutation.mutate({ id: item.id, approve: item.approved as string, page, limit, search, filters })
          }
        },
        {
          key: item.deleted_at === 'false' ? Action.Delete : Action.Restore,
          onAction: async(item: IUser) => await useDeleteMutation.mutate({ id: item.id, delete: item.deleted_at as string, page, limit, search, filters })
        }
      ];
    },
  } as ActionColumn<IUser>
];

