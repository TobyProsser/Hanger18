import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  Button,
} from "react-native";
import Color from "color";
import ColorSelect from "./colorSelect";
import Dropdown from "./dropList";
import ColorDropdown from "./dropListColor";
import { GestureDetector } from "react-native-gesture-handler";

import auth from "@react-native-firebase/auth";
import db from "@react-native-firebase/database";

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

interface ITallClimbHolderProps {
  imageUri: string;
  grade: number;
  color: string;
  cardWidth: number;
}

const TallClimbHolder = (prop: ITallClimbHolderProps) => {
  const [time, setTime] = useState(0);
  const [grade1, setGrade1] = useState(-1);
  const [color1, setColor1] = useState("");

  const isGradeExpanded = useSharedValue(false);
  const isColorExpanded = useSharedValue(false);

  const [header, setHeader] = useState({ label: "V#" });

  const climbSubmitted = useSharedValue(false);
  const grade = useSharedValue(-1);
  const color = useSharedValue("red");

  const submitClimb = async (
    grade: number,
    color: string,
    imageUri: string
  ) => {
    climbSubmitted.value = true;
    const currentUser = auth().currentUser;
    if (currentUser) {
      await saveClimb(grade, color, imageUri, currentUser.uid);
    }
  };

  useEffect(() => {
    if (grade1 === -1) {
      setHeader({ label: "V#" });
    } else {
      setHeader({ label: "V" + grade1 });
    }
    console.log(grade1);
  }, [grade1]);

  useEffect(() => {}, [color1]);

  const saveClimb = async (
    grade: number,
    color: string,
    imageUri: string,
    currentUser: string
  ) => {
    const sessionId = Date.now();

    await db().ref("/users/${currentUser}/sessions/${seesionId}").set({
      grade,
      color,
      imageUri,
      date: sessionId,
    });
  };

  const rStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isGradeExpanded.value ? 1 : 0),
    };
  }, []);
  return (
    <View style={[styles.climbHolder, { width: prop.cardWidth }]}>
      <View>
        {!prop.imageUri ? (
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
                uri: prop.imageUri,
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
                  top: 20,
                  flex: 1,
                  height: "100%",
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
                  <View style={[styles.dropListContainer]}>
                    <Dropdown
                      header={header}
                      options={options}
                      isExpanded={isGradeExpanded}
                      grade={setGrade1}
                      secondRow={false}
                    />
                  </View>
                  <Animated.View
                    onTouchEnd={() => {
                      console.log("hello");
                    }}
                    style={[
                      styles.dropListContainer,
                      { top: 32 },
                      rStyle,
                      {
                        height: "100%",
                        width: "100%",
                      },
                    ]}
                  >
                    <Dropdown
                      header={header1}
                      options={options1}
                      isExpanded={isGradeExpanded}
                      grade={setGrade1}
                      secondRow={true}
                    />
                  </Animated.View>
                </View>

                <View
                  style={{
                    width: 100,
                    alignItems: "flex-start",
                    alignSelf: "flex-end",
                    height: "100%",
                    right: 20,
                  }}
                >
                  <ColorDropdown
                    header={header1}
                    options={options1}
                    isExpanded={isColorExpanded}
                    color={setColor1}
                    getColor={color1}
                  />
                </View>
              </View>
              {!color && !grade ? (
                <View
                  onTouchEnd={() => {
                    submitClimb(prop.grade, prop.color, prop.imageUri);
                  }}
                  style={{
                    width: "100%",
                    backgroundColor: "white",
                    opacity: 0.7,
                    height: 75,
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 30,
                      color: "#6aafdf",
                      alignSelf: "center",
                      fontWeight: "600",
                    }}
                  >
                    Submit Climb
                  </Text>
                </View>
              ) : (
                <View></View>
              )}
            </ImageBackground>
          </View>
        )}
      </View>
    </View>
  );
};

export default TallClimbHolder;

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
