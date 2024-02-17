import React from "react";
import { View } from "react-native";

export default ColorSelect = () => {
  return (
    <View
      style={{
        width: 75,
        height: 75,
        borderRadius: 25,
        backgroundColor: "#2a3641",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          width: 55,
          height: 55,
          borderRadius: 25,
          backgroundColor: "#282424",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: "#F81C1C",
          }}
        ></View>
      </View>
    </View>
  );
};
