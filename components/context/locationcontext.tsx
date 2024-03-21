// LocationContext.tsx
import { createContext, useContext } from "react";

export type LocationContent = {
  setSessionScrollTo: (c: number) => void;
  sessionScrollTo: number;
  selectedLocation: string;
  setSelectedLocation: (c: string) => void;
};

export const LocationContext = createContext<LocationContent>({
  selectedLocation: "Location",
  setSelectedLocation: () => {},
  setSessionScrollTo: () => {},
  sessionScrollTo: 0,
});

export const useLocationContext = () => useContext(LocationContext);
