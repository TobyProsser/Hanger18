import React, { useEffect, useState, useContext, useCallback } from "react";
import { View, FlatList, Dimensions, Animated, StyleSheet } from "react-native";
import TallClimbHolder from "./tallClimbHolder";
import { FirebaseDatabaseTypes } from "@react-native-firebase/database";
import { FeedClimb } from "./types/feedclimb";
import db from "@react-native-firebase/database";
import auth from "@react-native-firebase/auth";

import { useLocationContext } from "./context/locationcontext";

const { height: SCREENHEIGHT, width: SCREENWIDTH } = Dimensions.get("screen");

const CLIMB_HOLDER_HIEGHT = 450;
const CLIMB_HOLDER_WIDTH = SCREENWIDTH;

interface DropdownContentProps {
  currentUser: string;
}

const DropdownContenet: React.FC<DropdownContentProps> = ({ currentUser }) => {
  const [feed, setFeed] = useState<FeedClimb[]>([]);
  const [limit, setLimit] = useState(10);
  const [imageUri, setImageUri] = useState("null");
  const [curSessionId, setCurSessionId] = useState(Date.now());
  const [isUsersClimbs, setIsUsersClimbs] = useState(false);
  const flatListRef = React.useRef<FlatList>(null);
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
    }
  };

  React.useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
      console.log("SCROLLTO_START");
    }
  }, [curSessionId]);

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
    console.log("SCROLLTOEND");
  };

  const checkIfCurrentUser = async () => {
    const loggedInUser = await auth().currentUser;
    setIsUsersClimbs(loggedInUser.uid == currentUser);
  };

  useEffect(() => {
    console.log(
      "change in location or session id or current user: " + selectedLocation
    );
    if (currentUser && !currentUser.includes("[")) {
      try {
        const refPath = `/users/${currentUser}/${selectedLocation}/sessions`;
        db()
          .ref(refPath)
          .orderByKey()
          .limitToLast(limit)
          .on("value", onClimbChange);

        checkIfCurrentUser();
        return db().ref(refPath).off("value", onClimbChange);
      } catch (e) {
        console.log("Current User in dropdown content error: " + e.error);
      }
    } else {
      console.log("current User is undefined or equal to object Object");
    }
  }, [currentUser, selectedLocation, curSessionId]); //CHANGING THIS TO CURRENTUSER SHOULD MAKE THE SCREEN UPDATE WHEN THE CURRENT USER IS CHANGED, BUT IT RETURNS ERROR.

  const onPress = useCallback((summary: string) => {
    const refPath = `/reports/${selectedLocation}/${currentUser}`;
    db()
      .ref(refPath)
      .update({ reason: "Reporting User: " + currentUser + ", " + summary });
  }, []);

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
});
