import React, { useState, useEffect, Dispatch } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Alert,
  ActivityIndicator,
} from "react-native";
import Dropdown from "./dropList";
import ColorDropdown from "./dropListColor";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

import * as Location from "expo-location";

import businessLocations from "./data/climbgymlocations";
import auth from "@react-native-firebase/auth";
import db from "@react-native-firebase/database";
import firebase from "./data/firebase";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import * as ImagePicker from "expo-image-picker";
import { LeaderboardEntry } from "./types/leaderboardentry";
import { useLocationContext } from "./context/locationcontext";
import * as ImageManipulator from "expo-image-manipulator";
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

const options2 = [
  { label: "V8" },
  { label: "V9" },
  { label: "V10" },
  { label: "V11" },
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
  onPress: (summary: string) => void;
}

const TallClimbHolder = (prop: ITallClimbHolderProps) => {
  const [grade1, setGrade1] = useState(prop.grade ? prop.grade : -1);
  const [color1, setColor1] = useState(prop.color ? prop.color : "null");
  const isGradeExpanded = useSharedValue(false);
  const isColorExpanded = useSharedValue(false);
  const image = useSharedValue("null");
  const [cameraPermission, setCameraPermission] = useState(null);
  const [galleryPermission, setGalleryPermission] = useState(null);
  const [locationPermission, setLocationPermission] = useState(null);
  const [loading, setLoading] = useState(false);
  //const [climbingGym, setClimbingGym] = useState("");
  const climbingGym = useSharedValue("");
  const [header, setHeader] = useState({ label: "V#" });

  const [climbSubmitted, setClimbSubmitted] = useState(false);

  const { selectedLocation, setSelectedLocation, setLBScrollTo } =
    useLocationContext();

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

  const findClimbingGym = async (climbID: string, image: string) => {
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
        }
      }

      // console.log(userLatitude + ", " + userLongitude);
      // console.log("Closest business:", closestBusiness.name);
      // console.log("Distance:", minDistance, "meters");

      setLoading(false);
      console.log("returning closest business name: " + closestBusiness.name);
      //DISTANCE YOU ARE ALLOWED TO BE FROM THE GYM
      if (minDistance > 0.25) {
        //If too far, delete session
        if (climbID) {
          const currentUser = auth().currentUser;
          if (currentUser) {
            const ref = await db().ref(
              `/users/${currentUser.uid}/${selectedLocation}/sessions/${climbID}`
            );

            ref.remove();
            console.log("Too far from gym, climb deleted. prop id: " + climbID);
          }
        }

        Alert.alert(
          "No gym Found",
          `You are not close enough to a registered gym to submit climb. You are ${minDistance.toPrecision(
            2
          )} km away`,
          [
            { text: "Okay", onPress: () => console.log("OkayPressed") },
            {
              text: "Register",
              onPress: () =>
                Alert.alert(
                  "Register Gym",
                  "Please have the Gym Manager contact FathomCreative.contact@gmail.com"
                ),
            },
          ]
        );
        return "null";
      } else if (selectedLocation != closestBusiness.name) {
        //else if selected location is different from tracked location, move session.
        if (prop.sessionId) {
          const currentUser = auth().currentUser;
          if (currentUser) {
            try {
              db()
                .ref(
                  `/users/${currentUser.uid}/${selectedLocation}/sessions/${climbID}`
                )
                .remove();
              console.log(
                "Climb was submitted at wrong location and was resaved. Last sessionID: " +
                  climbID +
                  " climb was resaved using image: " +
                  image
              );
              setSelectedLocation(closestBusiness.name);
              submitClimb(
                prop.grade,
                prop.color,
                image,
                closestBusiness.name,
                true
              );
            } catch (error) {
              console.error("Error fetching last session:", error);
            }
          }
        }
      }

      console.log("returning closest business name: " + closestBusiness.name);
      return closestBusiness.name;
    } else {
      return "No-Business-Found";
    }
  };

  const requestPermissions = async (replacing: boolean) => {
    let perm1 = false;
    let perm2 = false;
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      console.log("status camera", status);
      setCameraPermission(status === "granted");
      perm1 = status === "granted";
    } catch (error) {
      console.log("error", error);
    }

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status == "granted") {
        console.log("status location", status);
        setLocationPermission(status === "granted");
        perm2 = status === "granted";
      }
    } catch (error) {
      console.log("error", error);
    }

    if (perm1 && perm2) {
      takeImage(replacing);
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
      .ref(`/users/${currentUser}/${selectedLocation}`)
      .update({ lbIndex: leaderboardIndex });

    setLBScrollTo(leaderboardIndex);
    console.log("SCROLLING TO " + leaderboardIndex + "On Leaderboard called");
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
    //Scroll to users place on leaderboard

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
    const data = await db().ref(`/users/${currentUser}`).once("value");
    const profileImage = data.val().profileImage;
    //Calculate total grade
    const totalGradePath = `/users/${currentUser}/${selectedLocation}`;
    const gradesSnapshot = await db().ref(totalGradePath).once("value");
    const totalGrades = (gradesSnapshot.val().totalScore as number) + newgrade;
    //get ClimbsAmount from database
    const climbsAmountPath = `/users/${currentUser}/${selectedLocation}`;
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
    gym: string,
    locationFound: boolean
  ) => {
    const currentUser = auth().currentUser;
    if (currentUser) {
      await saveClimb(
        gym,
        grade,
        color,
        imageUri,
        currentUser.uid,
        locationFound
      );
    }
  };

  const deleteLastSession = async () => {
    const currentUser = await auth().currentUser;
    console.log("current user " + currentUser.displayName);
    if (currentUser && prop.isUsersClimbs) {
      console.log("PROP ID: " + prop.sessionId);
      const sessionRef = await db().ref(
        `/users/${currentUser.uid}/${selectedLocation}/sessions/${prop.sessionId}`
      );
      sessionRef.remove();
    }
  };

  const UploadToStorageReturnUrl = async (uri: string): Promise<string> => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();

      const currentUser = await auth().currentUser;

      const ref = firebase
        .storage()
        .ref()
        .child(
          `images/${currentUser.uid}/${selectedLocation}/${
            currentUser.uid + Date.now()
          }.jpg`
        );
      const snapshot = await ref.put(blob);

      // Get the download URL for the uploaded image
      const downloadURL = await snapshot.ref.getDownloadURL();
      console.log("Image download URL:", downloadURL);

      return downloadURL;
    } catch (error) {
      console.error("Error uploading image to Firebase storage:", error);
      throw error;
    }
  };

  const takeImage = async (replacing: boolean) => {
    if (replacing) {
      deleteLastSession();
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    }).then(async (response) => {
      if (!response.canceled) {
        setLoading(true);

        const uri = response.assets[0].uri;

        // Compress the image
        const compressedImage = await ImageManipulator.manipulateAsync(
          uri,
          [{ resize: { height: 800 } }], // Resize if needed
          { compress: 0.8 } // Adjust compression quality
        );

        const imageUrl = await UploadToStorageReturnUrl(compressedImage.uri);
        prop.setImageUri(imageUrl);
        console.log("Image prop saved as: " + imageUrl);
        climbingGym.value = selectedLocation;

        submitClimb(-1, "null", imageUrl, selectedLocation, false);
      }
    });
  };

  const pickImage = async () => {
    if (!galleryPermission) {
      requestPermissions(false);
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      prop.setImageUri(result.assets[0].uri);

      submitClimb(-1, "null", result.assets[0].uri, selectedLocation, false);
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
    currentUser: string,
    locationFound: boolean
  ) => {
    const date = Date.now();
    const newID = date + currentUser;
    await prop.setCurSessionId(newID);
    await prop.setImageUri(imageUri);

    if (!locationFound) {
      findClimbingGym(newID, imageUri);
    }
    console.log(
      "saving climb at climbing gym: " +
        gym +
        " and setting prop session id " +
        newID +
        " and image: " +
        imageUri
    );
    await db().ref(`/users/${currentUser}/${gym}/sessions/${newID}`).set({
      grade,
      color,
      imageUri,
      key: newID,
      date: date,
      climbingGym: gym,
    });

    setLoading(false);
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
    const allGradesPath = `/users/${currentUser}/${selectedLocation}`;
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

  const rStyle1 = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isColorExpanded.value ? 1 : 0),
    };
  }, []);

  const [touchStartTime, setTouchStartTime] = useState(0);
  const [isPressed, setIsPressed] = useState(false);
  const opacity = useSharedValue(1);

  const handlePressIn = () => {
    setTouchStartTime(Date.now());
    setIsPressed(true);
    opacity.value = withSpring(0, { damping: 200 });
  };
  const handlePressOut = () => {
    const touchDuration = Date.now() - touchStartTime;
    if (touchDuration >= 500 && prop.isUsersClimbs) {
      // Long press detected (duration >= 1000 milliseconds)
      Alert.alert(
        "Replace Climb",
        "Are you sure you want to delete this climb and replace it with a new one?",
        [
          {
            text: "No",
            onPress: () => {
              console.log("Npo Pressed");
            },
          },
          {
            text: "Yes",
            onPress: () => {
              if (!cameraPermission) {
                requestPermissions(true);
              } else {
                takeImage(true);
              }
            },
          },
        ]
      );
    }
    setIsPressed(false);
    opacity.value = withSpring(1, { damping: 10 });
  };

  const reportUser = async () => {
    const currentUser = await auth().currentUser;
    if (currentUser) {
      Alert.prompt(
        "Report",
        "Please give more context to the report:",
        (text) => {
          // Handle the entered text (e.g., save it to state or perform an action)
          console.log("Entered text:", text);
          prop.onPress("Created by user: " + currentUser + ": " + text);
        },
        "plain-text", // Specify the input type (plain-text, secure-text, login-password)
        "", // Default value for the input field (optional)
        "default" // Keyboard type (optional)
      );
    }
  };

  return (
    <View style={[styles.climbHolder, { width: prop.cardWidth }]}>
      <View>
        {!prop.imageUri || prop.imageUri == "null" ? (
          prop.isUsersClimbs ? (
            <View
              onTouchEnd={() => {
                if (!cameraPermission) {
                  requestPermissions(false);
                } else {
                  takeImage(false);
                }
              }}
              style={styles.emptyImageContainer}
            >
              {loading ? (
                <View
                  style={{
                    flexDirection: "column",
                    gap: 20,
                  }}
                >
                  <Text style={{ textAlign: "center" }}>
                    Verifying image was taken from a climbing gym and sending
                    climb to assicated database...
                  </Text>
                  <ActivityIndicator size="large" />
                </View>
              ) : (
                <Text style={styles.emptyImageText}>+</Text>
              )}
            </View>
          ) : (
            <View
              onTouchStart={() => {
                reportUser();
              }}
              style={{
                width: 175,
                height: 80,
                borderRadius: 25,
                backgroundColor: "red",

                justifyContent: "center",
              }}
            >
              <Text style={styles.reportText}>Report</Text>
            </View>
          )
        ) : (
          <View
            style={{
              flex: 1,
              alignSelf: "center",
            }}
          >
            <TouchableWithoutFeedback
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
            >
              <View style={styles.container}>
                <Animated.View style={{ opacity }}>
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
                  ></ImageBackground>
                </Animated.View>
              </View>
            </TouchableWithoutFeedback>
            <View
              style={{
                flex: 1,
                backgroundColor: "orange",
                position: "absolute",
              }}
            >
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
              <View
                style={{
                  flexDirection: "row",
                  gap: -210,
                }}
              >
                <View style={styles.colorContainer}>
                  <ColorDropdown
                    header={header1}
                    options={options1}
                    isExpanded={isColorExpanded}
                    color={setColor1}
                    getColor={color1}
                    secondRow={false}
                    submitted={climbSubmitted}
                  />
                </View>
                <Animated.View
                  style={[styles.colorContainer, { top: 50 + 2 }, rStyle1]}
                >
                  <ColorDropdown
                    header={header1}
                    options={options2}
                    isExpanded={isColorExpanded}
                    color={setColor1}
                    getColor={color1}
                    secondRow={true}
                    submitted={climbSubmitted}
                  />
                </Animated.View>
              </View>
            </View>
            <View
              style={{
                position: "absolute",
                alignSelf: "center",
                justifyContent: "flex-end",
                width: 300,
                top: 220,
              }}
            >
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
            </View>
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
    alignSelf: "flex-end",
    left: 180,
  },
  row: {
    flexDirection: "row",
    gap: 80,
    left: 20,
    width: "100%",
    height: "100%",
  },
  rowContainer: {
    width: "100%",
    top: 10,
    backgroundColor: "red",
    justifyContent: "space-between",
    opacity: 0.95,
  },
  backgroundImage: { borderRadius: 25, overflow: "hidden", bottom: 17 },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  emptyImageText: { fontSize: 50, top: 15 },
  emptyImageContainer: {
    alignItems: "center",
    justifyContent: "flex-start",
    width: 250,
    height: 100,
    borderRadius: 25,
  },
  climbHolder: {
    top: 110,
    alignItems: "center",
    elevation: 5, // For shadow on Android
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    borderRadius: 35,
  },
  reportText: {
    fontSize: 30,
    color: "white",
    alignSelf: "center",
    fontWeight: "600",
  },
});
