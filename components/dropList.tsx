import React from "react";
import { View, StyleSheet } from "react-native";
import { DropListItem, DropListItemType } from "./dropListItem";
import Animated, { useSharedValue } from "react-native-reanimated";

type DropdownProps = {
  header: DropListItemType;
  options: DropListItemType[];
  isExpanded: Animated.SharedValue<boolean>;
};

const Dropdown: React.FC<DropdownProps> = ({ header, options, isExpanded }) => {
  const dropdownItems = [header, ...options];

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      {dropdownItems.map((item, index) => {
        return (
          <DropListItem
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

export default Dropdown;
