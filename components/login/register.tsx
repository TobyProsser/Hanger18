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

const profileImage =
  "https://simplyilm.com/wp-content/uploads/2017/08/temporary-profile-placeholder-1.jpg";

export const Register = () => {
  const [name, setName] = useState<string | undefined>();
  const [email, setEmail] = useState<string | undefined>();
  const [password, setPassword] = useState<string | undefined>();
  const [profileImageUri, setProfileImageUri] = useState<string | undefined>();

  const nav = useNavigation<NativeStackNavigationProp<any>>();

  const createProfile = async (response: any) => {
    db().ref(`/users/${response.user.uid}`).set({ name });
    db()
      .ref(`/users/${response.user.uid}/profileImage`)
      .set({ profileImageUri });
    db().ref(`/users/${response.user.uid}/leaderboard`).set({ totalScore: 0 });
  };

  const saveClimb = async (
    grade: number,
    color: string,
    imageUri: string,
    key: string,
    currentUser: string
  ) => {
    const sessionId = Date.now();

    await db()
      .ref(`/users/${currentUser}/sessions/${sessionId + currentUser}`)
      .set({
        grade,
        color,
        imageUri,
        key: sessionId + currentUser,
        date: sessionId,
      });
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
          const currentUser = auth().currentUser;

          //Save an empty climb, this acts as the adding button at the end of the climbs list
          if (currentUser) {
            await saveClimb(0, "null", "null", "Adder", currentUser.uid);
          }
          nav.replace("Home");
        }
      } catch (e) {
        Alert.alert(e.nativeErrorMessage);
      }
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImageUri(result.assets[0].uri);
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
              placeholder="Name"
              value={name}
              onChangeText={setName}
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
