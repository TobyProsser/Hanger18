import React from "react";
import { View } from "react-native";
import ClimbHolder from "./climbHolder";

export default DropdownContenet = () => {
  return (
    <View
      style={{
        flex: 1,
        height: "100%",
        flexDirection: "column",
        backgroundColor: "red",
      }}
    >
      <ClimbHolder />
    </View>
  );
};
