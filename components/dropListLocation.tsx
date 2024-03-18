import React, { Dispatch, SetStateAction } from "react";
import { View } from "react-native";
import {
  DropListItemLocation,
  DropListItemLocationType,
} from "./dropListItemLocation";
import Animated from "react-native-reanimated";

type DropdownLocationProps = {
  header: DropListItemLocationType;
  options: DropListItemLocationType[];
  isExpanded: Animated.SharedValue<boolean>;
  selectedLocation: string;
  setSelectedLocation: Dispatch<SetStateAction<string>>;
};

const DropdownLocation: React.FC<DropdownLocationProps> = ({
  header,
  options,
  isExpanded,
  selectedLocation,
  setSelectedLocation,
}) => {
  const dropdownLocationItems = [header, ...options];

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      {dropdownLocationItems.map((item, index) => {
        return (
          <DropListItemLocation
            key={index}
            index={index}
            {...item}
            isExpanded={isExpanded}
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
            dropdownItemsCount={dropdownLocationItems.length}
          />
        );
      })}
    </View>
  );
};

export default DropdownLocation;
