import React, {
  useEffect,
  useState,
  useContext,
  Dispatch,
  SetStateAction,
} from "react";
import { StyleSheet, Text, View, Image, Dimensions, Alert } from "react-native";
import auth from "@react-native-firebase/auth";
import db from "@react-native-firebase/database";
import { useLocationContext } from "../context/locationcontext";
import externalStyles from "../styles/styles";

//import LocationContext from "../context/locationcontext";

const { width: SCREENWIDTH } = Dimensions.get("screen");

const logo =
  "https://climbhangar18.com/wp-content/uploads/2020/06/hangar-4-color-logo.png";

interface IProfileProps {
  onPress: (currentUser) => void;
  setActivateFormTouch?: Dispatch<SetStateAction<boolean>>;
}
const Profile = (prop: IProfileProps) => {
  const [name, setName] = useState("null");
  const [profileImage, setProfileImage] = useState("null");
  const [lbIndex, setLBIndex] = useState(0);
  const [climbsAmount, setClimbsAmount] = useState(0);
  const [admin, setAdmin] = useState(false);

  const { selectedLocation, setSessionScrollTo } = useLocationContext();

  const getUsersName = async () => {
    const currentUser = await auth().currentUser;
    if (currentUser) {
      db()
        .ref(`/users/${currentUser.uid}`)
        .once("value", (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const profileImage = data.profileImage;
            setProfileImage(profileImage);
            const name = data.name;
            setName(name);
            const admin = data.admin;
            setAdmin(admin);
          }
        });

      db()
        .ref(`/users/${currentUser.uid}/${selectedLocation}`)
        .on("value", (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const templbIndex = data.lbIndex;
            const tempClimbsAmount = data.climbsAmount;
            setClimbsAmount(tempClimbsAmount);
            setLBIndex(templbIndex);
          } else {
            console.log("The lbIndex path does not exist.");
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
        db().ref(`/users/${currentUser.uid}/${selectedLocation}`).off();
      }
    };
  }, [selectedLocation]);

  const handleClick = async () => {
    const currentUser = await auth().currentUser;
    if (currentUser) {
      prop.onPress(currentUser.uid);
    }
  };

  const confirmDeletion = () => {
    Alert.alert("Are you Sure?", "THIS ACTION CANNOT BE UNDONE", [
      { text: "No", onPress: () => console.log("No Pressed") },
      {
        text: "Yes",
        onPress: () => {
          adminFunctionToDeleteEveryUsersData();
        },
      },
    ]);
  };
  const adminFunctionToDeleteEveryUsersData = () => {
    const users = db().ref("/users");
    users
      .once("value")
      .then((snapshot) => {
        const usersDataObject = snapshot.val(); // Get the data as an object
        const userKeys = Object.keys(usersDataObject); // Extract keys (item names)
        console.log("Item keys:", userKeys);

        deleteAllFilesInFolder(userKeys);
      })
      .catch((error) => {
        console.error("Error retrieving data:", error);
      });
  };

  const deleteAllFilesInFolder = async (userKeys) => {
    try {
      let index = 0;
      for (const user of userKeys) {
        const sessions = await db().ref(
          `/users/${user}/${selectedLocation}/sessions`
        );
        sessions
          .once("value")
          .then((snapshot) => {
            const sessionsDataObject = snapshot.val(); // Get the data as an object
            const sessionKeys = Object.keys(sessionsDataObject);
            deleteSessions(user, sessionKeys);
          })
          .catch((error) => {
            console.error("Error retrieving data:", error);
          });
      }
    } catch (error) {
      console.error("Error deleting files:", error);
    }
  };

  const deleteSessions = async (user, sessionKeys) => {
    try {
      for (const session of sessionKeys) {
        const sessionRef = db().ref(
          `users/${user}/${selectedLocation}/sessions/${session}`
        );
        const snapshot = await sessionRef.once("value");
        const data = snapshot.val();
        if (data) {
          const imageUri = data.imageUri;
          console.log("Image URI: " + imageUri);
          if (imageUri != "null") {
            sessionRef.remove();
            console.log(`File ${sessionRef} deleted successfully.`);
          }
        }
      }
    } catch (error) {
      console.error("Error deleting files:", error);
    }
  };
  return (
    <View style={[styles.profileContainer, externalStyles.mainColor]}>
      <View style={{ justifyContent: "flex-end" }}>
        {admin ? (
          <View
            style={[
              styles.button,
              {
                backgroundColor: "red",
                position: "absolute",
                alignSelf: "center",
                alignItems: "center",
                top: 270,
                width: 250,
              },
            ]}
            onTouchEnd={() => {
              Alert.alert(
                "Delete Everyone's data",
                "Toby are you sure you want to delete everyones data?",
                [
                  { text: "No", onPress: () => console.log("No Pressed") },
                  {
                    text: "Yes",
                    onPress: () => {
                      confirmDeletion();
                    },
                  },
                ]
              );
            }}
          >
            <Text style={styles.text}>Delete Everything</Text>
          </View>
        ) : (
          <View />
        )}
      </View>
      <View
        style={{
          width: SCREENWIDTH,
        }}
      >
        <View
          style={[styles.button, externalStyles.thirdColor]}
          onTouchEnd={() => {
            handleClick();
            setSessionScrollTo(10);
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
        <Text style={styles.nameText}>{name}</Text>
        <View style={styles.line}></View>
        <View style={styles.rowStyle}>
          <Text style={styles.numbersText}>#{lbIndex + 1}</Text>
          <Text style={styles.numbersText}>{climbsAmount}/10</Text>
        </View>
        <Image
          style={{
            width: 75,
            height: 75,
            top: 20,
            alignSelf: "center",
          }}
          source={require("../../assets/climbingLogo.png")}
        />
        {/*<Image source={{ uri: logo }} style={styles.logoImage} />*/}
      </View>
    </View>
  );
};
export default Profile;

const styles = StyleSheet.create({
  heightAdjustment: { height: 38 },
  column: { flexDirection: "column", alignItems: "center", top: -110 },
  button: {
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
