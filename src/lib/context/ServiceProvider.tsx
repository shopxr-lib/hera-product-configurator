import { ServiceContext } from "../hooks/useService";
import { serviceMap } from "../services";

export const ServiceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <ServiceContext.Provider value={serviceMap}>
      {children}
    </ServiceContext.Provider>
  );
};
