import React from "react";
import { View, StyleSheet } from "react-native";
import { ColorDropListItem, DropListItemType } from "./dropListItemColor";
import Animated, { useSharedValue } from "react-native-reanimated";

type DropdownProps = {
  header: DropListItemType;
  options: DropListItemType[];
  isExpanded: Animated.SharedValue<boolean>;
};

const ColorDropdown: React.FC<DropdownProps> = ({
  header,
  options,
  isExpanded,
}) => {
  const dropdownItems = [header, ...options];

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      {dropdownItems.map((item, index) => {
        return (
          <ColorDropListItem
            key={index}
            index={index}
            {...item}
            isExpanded={isExpanded}
            dropdownItemsCount={dropdownItems.length}
          />
        );
      })}
    </View>
  );
};

export default ColorDropdown;
