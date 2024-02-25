import React, { useEffect, useState } from "react";
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
import { FeedClimb } from "./types/FeedClimb";
import auth from "@react-native-firebase/auth";
import db from "@react-native-firebase/database";

const { height: SCREENHEIGHT, width: SCREENWIDTH } = Dimensions.get("screen");

const CLIMB_HOLDER_HIEGHT = 450;
const CLIMB_HOLDER_WIDTH = SCREENWIDTH;
const SPACING = 0;
const SPACER_ITEM_SIZE = CLIMB_HOLDER_WIDTH * 0.25;
const leftKey = "left_spacer";



//{ currentUser } in ()
const DropdownContenet = () => {
  const [feed, setFeed] = useState<FeedClimb[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [limit, setLimit] = useState(10);
  const [imageUri, setImageUri] = useState('null');

  let climbSpacer: FeedClimb = {
    key: "1",
    date: Date.now(),
    name: "My Climb",
    grade: 5,
    color: "red",
    imageUri: "https://example.com/image.jpg",
  };
  
  

  const onClimbChange = (snapshot: FirebaseDatabaseTypes.DataSnapshot) => {
    if (snapshot.val()) {
      const values: FeedClimb[] = Array.isArray(snapshot.val()) ? snapshot.val() : Object.values(snapshot.val());
      values.sort((a, b) => b.date - a.date);
      setFeed([...values,]);
      console.log('FeedLength: ' + feed.length);
      setLimit(10);

     
    }
  };

  useEffect(() => {
    const currentUser = auth().currentUser;
    const refPath = `/users/${currentUser.uid}/sessions`;
    db()
      .ref(refPath)
      .orderByKey()
      .limitToLast(limit)
      .on("value", onClimbChange);

    return () => db().ref(refPath).off("value", onClimbChange);
  }, [limit]);

  const scrollX = React.useRef(new Animated.Value(0)).current;
  return (
    <View
    onTouchEnd={() => {
      console.log("feed count: " + feed.length)
    }}
      style={{
        //top: SCREENHEIGHT - CLIMB_HOLDER_HIEGHT * 1.5,
        flex: 1,
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Animated.FlatList
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
              />
            </Animated.View>
          );
        }}
      />
    </View>
  );
};

export default DropdownContenet;
