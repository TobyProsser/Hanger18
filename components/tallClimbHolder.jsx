import React, { useState } from "react";
import { StyleSheet, Text, View, Image, ImageBackground } from "react-native";
import Color from "color";
import ColorSelect from "./colorSelect";
import Dropdown from "./dropList";
import ColorDropdown from "./dropListColor";

import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  useAnimatedReaction,
} from "react-native-reanimated";

const CARD_HOLDER_HEIGHT = 350;
const CARD_HOLDER_WIDTH = 300;
//https://runwildmychild.com/wp-content/uploads/2022/09/Indoor-Rock-Climbing-for-Kids-Climbing-Wall.jpg

const options = [
  { label: "V0" },
  { label: "V1" },
  { label: "V2" },
  { label: "V3" },
  { label: "V4" },
  { label: "V5" },
  { label: "V6" },
];

const options1 = [
  { label: "V8" },
  { label: "V9" },
  { label: "V10" },
  { label: "V11" },
  { label: "V12" },
];

const header = { label: "V#" };
const header1 = { label: "V7" };

export default TallClimbHolder = ({ imageUri, grade, color, cardWidth }) => {
  const isGradeExpanded = useSharedValue(false);
  const isColorExpanded = useSharedValue(false);
  const rStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isGradeExpanded.value ? 1 : 0),
    };
  }, []);
  return (
    <View style={[styles.climbHolder, { width: cardWidth }]}>
      <View>
        {!imageUri ? (
          <View
            style={{
              backgroundColor: "white",
              alignItems: "center",
              justifyContent: "flex-start",
              width: 100,
              height: 100,
              borderRadius: 25,
            }}
          >
            <Text style={{ fontSize: 50, top: 15 }}>+</Text>
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <ImageBackground
              source={{
                uri: imageUri,
              }}
              style={{
                width: CARD_HOLDER_WIDTH,
                height: CARD_HOLDER_HEIGHT,
                borderRadius: 25,
                overflow: "hidden",
                bottom: 17,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  height: 100,
                  opacity: 0.95,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    gap: 80,
                    left: 20,
                  }}
                >
                  <View style={[styles.dropListContainer, { bottom: 100 }]}>
                    <Dropdown
                      header={header}
                      options={options}
                      isExpanded={isGradeExpanded}
                    />
                  </View>
                  <Animated.View
                    style={[styles.dropListContainer, { bottom: 70 }, rStyle]}
                  >
                    <Dropdown
                      header={header1}
                      options={options1}
                      isExpanded={isGradeExpanded}
                    />
                  </Animated.View>
                </View>

                <View
                  style={{
                    backgroundColor: "blue",
                    width: 100,
                    alignItems: "flex-end",
                    bottom: 140,
                  }}
                >
                  <ColorDropdown
                    header={header1}
                    options={options1}
                    isExpanded={isColorExpanded}
                  />
                </View>
              </View>
            </ImageBackground>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  dropListContainer: {},
  climbHolder: {
    top: 100,
    alignItems: "center",
    elevation: 5, // For shadow on Android
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    borderRadius: 35,
  },
});
