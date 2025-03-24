import { IconHome, IconListCheck, IconUsers } from "@tabler/icons-react";
import { ISiderRoute } from "./types";

export const ROUTES: ISiderRoute[] = [
  { icon: <IconHome />, label: "Home", path: "/user/home" },
  { icon: <IconListCheck />, label: "Lead Tracker", path: "/user/tracking" },
  { icon: <IconUsers />, label: "Manage Users", path: "/user/manage-users" },
];
