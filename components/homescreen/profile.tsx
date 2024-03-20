import React, { useEffect, useState, useContext } from "react";
import { StyleSheet, Text, View, Image, Dimensions } from "react-native";
import auth from "@react-native-firebase/auth";
import db from "@react-native-firebase/database";
import { useLocationContext } from "../context/locationcontext";

//import LocationContext from "../context/locationcontext";

const { width: SCREENWIDTH } = Dimensions.get("screen");

const logo =
  "https://climbhangar18.com/wp-content/uploads/2020/06/hangar-4-color-logo.png";

interface IProfileProps {
  onPress: (currentUser) => void;
}
const Profile = (prop: IProfileProps) => {
  const [name, setName] = useState("null");
  const [profileImage, setProfileImage] = useState("null");
  const [lbIndex, setLBIndex] = useState(0);
  const [climbsAmount, setClimbsAmount] = useState(0);

  const { selectedLocation, setSelectedLocation } = useLocationContext();

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
        .ref(`/users/${currentUser.uid}/${selectedLocation}/lbIndex`)
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
        .ref(`/users/${currentUser.uid}/${selectedLocation}/climbsAmount`)
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
        db().ref(`/users/${currentUser.uid}/${selectedLocation}/lbIndex`).off();
        db()
          .ref(`/users/${currentUser.uid}/${selectedLocation}/climbsAmount`)
          .off();
      }
    };
  }, [selectedLocation]);

  const handleClick = async () => {
    const currentUser = await auth().currentUser;
    if (currentUser) {
      prop.onPress(currentUser.uid);
    }
  };

  return (
    <View style={styles.profileContainer}>
      <View
        style={{
          width: SCREENWIDTH,
        }}
      >
        <View
          style={styles.button}
          onTouchEnd={() => {
            handleClick();
          }}
        >
          <Text style={styles.text}>Add</Text>
        </View>
      </View>
      <View style={styles.column}>
        <View
          style={styles.profileImageContainer}
          onTouchEnd={() => handleClick()}
        >
          <Image source={{ uri: profileImage }} style={styles.image} />
        </View>
        <View style={styles.heightAdjustment} />
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
  heightAdjustment: { height: 38 },
  column: { flexDirection: "column", alignItems: "center", top: -110 },
  button: {
    backgroundColor: "#f4e24d",
    borderRadius: 20,
    width: 75,
    height: 50,
    marginTop: 60,
    marginRight: 20,
    alignSelf: "flex-end",
    alignItems: "center",
    justifyContent: "center",
    elevation: 5, // For shadow on Android
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  text: {
    color: "white",
    fontSize: 20,
    alignSelf: "center",
    fontWeight: "700",
    letterSpacing: 2,
  },
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
    flex: 1,
    width: "100%",
    position: "absolute",
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
