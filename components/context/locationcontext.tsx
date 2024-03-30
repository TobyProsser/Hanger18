// LocationContext.tsx
import { createContext, useContext } from "react";

export type LocationContent = {
  setSessionScrollTo: (c: number) => void;
  sessionScrollTo: number;
  setLBScrollTo: (c: number) => void;
  lbScrollTo: number;
  selectedLocation: string;
  setSelectedLocation: (c: string) => void;
};

export const LocationContext = createContext<LocationContent>({
  selectedLocation: "Location",
  setSelectedLocation: () => {},
  setSessionScrollTo: () => {},
  setLBScrollTo: () => {},
  sessionScrollTo: 0,
  lbScrollTo: 0,
});

export const useLocationContext = () => useContext(LocationContext);
