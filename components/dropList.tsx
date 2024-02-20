import React from "react";
import { View, StyleSheet } from "react-native";
import { DropListItem, DropListItemType } from "./dropListItem";
import { useSharedValue } from "react-native-reanimated";

type DropdownProps = {
  header: DropListItemType;
  options: DropListItemType[];
};

const Dropdown: React.FC<DropdownProps> = ({ header, options }) => {
  const dropdownItems = [header, ...options];
  const isExpanded = useSharedValue(false);

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
