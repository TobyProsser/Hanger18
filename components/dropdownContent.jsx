import React from "react";
import { View, Dimensions } from "react-native";
import ClimbHolder from "./climbHolder";

const { height: SCREENHEIGHT } = Dimensions.get("screen");

const CLIMB_HOLDER_HIEGHT = 200;
export default DropdownContenet = () => {
  return (
    <View
      style={{
        flex: 1,
        bottom: CLIMB_HOLDER_HIEGHT * 1.5,
        flexDirection: "column",
        backgroundColor: "white",
      }}
    >
      <ClimbHolder />
    </View>
  );
};
