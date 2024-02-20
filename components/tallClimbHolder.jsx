import React, { useState } from "react";
import { StyleSheet, Text, View, Image, ImageBackground } from "react-native";
import ColorSelect from "./colorSelect";
import Dropdown from "./dropList";

const CARD_HOLDER_HEIGHT = 375;
//https://runwildmychild.com/wp-content/uploads/2022/09/Indoor-Rock-Climbing-for-Kids-Climbing-Wall.jpg

const options = [
  { label: "V0" },
  { label: "V1" },
  { label: "V2" },
  { label: "V3" },
  { label: "V4" },
  { label: "V5" },
  { label: "V6" },
  { label: "V7" },
  { label: "V8" },
  { label: "V9" },
  { label: "V10" },
  { label: "V11" },
  { label: "V12" },
];

const header = { label: "V#" };

export default TallClimbHolder = ({ imageUri, grade, color, cardWidth }) => {
  console.log(cardWidth);
  console.log();
  return (
    <View style={[styles.climbHolder, { width: cardWidth }]}>
      <View>
        <View
          style={{
            flex: 1,
            alignItems: "center",
          }}
        >
          <ImageBackground
            source={{
              uri: imageUri,
            }}
            style={{
              width: "100%",
              height: CARD_HOLDER_HEIGHT,
              borderRadius: 25,
              overflow: "hidden",
              bottom: 17,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                alignSelf: "center",
                padding: 5,
                paddingTop: -4,
                opacity: 0.75,
              }}
            >
              <View
                style={{
                  flex: 1,
                  backgroundColor: "red",
                  bottom: 200,
                  left: 20,
                }}
              >
                <Dropdown header={header} options={options} />
              </View>
              <View style={styles.columnSmall}>
                <Text style={styles.nameText}>Color:</Text>
                <ColorSelect />
              </View>
            </View>
          </ImageBackground>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  handle: {
    width: 30,
    height: 3,
  },
  rowStyle: {
    left: -30,
    width: 125,
    height: 40,
    flexDirection: "row",
  },
  columnSmall: {
    flexDirection: "column",
  },
  nameText: {
    fontSize: 30,
    fontWeight: "300",
    textAlign: "center",
    color: "#6aafdf",
  },
  numbersText: {
    top: 70,
    width: "100%",
    fontSize: 25,
    fontWeight: "100",
    color: "white",
  },
  line: {
    top: 70,
    width: 200,
    height: 1,
    backgroundColor: "white",
  },
  FormContainer: {
    zIndex: 2,
    flex: 1,
    borderRadius: 35,
    width: "100%",
    backgroundColor: "#FFFFFF",
    elevation: 5, // For shadow on Android
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    paddingBottom: 50,
  },
  climbHolder: {
    height: CARD_HOLDER_HEIGHT,
    backgroundColor: "white",
    alignSelf: "center",
    elevation: 5, // For shadow on Android
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    borderRadius: 35,
    marginVertical: -50,
    paddingTop: 17.5,
  },
  profileImageContainer: {
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
  logoImage: {
    top: 50,
    width: 150,
    height: 75,
    marginTop: 30,
  },
});
