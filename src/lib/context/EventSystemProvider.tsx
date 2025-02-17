import { eventSystem } from "../../store/useStore";
import { EventSystemContext } from "../hooks/useEventSystem";

export const EventSystemProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <EventSystemContext.Provider value={eventSystem}>
      {children}
    </EventSystemContext.Provider>
  );
};
