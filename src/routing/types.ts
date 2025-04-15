import React from "react"
import { Role } from "../types";

export type RouteConfig = {
  icon: React.ReactNode;
  label: string;
  path: string;
  roles: Role[];
  element: React.ReactNode;
}