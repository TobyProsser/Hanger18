import React, { useState } from "react";
import { StyleSheet, Text, View, Image, Button } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
const logo =
  "https://climbhangar18.com/wp-content/uploads/2020/06/hangar-4-color-logo.png";
const profileImage =
  "https://simplyilm.com/wp-content/uploads/2017/08/temporary-profile-placeholder-1.jpg";

interface IProfileProps {
  onPress: () => void;
}
const Profile = (prop: IProfileProps) => {
  const { onPress } = prop;

  const onProfilePictureClick = () => {
    onPress();
  };

  function handleClick() {
    prop.onPress();
  }

  return (
    <View style={styles.profileContainer}>
      <View style={{ flexDirection: "column", alignItems: "center" }}>
        <View style={styles.profileImageContainer}>
          <Image source={{ uri: profileImage }} style={styles.image} />
        </View>
        <Button onPress={handleClick} title="press me" />
        <Text style={styles.nameText}>First Last, 24</Text>
        <View style={styles.line}></View>
        <View style={styles.rowStyle}>
          <Text style={styles.numbersText}>#157</Text>
          <Text style={styles.numbersText}>10/10</Text>
        </View>
        <Image source={{ uri: logo }} style={styles.logoImage} />
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  rowStyle: {
    left: -30,
    width: 125,
    height: 40,
    flexDirection: "row",
    alignSelf: "center",
  },
  nameText: {
    top: 20,
    width: "100%",
    fontSize: 35,
    fontWeight: "300",
    textAlign: "center",
    color: "white",
  },
  numbersText: {
    top: 30,
    width: "100%",
    fontSize: 25,
    fontWeight: "100",
    alignSelf: "flex-start",
    color: "white",
  },
  line: {
    top: 30,
    width: 200,
    height: 1,
    backgroundColor: "white",
  },
  profileContainer: {
    zIndex: 3,
    borderRadius: 35,
    width: "100%",

    height: 396,
    backgroundColor: "#6aafdf",
    alignItems: "center",
    justifyContent: "flex-start",
    elevation: 5, // For shadow on Android
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    paddingBottom: 50,
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
    top: 30,
    width: 150,
    height: 75,
  },
});
