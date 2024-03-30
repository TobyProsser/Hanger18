import { FirebaseDatabaseTypes } from "@react-native-firebase/database";
import React, { useEffect, useState, useContext, useRef } from "react";
import { Dimensions, FlatList, TouchableOpacity } from "react-native";
import { StyleSheet, Text, View, Image, Animated } from "react-native";

import db from "@react-native-firebase/database";
import { FeedClimb } from "./types/feedclimb";
import PlacerColorItem from "./elements/placercoloritem";
import { useLocationContext } from "./context/locationcontext";
//import LocationContext from "./context/locationcontext";

import businessLocations from "./data/climbgymlocations";
import leaderboardItem from "./leaderboardItem";

const unsetProfileImage =
  "https://simplyilm.com/wp-content/uploads/2017/08/temporary-profile-placeholder-1.jpg";

const SPACING = 10;
const AVATAR_SIZE = 70;
const ITEM_SIZE = AVATAR_SIZE + SPACING * 3;

var opacity;
var scale = 1;

interface ILeaderbaordProps {
  onPress: (currentUser) => void;
  lbScrollTo: number;
}

const LeaderboardList = (prop: ILeaderbaordProps) => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const [leaderboard, setLeaderboard] = useState<FeedClimb[]>([]);
  const [isScrolling, setIsScrolling] = useState(false);
  const [prevLocation, setPrevLocation] = useState("");
  const { selectedLocation, lbScrollTo, setSelectedLocation } =
    useLocationContext();

  const [loadedItems, setLoadedItems] = useState(7); // Initial number of items to load

  const flatListRef = React.useRef<FlatList>(null);

  const scrollToUserIndex = () => {
    if ((flatListRef.current as any).length > lbScrollTo) {
      flatListRef.current.scrollToIndex({ animated: true, index: lbScrollTo });
    }

    console.log("lbScrollTo: " + lbScrollTo);
  };
  const onLeaderboardChange = (
    snapshot: FirebaseDatabaseTypes.DataSnapshot
  ) => {
    if (snapshot.val()) {
      const values: FeedClimb[] = snapshot.val();
      if (values) {
        const spacer: FeedClimb = {
          key: "spacer",
          allGrades: "",
          currentUser: "",
          climbingGym: "",
        };
        setLeaderboard([spacer, spacer, ...values, spacer]);
      }
    } else {
      setLeaderboard([]);
      console.log("NO SNAPSHOT");
    }
  };

  const retrieveData = async (refPath: string) => {
    try {
      const snapshot = await db()
        .ref(refPath)
        .orderByKey()
        .limitToLast(loadedItems)
        .once("value");

      const values: FeedClimb[] = [];
      const spacerValue: FeedClimb = {
        key: "spacer" + Date.now(),
        allGrades: "",
        currentUser: "",
        climbingGym: "",
      };
      const spacerValue1: FeedClimb = {
        key: "spacer1" + Date.now(),
        allGrades: "",
        currentUser: "",
        climbingGym: "",
      };
      snapshot.forEach((childSnapshot) => {
        const value = childSnapshot.val();
        if (value) {
          values.push(value);
        } else {
          return true;
        }
      });

      setLeaderboard([spacerValue, ...values, spacerValue1]);
    } catch (error) {
      console.log(error);
    }
  };

  const retrieveMore = async () => {
    try {
      const lastVisibleKey = leaderboard[leaderboard.length - 1]?.key;
      if (!lastVisibleKey) return; // No more items to load

      const additionalSnapshot = await db()
        .ref(`/leaderboards/${selectedLocation}/leaderboard`)
        .orderByKey()
        .startAt(lastVisibleKey)
        .limitToFirst(loadedItems)
        .once("value");

      const additionalValues: FeedClimb[] = [];
      additionalSnapshot.forEach((childSnapshot) => {
        const value = childSnapshot.val();
        if (value) {
          additionalValues.push(value);
        } else {
          return true;
        }
      });

      const spacerValue: FeedClimb = {
        key: "spacer" + Date.now(),
        allGrades: "",
        currentUser: "",
        climbingGym: "",
      };
      //Remove spacer
      leaderboard.pop();
      setLeaderboard([...leaderboard, ...additionalValues, spacerValue]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    let refPath = "";
    if (selectedLocation) {
      refPath = `/leaderboards/${selectedLocation}/leaderboard`;
      setPrevLocation(selectedLocation);
    } else {
      if (prevLocation) {
        refPath = `/leaderboards/${prevLocation}/leaderboard`;
      } else {
        refPath = `/leaderboards/${businessLocations[0].name}/leaderboard`;
      }
    }
    retrieveData(refPath);
    scrollToUserIndex();
  }, [selectedLocation, lbScrollTo]);

  const leaderboardGradesText = (grades) => {
    let newString = "";
    console.log(grades[0]);
    if (grades[0] == "[") {
      newString = grades.substring(15);
      console.log("new" + newString);
    } else {
      newString = grades;
    }
    newString =
      newString.length >= 16 ? newString.slice(0, 16) + " ..." : newString;

    return newString;
  };
  return (
    <View style={styles.container}>
      <View style={{ flex: 0.65, top: 260 }}>
        <Animated.FlatList
          ref={flatListRef}
          data={leaderboard.slice(0, loadedItems)}
          onEndReached={() => {
            retrieveMore;
          }}
          onScrollBeginDrag={() => setIsScrolling(true)}
          onScrollEndDrag={() => {
            setIsScrolling(false);
          }}
          keyExtractor={(item) => item.key}
          contentContainerStyle={{
            padding: SPACING,
          }}
          renderItem={({ item, index }) => {
            const inputRange = [
              -1,
              0,
              ITEM_SIZE * index,
              ITEM_SIZE * (index + 2),
            ];
            const opacityInputRange = [
              -1,
              0,
              ITEM_SIZE * index,
              ITEM_SIZE * (index + 0.5),
            ];
            // scale = scrollY.interpolate({
            //   inputRange,
            //   outputRange: [1, 1, 1, 0],
            // });
            opacity = scrollY.interpolate({
              inputRange: opacityInputRange,
              outputRange: [1, 1, 1, 0],
            });

            return !item.key.includes("spacer") ? (
              <Animated.View
                style={[
                  styles.parentContainerStyle,
                  //{ opacity, transform: [{ scale }] },
                ]}
              >
                <View style={styles.centerAlign}>
                  <TouchableOpacity
                    onPress={() => {
                      if (!isScrolling) {
                        console.log("current User: " + item.currentUser);
                        prop.onPress(item.currentUser);
                      }
                    }}
                    activeOpacity={0.8}
                  >
                    <View style={styles.placerItemContainter}>
                      <PlacerColorItem index={index - 1} />
                    </View>

                    <View style={styles.contentContainer}>
                      <View style={styles.shadow}>
                        <Image
                          source={{
                            uri: item.profilePic
                              ? item.profilePic
                              : unsetProfileImage,
                          }}
                          style={{
                            width: AVATAR_SIZE,
                            height: AVATAR_SIZE,
                            borderRadius: AVATAR_SIZE,
                            marginRight: SPACING / 2,
                          }}
                        />
                      </View>
                      <View style={styles.column}>
                        <Text style={styles.nameText}>{item.name}</Text>
                        <View style={styles.line}></View>
                        <View style={styles.textSpacing}>
                          <Text style={styles.text}>
                            {leaderboardGradesText(item.allGrades)}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            ) : (
              <View style={{ height: 200 }} />
            );
          }}
        />
      </View>
    </View>
  );
};

export default LeaderboardList;

const styles = StyleSheet.create({
  textSpacing: {
    top: 15,
    width: 200,
    height: 35,
  },
  text: { fontSize: 22, fontWeight: "100", color: "white" },
  column: { flexDirection: "column" },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  contentContainer: {
    top: -55,
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 15,
  },
  placerItemContainter: {
    top: -10,
    right: -30,
    alignSelf: "flex-end",
    alignContent: "flex-start",
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  centerAlign: { alignItems: "center" },
  container: {
    padding: 20,
    zIndex: 1,
    flex: 1,
  },
  rowStyle: {
    left: -30,
    width: 125,
    height: 40,
    flexDirection: "row",
    alignSelf: "center",
  },
  nameText: {
    fontSize: 25,
    fontWeight: "300",
    color: "white",
  },
  line: {
    top: 5,
    width: 100,
    height: 1,
    backgroundColor: "white",
  },
  parentContainerStyle: {
    marginBottom: SPACING + 2.5,
    borderRadius: 18,
    backgroundColor: "#6aafdf",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    overflow: "hidden",
    height: 100,
  },
});
