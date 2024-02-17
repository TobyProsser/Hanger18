import React, { useState } from "react";
import { Dimensions } from "react-native";
import {
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  FlatList,
  Animated,
  TouchableOpacity,
  Easing,
  SafeAreaViewBase,
  SafeAreaView,
} from "react-native";
const { width, height } = Dimensions.get("screen");

const logo =
  "https://climbhangar18.com/wp-content/uploads/2020/06/hangar-4-color-logo.png";
const profileImage =
  "https://simplyilm.com/wp-content/uploads/2017/08/temporary-profile-placeholder-1.jpg";

const DATA = [...Array(30).keys()].map((_, i) => {
  return {
    key: Math.random().toString(36),
    image: profileImage,
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

export default LeaderboardList = () => {
  const scrollY = React.useRef(new Animated.Value(0)).current;

  return (
    <View style={{ padding: 20, zIndex: 1 }}>
      <View>
        <Animated.FlatList
          data={DATA}
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
            scale = scrollY.interpolate({
              inputRange,
              outputRange: [1, 1, 1, 0],
            });
            opacity = scrollY.interpolate({
              inputRange: opacityInputRange,
              outputRange: [1, 1, 1, 0],
            });
            return (
              <Animated.View style={[styles.parentContainerStyle]}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    left: 15,
                    gap: 15,
                  }}
                >
                  <View>
                    <Image
                      source={{ uri: item.image }}
                      style={{
                        width: AVATAR_SIZE,
                        height: AVATAR_SIZE,
                        borderRadius: AVATAR_SIZE,
                        marginRight: SPACING / 2,
                      }}
                    />
                  </View>
                  <View>
                    <Text
                      style={{
                        fontSize: 22,
                        fontWeight: "700",
                        color: "white",
                      }}
                    >
                      {item.name}
                    </Text>
                    <Text
                      style={{ fontSize: 22, opacity: 0.7, color: "white" }}
                    >
                      {item.jobTitle}
                    </Text>
                    <Text
                      style={{ fontSize: 22, opacity: 0.8, color: "#C1E3EE" }}
                    >
                      {item.email}
                    </Text>
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

const styles = StyleSheet.create({
  rowStyle: {
    left: -30,
    width: 125,
    height: 40,
    flexDirection: "row",
    alignSelf: "center",
  },

  parentContainerStyle: {
    padding: SPACING,
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
    opacity,
    transform: [{ scale }],
    top: 50,
  },
});
