import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image, Button } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import auth from "@react-native-firebase/auth";
import db from "@react-native-firebase/database";

const logo =
  "https://climbhangar18.com/wp-content/uploads/2020/06/hangar-4-color-logo.png";
const unsetProfileImage =
  "https://simplyilm.com/wp-content/uploads/2017/08/temporary-profile-placeholder-1.jpg";

interface IProfileProps {
  onPress: () => void;
}
const Profile = (prop: IProfileProps) => {
  const { onPress } = prop;
  const [name, setName] = useState("null");
  const [profileImage, setProfileImage] = useState("null");
  const [lbIndex, setLBIndex] = useState(0);
  const [climbsAmount, setClimbsAmount] = useState(0);

  const getUsersName = async () => {
    const currentUser = auth().currentUser;
    if (currentUser) {
      db()
        .ref(`/users/${currentUser.uid}`)
        .on("value", (snapshot) => {
          const userData = snapshot.val();
          const name = userData.name;
          setName(name);
        });

      db()
        .ref(`/users/${currentUser.uid}/profileImage`)
        .on("value", (snapshot) => {
          const data = snapshot.val();
          const profileImage = data.profileImageUri;
          setProfileImage(profileImage);
        });

      db()
        .ref(`/users/${currentUser.uid}/lbIndex`)
        .on("value", (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const templbIndex = data.lbIndex;
            setLBIndex(templbIndex);
          } else {
            console.log("The lbIndex path does not exist.");
          }
        });

      db()
        .ref(`/users/${currentUser.uid}/climbsAmount`)
        .on("value", (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const tempClimbsAmount = data.climbsAmount;
            setClimbsAmount(tempClimbsAmount);
          } else {
            console.log("The climbsAmount path does not exist.");
          }
        });
    }
  };

  useEffect(() => {
    getUsersName();
    // Cleanup function to remove the listeners when the component unmounts
    return () => {
      const currentUser = auth().currentUser;
      if (currentUser) {
        db().ref(`/users/${currentUser.uid}`).off();
        db().ref(`/users/${currentUser.uid}/profileImage`).off();
        db().ref(`/users/${currentUser.uid}/lbIndex`).off();
        db().ref(`/users/${currentUser.uid}/climbsAmount`).off();
      }
    };
  }, []);

  function handleClick() {
    prop.onPress();
  }

  return (
    <View style={styles.profileContainer}>
      <View style={{ flexDirection: "column", alignItems: "center" }}>
        <View
          style={styles.profileImageContainer}
          onTouchEnd={() => handleClick()}
        >
          <Image source={{ uri: profileImage }} style={styles.image} />
        </View>
        <View style={{ height: 38 }} />
        <Text style={styles.nameText}>{name}, 24</Text>
        <View style={styles.line}></View>
        <View style={styles.rowStyle}>
          <Text style={styles.numbersText}>#{lbIndex + 1}</Text>
          <Text style={styles.numbersText}>{climbsAmount}/10</Text>
        </View>
        <Image source={{ uri: logo }} style={styles.logoImage} />
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  rowStyle: {
    left: -19,
    width: 150,
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
