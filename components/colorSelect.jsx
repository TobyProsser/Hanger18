import React from "react";
import { View } from "react-native";

export default ColorSelect = () => {
  return (
    <View
      style={{
        width: 100,
        height: 50,
        borderRadius: 25,
        backgroundColor: "#2a3641",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          width: 80,
          height: 30,
          borderRadius: 25,
          backgroundColor: "#282424",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            width: 75,
            height: 25,
            borderRadius: 25,
            backgroundColor: "#F81C1C",
          }}
        ></View>
      </View>
    </View>
  );
};
