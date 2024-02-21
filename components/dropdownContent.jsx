import React, { useState } from "react";
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

const { height: SCREENHEIGHT, width: SCREENWIDTH } = Dimensions.get("screen");

const CLIMB_HOLDER_HIEGHT = 450;
const CLIMB_HOLDER_WIDTH = SCREENWIDTH;
const SPACING = 0;
const SPACER_ITEM_SIZE = CLIMB_HOLDER_WIDTH * 0.25;
const leftKey = "left_spacer";
export default DropdownContenet = () => {
  const [climbs, setClimbs] = useState(
    Array.from({ length: 10 }, (_, i) => ({
      key: `${i}`,
      imageUri:
        "https://runwildmychild.com/wp-content/uploads/2022/09/Indoor-Rock-Climbing-for-Kids-Climbing-Wall.jpg",
      grade: Math.floor(Math.random() * 12) + 1,
      color: "red",
      cardWidth: CLIMB_HOLDER_WIDTH,
    }))
  );
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
        showsHorizontalScrollIndicator={false}
        data={climbs}
        keyExtractor={(item) => item.key}
        horizontal
        contentContainerStyle={{
          alignItems: "center",
        }}
        renderToHardwareTextureAndroid
        bounces={false}
        snapToInterval={SCREENWIDTH}
        decelerationRate={"fast"}
        position="absolute"
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
                grade={item.grade}
                color={item.color}
                cardWidth={CLIMB_HOLDER_WIDTH}
              />
            </Animated.View>
          );
        }}
      />
    </View>
  );
};
