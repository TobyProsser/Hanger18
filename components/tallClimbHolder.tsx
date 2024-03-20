import React, { useState, useEffect, Dispatch, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  Button,
  PermissionsAndroid,
  Permission,
  Platform,
} from "react-native";
import Color from "color";
import ColorSelect from "./colorSelect";
import Dropdown from "./dropList";
import ColorDropdown from "./dropListColor";
import { GestureDetector } from "react-native-gesture-handler";

import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";

import businessLocations from "./data/climbgymlocations";
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
import { useLocationContext } from "./context/locationcontext";
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
  isUsersClimbs: boolean;
}

const TallClimbHolder = (prop: ITallClimbHolderProps) => {
  const [grade1, setGrade1] = useState(-1);
  const [color1, setColor1] = useState(prop.color ? prop.color : "null");
  const isGradeExpanded = useSharedValue(false);
  const isColorExpanded = useSharedValue(false);
  const [cameraPermission, setCameraPermission] = useState(null);
  const [galleryPermission, setGalleryPermission] = useState(null);
  const [locationPermission, setLocationPermission] = useState(null);
  //const [climbingGym, setClimbingGym] = useState("");
  const climbingGym = useSharedValue("");
  const [header, setHeader] = useState({ label: "V#" });

  const [climbSubmitted, setClimbSubmitted] = useState(false);

  const { selectedLocation, setSelectedLocation } = useLocationContext();

  useEffect(() => {
    console.log("Use effect climbing gym: " + climbingGym.value);
  }, [climbingGym]);

  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  const calculateDistance = async (lat1, lon1, lat2, lon2) => {
    // Implementation of Haversine formula
    const R = 6371; // Earth's radius in kilometers

    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // Distance in kilometers
    console.log("distance: " + distance);
    return distance;
  };

  const findClimbingGym = async () => {
    const location = await Location.getCurrentPositionAsync({});
    console.log("User location:", location.coords);
    if (location) {
      // Find the closest business location
      let closestBusiness = null;
      let minDistance = Infinity;

      const userLatitude = location.coords.latitude; // Get user's latitude
      const userLongitude = location.coords.longitude; // Get user's longitude

      for (const gym of businessLocations) {
        const distance = await calculateDistance(
          userLatitude,
          userLongitude,
          gym.latitude,
          gym.longitude
        );

        if (distance < minDistance) {
          minDistance = distance;
          closestBusiness = gym;
          console.log(gym);
        }
      }

      console.log(userLatitude + ", " + userLongitude);
      console.log("Closest business:", closestBusiness.name);
      console.log("Distance:", minDistance, "meters");

      return closestBusiness.name;
    } else {
      return "No-Business-Found";
    }
  };

  const requestPermissions = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      console.log("status lib", status);
      setGalleryPermission(status === "granted");
    } catch (error) {
      console.log("error", error);
    }
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      console.log("status camera", status);
      setCameraPermission(status === "granted");
    } catch (error) {
      console.log("error", error);
    }

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status == "granted") {
        console.log("status location", status);
        setLocationPermission(status === "granted");
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const sortAndSave = async (
    allValues: LeaderboardEntry[],
    userName: string,
    currentUser: string
  ) => {
    allValues.sort((a, b) => b.overallScore - a.overallScore);

    if (allValues.length > 20) {
      allValues.pop();
    }

    const newLeaderboard = allValues.reduce((acc, cur, index) => {
      acc.set(index, cur);
      return acc;
    }, new Map<Number, LeaderboardEntry>());

    await db()
      .ref(`/leaderboards/${selectedLocation}/`)
      .update({ leaderboard: Object.fromEntries(newLeaderboard) });

    const { leaderboardIndex } = await findLeaderboardIndex(userName);
    await db()
      .ref(`/users/${currentUser}/${selectedLocation}/lbIndex`)
      .update({ lbIndex: leaderboardIndex });
  };

  const findLeaderboardIndex = async (userName: string) => {
    const leaderboard = await db()
      .ref(`leaderboards/${selectedLocation}/leaderboard`)
      .once("value");
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
    const totalGradePath = `/users/${currentUser}/${selectedLocation}/leaderboard/`;
    const gradesSnapshot = await db().ref(totalGradePath).once("value");
    const totalGrades = (gradesSnapshot.val().totalScore as number) + newgrade;
    //get ClimbsAmount from database
    const climbsAmountPath = `/users/${currentUser}/${selectedLocation}/climbsAmount`;
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

    // Update climbsAmount
    await db()
      .ref(climbsAmountPath)
      .update({ climbsAmount: climbsAmount + 1 });

    //Save new totalgrade to local user
    await db().ref(totalGradePath).update({ totalScore: totalGrades });

    const { leaderboardIndex, allValues } = await findLeaderboardIndex(
      userName
    );
    if (leaderboardIndex > -1) {
      allValues[leaderboardIndex] = {
        currentUser: currentUser,
        overallScore: totalGrades,
        name: userName,
        profilePic: profileImage,
        date: Date.now(),
        key: Date.now() + currentUser,
        allGrades: allGrades,
        climbingGym: selectedLocation,
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
        climbingGym: selectedLocation,
      });

      sortAndSave(allValues, userName, currentUser);
    }
  };

  const submitClimb = async (
    grade: number,
    color: string,
    imageUri: string,
    gym: string
  ) => {
    const currentUser = auth().currentUser;
    if (currentUser) {
      await saveClimb(gym, grade, color, imageUri, currentUser.uid);
    }
  };

  const takeImage = async () => {
    if (!cameraPermission) {
      requestPermissions();
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    }).then(async (response) => {
      if (!response.canceled) {
        prop.setImageUri(response.assets[0].uri);
        const gym = await findClimbingGym();
        climbingGym.value = gym;
        setSelectedLocation(gym);
        console.log("awaited for: " + gym);
        submitClimb(-1, "null", response.assets[0].uri, gym);
      }
    });
  };

  const pickImage = async () => {
    if (!galleryPermission) {
      requestPermissions();
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      prop.setImageUri(result.assets[0].uri);

      submitClimb(-1, "null", result.assets[0].uri, selectedLocation);
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
    gym: string,
    grade: number,
    color: string,
    imageUri: string,
    currentUser: string
  ) => {
    const date = Date.now();
    prop.setCurSessionId(date + currentUser);
    console.log("saving climb at climbing gym: " + gym);
    await db()
      .ref(`/users/${currentUser}/${gym}/sessions/${date + currentUser}`)
      .set({
        grade,
        color,
        imageUri,
        key: date + currentUser,
        date: date,
        climbingGym: gym,
      });
  };

  const updateClimb = async (
    newGrade: number,
    newColor: string,
    newImageUri: string,
    currentUser: string
  ) => {
    setClimbSubmitted(true);

    console.log("locationContextValue: " + selectedLocation);
    console.log("updating session with location: " + climbingGym.value);

    await db()
      .ref(
        `/users/${currentUser}/${selectedLocation}/sessions/${prop.sessionId}`
      )
      .update({
        grade: newGrade,
        color: newColor,
        imageUri: newImageUri,
        climbingGym: selectedLocation,
      });
    //get allGrades from database
    const allGradesPath = `/users/${currentUser}/${selectedLocation}/allGrades`;
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
          prop.isUsersClimbs ? (
            <View
              onTouchEnd={() => {
                takeImage();
              }}
              style={styles.emptyImageContainer}
            >
              <Text style={styles.emptyImageText}>+</Text>
            </View>
          ) : (
            <View />
          )
        ) : (
          <View style={styles.container}>
            <ImageBackground
              source={{
                uri: prop.imageUri,
              }}
              style={[
                styles.backgroundImage,
                {
                  width: CARD_HOLDER_WIDTH,
                  height: CARD_HOLDER_HEIGHT,
                },
              ]}
            >
              <View style={styles.rowContainer}>
                <View style={styles.row}>
                  <View>
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
                  <Animated.View style={[{ top: 32 }, rStyle]}>
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

                <View style={styles.colorContainer}>
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
                  style={styles.submitButton}
                >
                  <Text style={styles.text}>Submit Climb</Text>
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
  text: {
    fontSize: 30,
    color: "#6aafdf",
    alignSelf: "center",
    fontWeight: "600",
  },
  submitButton: {
    width: "100%",
    backgroundColor: "white",
    opacity: 0.7,
    height: 75,
    justifyContent: "center",
  },
  colorContainer: {
    width: 100,
    alignItems: "flex-start",
    alignSelf: "flex-end",
    height: "100%",
    right: 20,
  },
  row: {
    flexDirection: "row",
    gap: 80,
    left: 20,
  },
  rowContainer: {
    top: 20,
    flex: 1,
    height: "100%",
    opacity: 0.95,
  },
  backgroundImage: { borderRadius: 25, overflow: "hidden", bottom: 17 },
  container: { flex: 1, alignItems: "center", justifyContent: "flex-start" },
  emptyImageText: { fontSize: 50, top: 15 },
  emptyImageContainer: {
    alignItems: "center",
    justifyContent: "flex-start",
    width: 100,
    height: 100,
    borderRadius: 25,
  },
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
