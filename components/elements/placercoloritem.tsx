import { FirebaseDatabaseTypes } from "@react-native-firebase/database";
import React, { useEffect, useState } from "react";
import { Dimensions } from "react-native";
import { StyleSheet, Text, View, Image, Animated } from "react-native";

import db from "@react-native-firebase/database";
import auth from "@react-native-firebase/auth";
const { width, height } = Dimensions.get("screen");

const PlacerColorItem = ({ index }: { index: number }) => {
  // Create an animated value based on the index
  const animatedValue = new Animated.Value(index);

  // Create the color interpolation
  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 5, 6, 100, 101],
    outputRange: ["gold", "silver", "pink", "yellow", "purple"],
    extrapolate: "clamp",
  });
  return (
    <Animated.View
      style={{
        backgroundColor,
        width: 100,
        height: 60,
        alignSelf: "flex-end",
        alignContent: "flex-start",
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",

        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.15,
        shadowRadius: 2,
      }}
    >
      {
        <Text
          style={{
            color: "white",
            fontSize: index < 999 ? 35 : 20,
            fontWeight: "700",
          }}
        >
          {index + 1}
        </Text>
      }
    </Animated.View>
  );
};

export default PlacerColorItem;
