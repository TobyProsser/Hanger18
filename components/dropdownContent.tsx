import React, { useEffect, useState, useContext, useCallback } from "react";
import {
  View,
  FlatList,
  Dimensions,
  Animated,
  StyleSheet,
  Image,
  Text,
  Alert,
  BackHandler,
} from "react-native";
import TallClimbHolder from "./tallClimbHolder";
import { FirebaseDatabaseTypes } from "@react-native-firebase/database";
import { FeedClimb } from "./types/feedclimb";
import db from "@react-native-firebase/database";
import auth from "@react-native-firebase/auth";
import * as ImagePicker from "expo-image-picker";

import { useLocationContext } from "./context/locationcontext";

import RNRestart from "react-native-restart";

const { height: SCREENHEIGHT, width: SCREENWIDTH } = Dimensions.get("screen");

const CLIMB_HOLDER_HIEGHT = 450;
const CLIMB_HOLDER_WIDTH = SCREENWIDTH;

interface DropdownContentProps {
  currentUser: string;
}

const profileImage =
  "https://simplyilm.com/wp-content/uploads/2017/08/temporary-profile-placeholder-1.jpg";

const DropdownContenet: React.FC<DropdownContentProps> = ({ currentUser }) => {
  const [feed, setFeed] = useState<FeedClimb[]>([]);
  const [limit, setLimit] = useState(10);
  const [imageUri, setImageUri] = useState("null");
  const [curSessionId, setCurSessionId] = useState(Date.now());
  const [isUsersClimbs, setIsUsersClimbs] = useState(false);
  const flatListRef = React.useRef<FlatList>(null);
  const [profileImageUri, setProfileImageUri] = useState<string | undefined>();
  //console.log(useLocationContext);
  const { selectedLocation, sessionScrollTo, setSessionScrollTo } =
    useLocationContext();
  const onClimbChange = (snapshot: FirebaseDatabaseTypes.DataSnapshot) => {
    if (snapshot.val()) {
      const values: FeedClimb[] = Array.isArray(snapshot.val())
        ? snapshot.val()
        : Object.values(snapshot.val());
      values.sort((a, b) => b.date - a.date);
      setFeed([...values]);
      setLimit(10);

      console.log("Climbs Length: " + values.length);
    }
  };
  //scroll to start
  React.useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
    }
  }, [curSessionId]);
  //Scroll Content
  React.useEffect(() => {
    if (sessionScrollTo == 10) {
      addButtonScroll();
      setSessionScrollTo(0);
    }
  }, [sessionScrollTo]);

  const addButtonScroll = async () => {
    // Wait for 1 second1 (1000 milliseconds)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    flatListRef.current.scrollToEnd({ animated: true });
  };

  const checkIfCurrentUser = async () => {
    const loggedInUser = await auth().currentUser;
    setIsUsersClimbs(loggedInUser.uid == currentUser);
  };

  const handleDeleteAccount = async (password: string) => {
    try {
      const user = auth().currentUser;

      if (!user) {
        console.warn("No user is currently authenticated.");
        return;
      }

      // Reauthenticate the user (e.g., using email and password)
      const credential = auth.EmailAuthProvider.credential(
        user.email,
        password
      );
      await user.reauthenticateWithCredential(credential);

      // Delete the user account
      await user.delete();

      console.log("User account deleted successfully");
      BackHandler.exitApp();
      // Call this function to restart the app
      //RNRestart.Restart();
    } catch (error) {
      console.error("Error reauthenticating or deleting user:", error.message);
    }
  };

  useEffect(() => {
    if (currentUser && !currentUser.includes("[")) {
      try {
        console.log("SElected location: " + selectedLocation);
        const refPath = `/users/${currentUser}/${selectedLocation}/sessions`;
        db()
          .ref(refPath)
          .orderByKey()
          .limitToLast(limit)
          .on("value", onClimbChange);

        checkIfCurrentUser();
        //return db().ref(refPath).off("value", onClimbChange);
      } catch (e) {
        console.log("Current User in dropdown content error: " + e.error);
      }
    } else {
      console.log("current User is undefined or equal to object Object");
    }

    if (currentUser == "edit") {
      const emptyFeedClimbs: FeedClimb[] = [
        {
          allGrades: "",
          currentUser: "",
          climbingGym: "",
        },
      ];

      setFeed(emptyFeedClimbs);
      getProfileImage();
    }
  }, [currentUser, selectedLocation, curSessionId]); //CHANGING THIS TO CURRENTUSER SHOULD MAKE THE SCREEN UPDATE WHEN THE CURRENT USER IS CHANGED, BUT IT RETURNS ERROR.

  const getProfileImage = async () => {
    const user = await auth().currentUser;
    await db()
      .ref(`/users/${user.uid}`)
      .once("value")
      .then((snapshot) => {
        let image = snapshot.val();

        const newValue = image.profileImage;
        setProfileImageUri(newValue);
        console.log(image.profileImage);
      })
      .catch((error) => console.error("Number could not be added: " + error));
  };

  const onPress = useCallback((summary: string) => {
    const refPath = `/reports/${selectedLocation}/${currentUser}`;
    db()
      .ref(refPath)
      .update({ reason: "Reporting User: " + currentUser + ", " + summary });
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;

      setProfileImageUri(uri);

      console.log("new URL: " + uri);
      const user = await auth().currentUser;
      db().ref(`/users/${user.uid}`).update({ profileImage: uri });
    }
  };

  const scrollX = React.useRef(new Animated.Value(0)).current;
  return (
    <View style={styles.container}>
      <Animated.FlatList
        ref={flatListRef}
        showsHorizontalScrollIndicator={false}
        data={feed}
        keyExtractor={(item) => item.key}
        horizontal
        contentContainerStyle={{
          alignItems: "center",
        }}
        renderToHardwareTextureAndroid
        bounces={false}
        snapToInterval={SCREENWIDTH}
        decelerationRate={"fast"}
        snapToAlignment="center"
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        renderItem={({ item, index }) => {
          const inputRange = [
            (index - 1) * CLIMB_HOLDER_WIDTH,
            index * CLIMB_HOLDER_WIDTH,
            (index + 1) * CLIMB_HOLDER_WIDTH,
          ];
          const translateY = scrollX.interpolate({
            inputRange,
            outputRange: [0, -50, 0],
            extrapolate: "clamp",
          });
          return (
            <Animated.View
              style={[
                styles.animatedView,
                {
                  width: CLIMB_HOLDER_WIDTH,
                  height: CLIMB_HOLDER_HIEGHT,
                  transform: [{ translateY }],
                },
              ]}
            >
              {currentUser == "edit" ? (
                <View style={{ flexDirection: "column", gap: 80 }}>
                  <View
                    style={styles.profileImageContainer}
                    onTouchEnd={() => pickImage()}
                  >
                    <Image
                      source={{
                        uri: profileImageUri ? profileImageUri : profileImage,
                      }}
                      style={styles.image}
                    />
                  </View>
                  <View
                    onTouchStart={() => {
                      Alert.prompt(
                        "Confirm Deletion",
                        "Enter your password to delete account.",
                        [
                          {
                            text: "Cancel",
                            style: "cancel",
                          },
                          {
                            text: "Delete",
                            onPress: (password) =>
                              handleDeleteAccount(password),
                          },
                        ]
                      );
                    }}
                    style={{
                      width: 250,
                      height: 80,
                      borderRadius: 25,
                      backgroundColor: "red",

                      justifyContent: "center",
                    }}
                  >
                    <Text style={styles.reportText}>Delete Account</Text>
                  </View>
                </View>
              ) : (
                <TallClimbHolder
                  imageUri={item.imageUri}
                  setImageUri={setImageUri}
                  grade={item.grade}
                  color={item.color}
                  cardWidth={CLIMB_HOLDER_WIDTH}
                  key={item.key}
                  sessionId={item.key}
                  setCurSessionId={setCurSessionId}
                  isUsersClimbs={isUsersClimbs}
                  onPress={onPress}
                />
              )}
            </Animated.View>
          );
        }}
      />
    </View>
  );
};

export default DropdownContenet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  animatedView: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 34,
  },
  profileImageContainer: {
    alignSelf: "center",
    width: 150,
    height: 150,
    backgroundColor: "#FFFFFF",
    borderRadius: 100,
    elevation: 5, // For shadow on Android
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    //padding: 10,
    marginTop: 20,
    top: 50,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 10,
    borderRadius: 100,
  },
  reportText: {
    fontSize: 30,
    color: "white",
    alignSelf: "center",
    fontWeight: "600",
  },
});
