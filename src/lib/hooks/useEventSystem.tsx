import React from "react";
import { EventSystem } from "../../store/useStore";

export const EventSystemContext = React.createContext<EventSystem | null>(null);

export function useEventSystem() {
  const eventSystem = React.useContext(EventSystemContext);

  if (!eventSystem) {
    throw new Error("useEventSystem must be used within a EventSystemProvider");
  }

  return eventSystem;
}
