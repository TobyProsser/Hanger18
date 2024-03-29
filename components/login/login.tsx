import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  TextInput,
  Text,
  Pressable,
  Keyboard,
  Alert,
  Image,
} from "react-native";
import { CTAButton } from "../elements/ctabutton";

import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import auth from "@react-native-firebase/auth";

const logo =
  "https://climbhangar18.com/wp-content/uploads/2020/06/hangar-4-color-logo.png";

export const Login = () => {
  const [email, setEmail] = useState<string | undefined>();
  const [password, setPassword] = useState<string | undefined>();

  const nav = useNavigation<NativeStackNavigationProp<any>>();

  const goToRegistration = () => {
    nav.push("Register");
  };

  const goToMainFlow = async () => {
    if (email && password) {
      try {
        const response = await auth().signInWithEmailAndPassword(
          email,
          password
        );

        if (response.user) {
          nav.replace("Home");
        }
      } catch (e) {
        Alert.alert(e.nativeErrorMessage);
      }
    }
  };

  return (
    <Pressable style={styles.contentView} onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.contentView}>
        <View style={styles.container}>
          <View style={styles.titleContainer}>
            {/*<Image source={{ uri: logo }} style={StyleSheet.absoluteFill} />*/}
            <Image
              style={{
                backgroundColor: "#6aafdf",
                width: 150,
                height: 150,
                borderRadius: 50,
                top: 20,
                alignSelf: "center",
              }}
              source={require("../../assets/climbingLogo.png")}
            />
            <Text style={[{ top: 30 }, styles.titleText]}>Climber</Text>
          </View>
          <View style={styles.mainContent} />
          <View style={styles.bottomAdjustment}>
            <TextInput
              style={styles.loginTextField}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              inputMode="email"
            />
            <TextInput
              style={styles.loginTextField}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
          <CTAButton title="Login" onPress={goToMainFlow} variant="primary" />
          <CTAButton
            title="Sign Up"
            onPress={goToRegistration}
            variant="secondary"
          />
        </View>
      </SafeAreaView>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  bottomAdjustment: { bottom: 250 },
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
    height: 150,
    width: 300,
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
});
