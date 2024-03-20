import { FirebaseDatabaseTypes } from "@react-native-firebase/database";
import React, { useEffect, useState, useContext } from "react";
import { Dimensions } from "react-native";
import { StyleSheet, Text, View, Image, Animated } from "react-native";

import db from "@react-native-firebase/database";
import { FeedClimb } from "./types/feedclimb";
import PlacerColorItem from "./elements/placercoloritem";
//import LocationContext from "./context/locationcontext";

const unsetProfileImage =
  "https://simplyilm.com/wp-content/uploads/2017/08/temporary-profile-placeholder-1.jpg";

const SPACING = 10;
const AVATAR_SIZE = 70;
const ITEM_SIZE = AVATAR_SIZE + SPACING * 3;

var opacity;
var scale = 1;

interface ILeaderbaordProps {
  onPress: (currentUser) => void;
}

const LeaderboardList = (prop: ILeaderbaordProps) => {
  const scrollY = React.useRef(new Animated.Value(0)).current;

  const [leaderboard, setLeaderboard] = useState<FeedClimb[]>([]);
  const [isScrolling, setIsScrolling] = useState(false);

  //const locationContextValue = useContext(LocationContext);

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
      setLeaderboard([]);
      console.log("NO SNAPSHOT");
    }
  };

  const locationContextValue = "";
  useEffect(() => {
    const refPath = `/leaderboards/${locationContextValue}/leaderboard`;
    db().ref(refPath).on("value", onLeaderboardChange);
    //Causing error
    //return () => db().ref(refPath).off("value", onLeaderboardChange);
  }, [locationContextValue]);

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <Animated.FlatList
          data={leaderboard}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          onScrollBeginDrag={() => setIsScrolling(true)}
          onScrollEndDrag={() => setIsScrolling(false)}
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
                onTouchEnd={() => {
                  if (!isScrolling) {
                    prop.onPress(item.currentUser);
                  }
                }}
                style={[
                  styles.parentContainerStyle,
                  //{ opacity, transform: [{ scale }] },
                ]}
              >
                <View style={styles.centerAlign}>
                  <View style={styles.placerItemContainter}>
                    <PlacerColorItem index={index} />
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
                        <Text style={styles.text}>{item.allGrades}</Text>
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
    right: -10,
    alignSelf: "flex-end",
    alignContent: "flex-start",
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  centerAlign: { alignItems: "center" },
  container: { padding: 20, zIndex: 1, flex: 1, top: 350 },
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
    top: 105,
  },
});
