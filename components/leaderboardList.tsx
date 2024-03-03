import { FirebaseDatabaseTypes } from "@react-native-firebase/database";
import React, { useEffect, useState } from "react";
import { Dimensions } from "react-native";
import { StyleSheet, Text, View, Image, Animated } from "react-native";

import db from "@react-native-firebase/database";
import { FeedClimb } from "./types/feedclimb";
import auth from "@react-native-firebase/auth";
import PlacerColorItem from "./elements/placercoloritem";
const { width, height } = Dimensions.get("screen");

const logo =
  "https://climbhangar18.com/wp-content/uploads/2020/06/hangar-4-color-logo.png";
const unsetProfileImage =
  "https://simplyilm.com/wp-content/uploads/2017/08/temporary-profile-placeholder-1.jpg";

const DATA = [...Array(30).keys()].map((_, i) => {
  return {
    key: Math.random().toString(36),
    image: unsetProfileImage,
    name: "First Last",
    jobTitle: "#000",
    email: "v9, v8, v9, v7 ...",
  };
});

const SPACING = 10;
const AVATAR_SIZE = 70;
const ITEM_SIZE = AVATAR_SIZE + SPACING * 3;

var opacity;
var scale = 1;

const LeaderboardList = () => {
  const scrollY = React.useRef(new Animated.Value(0)).current;

  const [leaderboard, setLeaderboard] = useState<FeedClimb[]>([]);
  const [gradesText, setGradesText] = useState("");

  //Changes color of the

  const onLeaderboardChange = (
    snapshot: FirebaseDatabaseTypes.DataSnapshot
  ) => {
    if (snapshot.val()) {
      const values: FeedClimb[] = snapshot.val();
      if (values) {
        setLeaderboard(values);
      }
    } else {
      console.log("NO SNAPSHOT");
    }
  };

  useEffect(() => {
    const refPath = "/leaderboard";
    db().ref(refPath).on("value", onLeaderboardChange);
    //Causing error
    //return () => db().ref(refPath).off("value", onLeaderboardChange);
  }, []);

  return (
    <View style={{ padding: 20, zIndex: 1, flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Animated.FlatList
          data={leaderboard}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
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

            return (
              <Animated.View
                style={[
                  styles.parentContainerStyle,
                  { overflow: "hidden", height: 100 },
                  //{ opacity, transform: [{ scale }] },
                ]}
              >
                <View
                  style={{
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      top: -10,
                      right: -10,
                      alignSelf: "flex-end",
                      alignContent: "flex-start",
                      borderRadius: 18,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <PlacerColorItem index={index} />
                  </View>

                  <View
                    style={{
                      top: -55,
                      paddingTop: 10,
                      paddingBottom: 10,
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      gap: 15,
                    }}
                  >
                    <View
                      style={{
                        shadowColor: "#000",
                        shadowOffset: {
                          width: 0,
                          height: 2,
                        },
                        shadowOpacity: 0.15,
                        shadowRadius: 2,
                      }}
                    >
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
                    <View style={{ flexDirection: "column" }}>
                      <Text style={styles.nameText}>{item.name}</Text>
                      <View style={styles.line}></View>
                      <View
                        style={{
                          top: 15,
                          width: 200,
                          height: 35,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 22,
                            fontWeight: "100",
                            color: "white",
                          }}
                        >
                          {item.allGrades}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </Animated.View>
            );
          }}
        />
      </View>
    </View>
  );
};

export default LeaderboardList;

const styles = StyleSheet.create({
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

    top: 50,
  },
});
