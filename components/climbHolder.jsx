import React, { useState } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import ColorSelect from "./colorSelect";

export default ClimbHolder = () => {
  return (
    <View style={styles.climbHolder}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <View
          style={{
            flexDirection: "column",
            width: "70%",
            height: "100%",
            justifyContent: "space-evenly",
          }}
        >
          <View style={styles.rowSmall}>
            <Text style={styles.nameText}>Grade:</Text>
            <View
              style={{
                width: 100,
                height: 50,
                backgroundColor: "red",
                borderRadius: 25,
              }}
            ></View>
          </View>
          <View style={styles.rowSmall}>
            <Text style={styles.nameText}>Color:</Text>
            <ColorSelect />
          </View>
        </View>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            source={{
              uri: "https://runwildmychild.com/wp-content/uploads/2022/09/Indoor-Rock-Climbing-for-Kids-Climbing-Wall.jpg",
            }}
            style={{
              width: 100,
              height: 150,
              borderRadius: 25,
            }}
          ></Image>
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
  rowSmall: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  nameText: {
    fontSize: 35,
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
    top: 25,
    width: 350,
    height: 200,
    backgroundColor: "white",
    elevation: 5, // For shadow on Android
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    borderRadius: 35,
    alignSelf: "center",
    padding: 20,
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
