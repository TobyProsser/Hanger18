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

const CLIMB_HOLDER_HIEGHT = 375;
const CLIMB_HOLDER_WIDTH =
  Platform.OS === "ios" ? SCREENWIDTH * 0.72 : SCREENWIDTH * 0.74;
const SPACING = 10;
const SPACER_ITEM_SIZE = (SCREENWIDTH - CLIMB_HOLDER_WIDTH) * 0.25;
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

  React.useEffect(() => {
    if (climbs[0].key !== leftKey) {
      setClimbs([{ key: leftKey }, ...climbs, { key: "right-spacer" }]);
    }
  }, [climbs]);
  const scrollX = React.useRef(new Animated.Value(0)).current;
  return (
    <View
      style={{
        top: SCREENHEIGHT - CLIMB_HOLDER_HIEGHT * 1.5,
        flex: 1,
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
        snapToInterval={CLIMB_HOLDER_WIDTH + SPACING * 2}
        decelerationRate={Platform.OS === "ios" ? 0 : 0.98}
        renderToHardwareTextureAndroid
        bounces={false}
        snapToAlignment="center"
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        renderItem={({ item, index }) => {
          if (!item.imageUri) {
            return (
              <View
                style={{
                  width: SPACER_ITEM_SIZE,
                  backgroundColor: "yellow",
                  height: 200,
                }}
              />
            );
          }
          const inputRange = [
            (index - 2) * CLIMB_HOLDER_WIDTH,
            (index - 1) * CLIMB_HOLDER_WIDTH,
            index * CLIMB_HOLDER_WIDTH,
          ];
          const translateY = scrollX.interpolate({
            inputRange,
            outputRange: [0, -50, 0],
            extrapolate: "clamp",
          });
          return (
            <Animated.View
              style={{
                marginHorizontal: SPACING,
                padding: SPACING * 2,
                alignItems: "center",
                transform: [{ translateY }],
                backgroundColor: "white",
                borderRadius: 34,
              }}
            >
              <TallClimbHolder
                imageUri={item.imageUri}
                grade={item.grade}
                color={item.color}
                cardWidth={item.cardWidth}
              />
            </Animated.View>
          );
        }}
      />
    </View>
  );
};
