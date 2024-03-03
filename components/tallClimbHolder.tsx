import React, { useState, useEffect, Dispatch } from "react";
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
import * as ImagePicker from "expo-image-picker";
import { LeaderboardEntry } from "./types/leaderboardentry";

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
  setImageUri: Dispatch<any>;
  grade: number;
  color: string;
  cardWidth: number;
  sessionId: number;
  setCurSessionId: Dispatch<any>;
}

const TallClimbHolder = (prop: ITallClimbHolderProps) => {
  const [grade1, setGrade1] = useState(-1);
  const [color1, setColor1] = useState(prop.color ? prop.color : "null");
  const isGradeExpanded = useSharedValue(false);
  const isColorExpanded = useSharedValue(false);

  const [header, setHeader] = useState({ label: "V#" });

  const [climbSubmitted, setClimbSubmitted] = useState(false);

  const sortAndSave = async (
    allValues: LeaderboardEntry[],
    userName: string,
    currentUser: string
  ) => {
    allValues.sort((a, b) => b.overallScore - a.overallScore);

    //Change value to load more leaderboard values, implement lazy loading here
    if (allValues.length > 20) {
      allValues.pop();
    }

    const newLeaderboard = allValues.reduce((acc, cur, index) => {
      acc.set(index, cur);
      return acc;
    }, new Map<Number, LeaderboardEntry>());
    console.log("new Leaderboard: " + newLeaderboard);

    await db()
      .ref("/")
      .update({ leaderboard: Object.fromEntries(newLeaderboard) });

    const { leaderboardIndex } = await findLeaderboardIndex(userName);

    console.log("lbIndex is:" + leaderboardIndex);
    await db()
      .ref(`/users/${currentUser}/lbIndex`)
      .update({ lbIndex: leaderboardIndex });
  };

  const findLeaderboardIndex = async (userName: string) => {
    const leaderboard = await db().ref(`/leaderboard`).once("value");
    let leaderboardCopy = { ...leaderboard.val() };
    let allValues: LeaderboardEntry[] = Object.values(leaderboardCopy);

    //Find users place in leaderboard
    const leaderboardIndex = allValues.findIndex(
      (value) => value.name === userName
    );

    return { leaderboardIndex, allValues };
  };

  const updateLeaderboard = async (
    newgrade: number,
    allGrades: string,
    currentUser: string
  ) => {
    const user = await db().ref(`/users/${currentUser}`).once("value");
    const userName = user.val().name as string;
    //Get profileImage
    const data = await db()
      .ref(`/users/${currentUser}/profileImage`)
      .once("value");
    const profileImage = data.val().profileImageUri;
    //Calculate total grade
    const totalGradePath = `/users/${currentUser}/leaderboard/`;
    const gradesSnapshot = await db().ref(totalGradePath).once("value");
    const totalGrades = (gradesSnapshot.val().totalScore as number) + newgrade;
    //get ClimbsAmount from database
    const climbsAmountPath = `/users/${currentUser}/climbsAmount`;
    let climbsAmount = 0;

    try {
      const snapshot = await db().ref(climbsAmountPath).once("value");
      const data = snapshot.val();
      if (data) {
        climbsAmount = data.climbsAmount;
      } else {
        console.log("The climbsAmount path does not exist.");
      }
    } catch (error) {
      console.error("Error reading data: " + error);
    }

    console.log("climbs amount: " + climbsAmount);

    // Update climbsAmount
    await db()
      .ref(climbsAmountPath)
      .update({ climbsAmount: climbsAmount + 1 });

    //Save new totalgrade to local user
    await db().ref(totalGradePath).update({ totalScore: totalGrades });

    const { leaderboardIndex, allValues } = await findLeaderboardIndex(
      userName
    );

    console.log("just before updating leaderboard allgrades: " + allGrades);
    if (leaderboardIndex > -1) {
      allValues[leaderboardIndex] = {
        currentUser: currentUser,
        overallScore: totalGrades,
        name: userName,
        profilePic: profileImage,
        date: Date.now(),
        key: Date.now() + currentUser,
        allGrades: allGrades,
      };

      sortAndSave(allValues, userName, currentUser);
    } else {
      allValues.push({
        currentUser: currentUser,
        overallScore: totalGrades,
        name: userName,
        profilePic: profileImage,
        date: Date.now(),
        key: Date.now() + currentUser,
        allGrades: allGrades,
      });

      sortAndSave(allValues, userName, currentUser);
    }
  };

  const submitClimb = async (
    grade: number,
    color: string,
    imageUri: string
  ) => {
    const currentUser = auth().currentUser;
    if (currentUser) {
      await saveClimb(grade, color, imageUri, currentUser.uid);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      prop.setImageUri(result.assets[0].uri);

      submitClimb(-1, "null", result.assets[0].uri);
    }
  };

  useEffect(() => {
    if (grade1 === -1) {
      setHeader({ label: "V#" });
    } else {
      setHeader({ label: "V" + grade1 });
      prop.grade = grade1;
    }
  }, [grade1]);

  useEffect(() => {
    if (prop.grade != -1) {
      setHeader({ label: "V" + prop.grade });

      if (prop.color != "null") {
        setClimbSubmitted(true);
      }
    }
  }, []);

  const saveClimb = async (
    grade: number,
    color: string,
    imageUri: string,
    currentUser: string
  ) => {
    const date = Date.now();
    prop.setCurSessionId(date + currentUser);
    await db()
      .ref(`/users/${currentUser}/sessions/${date + currentUser}`)
      .set({
        grade,
        color,
        imageUri,
        key: date + currentUser,
        date: date,
      });
  };

  const updateClimb = async (
    newGrade: number,
    newColor: string,
    newImageUri: string,
    currentUser: string
  ) => {
    setClimbSubmitted(true);

    await db().ref(`/users/${currentUser}/sessions/${prop.sessionId}`).update({
      grade: newGrade,
      color: newColor,
      imageUri: newImageUri,
    });
    //get allGrades from database
    const allGradesPath = `/users/${currentUser}/allGrades`;
    const allGradesSnapshot = await db().ref(allGradesPath).once("value");
    let allGrades = allGradesSnapshot.val().allGrades as string;
    //Update allGrades
    await db()
      .ref(allGradesPath)
      .once("value")
      .then((snapshot) => {
        let numbers = snapshot.val();

        // Add the new number to the end of the string
        const newValue = allGrades + "V" + newGrade + " ";
        allGrades = newValue;
        console.log("newValue: " + newValue);
        // Update the list in Firebase
        return db().ref(allGradesPath).update({ allGrades: newValue });
      })
      .then(async () => {
        await updateLeaderboard(newGrade, allGrades, currentUser);
      })
      .catch((error) => console.error("Number could not be added: " + error));
  };

  const rStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isGradeExpanded.value ? 1 : 0),
    };
  }, []);
  return (
    <View style={[styles.climbHolder, { width: prop.cardWidth }]}>
      <View>
        {!prop.imageUri || prop.imageUri == "null" ? (
          <View
            onTouchEnd={() => {
              pickImage();
            }}
            style={{
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
                      grade={grade1}
                      setGrade={setGrade1}
                      secondRow={false}
                      submitted={climbSubmitted}
                    />
                  </View>
                  <Animated.View
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
                      grade={grade1}
                      setGrade={setGrade1}
                      secondRow={true}
                      submitted={climbSubmitted}
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
                    submitted={climbSubmitted}
                  />
                </View>
              </View>
              {color1 != "null" && grade1 != -1 && !climbSubmitted ? (
                <View
                  onTouchEnd={() => {
                    const currentUser = auth().currentUser;
                    if (currentUser) {
                      updateClimb(
                        grade1,
                        color1,
                        prop.imageUri,
                        currentUser.uid
                      );
                    }
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
