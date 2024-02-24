import React, { Dispatch, SetStateAction, useState } from "react";
import { View, StyleSheet } from "react-native";
import { DropListItem, DropListItemType } from "./dropListItem";
import Animated, { SharedValue, useSharedValue } from "react-native-reanimated";

type DropdownProps = {
  header: DropListItemType;
  options: DropListItemType[];
  isExpanded: Animated.SharedValue<boolean>;
  setGrade: Dispatch<SetStateAction<number>>;
  grade: number,
  secondRow: boolean;
};

const Dropdown: React.FC<DropdownProps> = ({
  header,
  options,
  isExpanded,
  grade,
  secondRow,
  setGrade,
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
          <DropListItem
            key={index}
            index={index}
            {...item}
            isExpanded={isExpanded}
            grade={grade}
            setGrade={setGrade}
            secondRow={secondRow}
            dropdownItemsCount={dropdownItems.length}
          />
        );
      })}
    </View>
  );
};

export default Dropdown;
