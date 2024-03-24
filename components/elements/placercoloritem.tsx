import React from "react";
import { StyleSheet, Text, Animated } from "react-native";

const PlacerColorItem = ({ index }: { index: number }) => {
  // Create an animated value based on the index
  const animatedValue = new Animated.Value(index);

  // Create the color interpolation
  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1, 2, 3, 6, 100, 101],
    outputRange: [
      "gold",
      "silver",
      "orange",
      "pink",
      "blue",
      "yellow",
      "purple",
    ],
    extrapolate: "clamp",
  });
  return (
    <Animated.View
      style={[
        styles.textHolder,
        {
          backgroundColor,
        },
      ]}
    >
      {
        <Text
          style={[
            styles.text,
            {
              fontSize: index < 999 ? 35 : 20,
            },
          ]}
        >
          {index + 1}
        </Text>
      }
    </Animated.View>
  );
};

export default PlacerColorItem;

const styles = StyleSheet.create({
  text: { color: "white", fontWeight: "700" },
  textHolder: {
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
  },
});
