import React, { Dispatch, SetStateAction } from "react";
import { View } from "react-native";
import { DropListItem, DropListItemType } from "./dropListItem";
import Animated from "react-native-reanimated";

type DropdownProps = {
  header: DropListItemType;
  options: DropListItemType[];
  isExpanded: Animated.SharedValue<boolean>;
  setGrade: Dispatch<SetStateAction<number>>;
  grade: number;
  secondRow: boolean;
  submitted: boolean;
};

const Dropdown: React.FC<DropdownProps> = ({
  header,
  options,
  isExpanded,
  grade,
  secondRow,
  setGrade,
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
          <DropListItem
            key={index}
            index={index}
            {...item}
            isExpanded={isExpanded}
            grade={grade}
            setGrade={setGrade}
            secondRow={secondRow}
            dropdownItemsCount={dropdownItems.length}
            submitted={submitted}
          />
        );
      })}
    </View>
  );
};

export default Dropdown;
