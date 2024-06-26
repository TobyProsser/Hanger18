import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Keyboard,
  Alert,
  Image,
} from "react-native";
import { CTAButton } from "../elements/ctabutton";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as ImagePicker from "expo-image-picker";

import auth from "@react-native-firebase/auth";
import db from "@react-native-firebase/database";
import firebase from "../data/firebase";

import businessLocations from "../data/climbgymlocations";

const profileImage =
  "https://simplyilm.com/wp-content/uploads/2017/08/temporary-profile-placeholder-1.jpg";

export const Register = () => {
  const [name, setName] = useState<string | undefined>();
  const [email, setEmail] = useState<string | undefined>();
  const [password, setPassword] = useState<string | undefined>();
  const [profileImageUri, setProfileImageUri] = useState<string | undefined>();

  const nav = useNavigation<NativeStackNavigationProp<any>>();

  const UploadToStorageReturnUrl = async (uri: string): Promise<string> => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();

      const currentUser = await auth().currentUser;

      const ref = firebase
        .storage()
        .ref()
        .child(
          `images/${currentUser.uid}/profilePic/${
            currentUser.uid + Date.now()
          }.jpg`
        );
      const snapshot = await ref.put(blob);

      // Get the download URL for the uploaded image
      const downloadURL = await snapshot.ref.getDownloadURL();
      console.log("Image download URL:", downloadURL);

      return downloadURL;
    } catch (error) {
      console.error("Error uploading image to Firebase storage:", error);
      throw error;
    }
  };

  const createProfile = async (response: any) => {
    db()
      .ref(`/users/${response.user.uid}`)
      .set({ name: name, profileImage: profileImageUri, admin: false });
    console.log("set name: " + name + ", set Image: " + profileImageUri);
    for (const gym of businessLocations) {
      db()
        .ref(`/users/${response.user.uid}/${gym.name}`)
        .set({ totalScore: 0, allGrades: "", lbIndex: 0, climbsAmount: 0 });

      console.log("gym name: " + gym.name);
    }
  };

  const saveClimb = async (
    grade: number,
    color: string,
    imageUri: string,
    key: string,
    currentUser: string
  ) => {
    const sessionId = Date.now();

    for (const gym of businessLocations) {
      try {
        await db()
          .ref(
            `/users/${currentUser}/${gym.name}/sessions/${
              sessionId + currentUser
            }`
          )
          .set({
            grade,
            color,
            imageUri,
            key: sessionId + currentUser,
            date: sessionId,
            climbingGym: gym.name,
          });
        console.log("Data successfully set in Firebase.");
      } catch (error) {
        console.error("Error setting data in Firebase:", error);
      }
    }
  };

  const registerAndGoToMainFlow = async () => {
    if (email && password) {
      try {
        const response = await auth().createUserWithEmailAndPassword(
          email,
          password
        );
        if (response.user) {
          await createProfile(response);
          const currentUser = await auth().currentUser;
          console.log("currwnt user: " + currentUser.uid);
          //Save an empty climb, this acts as the adding button at the end of the climbs list
          if (currentUser) {
            await saveClimb(0, "null", "null", "Adder", currentUser.uid);
            const imageUrl = await UploadToStorageReturnUrl(profileImageUri);
            db()
              .ref(`/users/${response.user.uid}`)
              .update({ profileImage: imageUrl });
          }
          nav.replace("Home");
        }
      } catch (e) {
        Alert.alert(e.nativeErrorMessage);
        console.log(e.error);
      }
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;

      setProfileImageUri(uri);
    }
  };

  return (
    <Pressable style={styles.contentView} onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.contentView}>
        <View style={styles.container}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Register</Text>
          </View>
          <View style={styles.mainContent}>
            <TextInput
              style={styles.loginTextField}
              placeholder="Display Name"
              value={name}
              onChangeText={setName}
              maxLength={11}
            />
            <TextInput
              style={styles.loginTextField}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              inputMode="email"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.loginTextField}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <View
              style={styles.profileImageContainer}
              onTouchEnd={() => pickImage()}
            >
              <Image
                source={{
                  uri: profileImageUri ? profileImageUri : profileImage,
                }}
                style={styles.image}
              />
            </View>
          </View>
          <CTAButton
            title="Sign Up"
            onPress={registerAndGoToMainFlow}
            variant="primary"
          />
          <CTAButton title="Go Back" onPress={nav.goBack} variant="secondary" />
        </View>
      </SafeAreaView>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  contentView: {
    flex: 1,
    backgroundColor: "white",
  },
  container: {
    flex: 1,
    marginHorizontal: 50,
    backgroundColor: "white",
    paddingTop: 20,
  },
  titleContainer: {
    flex: 1.2,
    justifyContent: "center",
  },
  titleText: {
    fontSize: 45,
    textAlign: "center",
    fontWeight: "200",
  },
  loginTextField: {
    borderBottomWidth: 1,
    height: 60,
    fontSize: 30,
    marginVertical: 10,
    fontWeight: "300",
  },
  mainContent: {
    flex: 6,
  },
  profileImageContainer: {
    alignSelf: "center",
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
});
