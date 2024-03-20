// LocationContext.tsx
import { createContext, useContext } from "react";

export type LocationContent = {
  selectedLocation: string;
  setSelectedLocation: (c: string) => void;
};

export const LocationContext = createContext<LocationContent>({
  selectedLocation: "Location",
  setSelectedLocation: () => {},
});

export const useLocationContext = () => useContext(LocationContext);
