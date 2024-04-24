import React, { Dispatch, SetStateAction } from "react";
import { View } from "react-native";
import { ColorDropListItem, DropListItemColorType } from "./dropListItemColor";
import Animated from "react-native-reanimated";

type DropListItemColorProps = {
  header: DropListItemColorType;
  options: DropListItemColorType[];
  isExpanded: boolean;
  setIsExpanded: Dispatch<SetStateAction<boolean>>;
  color: Dispatch<SetStateAction<string>>;
  getColor: string;
  secondRow: boolean;
  submitted: boolean;
};

const ColorDropdown: React.FC<DropListItemColorProps> = ({
  header,
  options,
  isExpanded,
  setIsExpanded,
  color,
  getColor,
  secondRow,
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
            setIsExpanded={setIsExpanded}
            color={color}
            dropdownItemsCount={dropdownItems.length}
            getColor={getColor}
            secondRow={secondRow}
            submitted={submitted}
          />
        );
      })}
    </View>
  );
};

export default ColorDropdown;
