import React, { useEffect, useState, Dispatch } from "react";
import {
  StatusBar,
  Text,
  View,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  Animated,
  TouchableOpacity,
  Platform,
} from "react-native";
import TallClimbHolder from "./tallClimbHolder";
import { FirebaseDatabaseTypes } from "@react-native-firebase/database";
import { FeedClimb } from "./types/feedclimb";
import auth from "@react-native-firebase/auth";
import db from "@react-native-firebase/database";

const { height: SCREENHEIGHT, width: SCREENWIDTH } = Dimensions.get("screen");

const CLIMB_HOLDER_HIEGHT = 450;
const CLIMB_HOLDER_WIDTH = SCREENWIDTH;
const SPACING = 0;
const SPACER_ITEM_SIZE = CLIMB_HOLDER_WIDTH * 0.25;
const leftKey = "left_spacer";

interface DropdownContentProps {
  currentUser: string;
}

const DropdownContenet: React.FC<DropdownContentProps> = ({ currentUser }) => {
  const [feed, setFeed] = useState<FeedClimb[]>([]);
  const [limit, setLimit] = useState(10);
  const [imageUri, setImageUri] = useState("null");
  const [curSessionId, setCurSessionId] = useState(Date.now());
  const flatListRef = React.useRef<FlatList>(null);

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
    }
  }, [curSessionId]);

  useEffect(() => {
    if (currentUser && !currentUser.includes("[")) {
      try {
        console.log("content Current User: " + currentUser);
        const refPath = `/users/${currentUser}/sessions`;
        db()
          .ref(refPath)
          .orderByKey()
          .limitToLast(limit)
          .on("value", onClimbChange);

        console.log("ref path: " + refPath);
        return db().ref(refPath).off("value", onClimbChange);
      } catch (e) {
        console.log(e.error);
      }
    } else {
      console.log("current User is undefined or equal to object Object");
    }
  }, [currentUser]); //CHANGING THIS TO CURRENTUSER SHOULD MAKE THE SCREEN UPDATE WHEN THE CURRENT USER IS CHANGED, BUT IT RETURNS ERROR.

  const scrollX = React.useRef(new Animated.Value(0)).current;
  return (
    <View
      style={{
        //top: SCREENHEIGHT - CLIMB_HOLDER_HIEGHT * 1.5,
        flex: 1,
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
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
          { useNativeDriver: false }
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
              style={{
                width: CLIMB_HOLDER_WIDTH,
                height: CLIMB_HOLDER_HIEGHT,
                alignItems: "center",
                justifyContent: "center",
                transform: [{ translateY }],
                borderRadius: 34,
              }}
            >
              <TallClimbHolder
                imageUri={item.imageUri}
                setImageUri={setImageUri}
                grade={item.grade}
                color={item.color}
                cardWidth={CLIMB_HOLDER_WIDTH}
                key={item.key}
                sessionId={curSessionId}
                setCurSessionId={setCurSessionId}
              />
            </Animated.View>
          );
        }}
      />
    </View>
  );
};

export default DropdownContenet;
