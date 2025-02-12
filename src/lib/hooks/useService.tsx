import React from "react";
import { serviceMap } from "../services";

export const ServiceContext = React.createContext<typeof serviceMap | null>(
  null,
);

export function useService() {
  const service = React.useContext(ServiceContext);

  if (!service) {
    throw new Error("useService must be used within a ServiceProvider");
  }

  return service;
}
