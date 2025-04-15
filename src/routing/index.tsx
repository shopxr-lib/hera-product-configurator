import { IconListCheck, IconUsers } from "@tabler/icons-react";
import { RouteConfig } from "./types";
import { LeadTracker, UserManagement } from "../views";
import { Role } from "../types";

export const ROUTES: RouteConfig[] = [
  { 
    icon: <IconListCheck />, 
    label: "Lead Tracker", 
    path: "tracking",
    roles: [Role.Admin, Role.SalesPerson],
    element: <LeadTracker />
  },
  { 
    icon: <IconUsers />, 
    label: "Manage Users", 
    path: "manage-users" ,
    roles: [Role.Admin],
    element: <UserManagement />
  },
];
