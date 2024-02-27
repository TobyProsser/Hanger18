import React, { Dispatch, SetStateAction } from "react";
import { View, StyleSheet } from "react-native";
import { ColorDropListItem, DropListItemColorType } from "./dropListItemColor";
import Animated, { SharedValue, useSharedValue } from "react-native-reanimated";

type DropListItemColorProps = {
  header: DropListItemColorType;
  options: DropListItemColorType[];
  isExpanded: Animated.SharedValue<boolean>;
  color: Dispatch<SetStateAction<string>>;
  getColor: string;
  submitted: boolean;
};

const ColorDropdown: React.FC<DropListItemColorProps> = ({
  header,
  options,
  isExpanded,
  color,
  getColor,
  submitted,
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
            color={color}
            dropdownItemsCount={dropdownItems.length}
            getColor={getColor}
            submitted={submitted}
          />
        );
      })}
    </View>
  );
};

export default ColorDropdown;
