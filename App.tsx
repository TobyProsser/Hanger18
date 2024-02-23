import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Profile from "./components/homescreen/profile";
import LeaderboardList from "./components/leaderboardList";
import DropdownForm, { BottomSheetRefProps } from "./components/dropdownForm";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useCallback, useRef, useState, useEffect } from "react";
import DropdownContent from "./components/dropdownContent";
import Dropdown from "./components/dropList";
import Animated, { useSharedValue } from "react-native-reanimated";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./components/homescreen/homeScreen";
import { Login } from "./components/login/login";
import { Register } from "./components/login/register";
import { LoadingScreen } from "./components/login/loadingScreen";
const { height: SCREENHEIGHT } = Dimensions.get("screen");
const logo =
  "https://climbhangar18.com/wp-content/uploads/2020/06/hangar-4-color-logo.png";

//APP ID: com.fathomcreative.hanger18
const Stack = createNativeStackNavigator();

export default function App() {
  const ref = useRef<BottomSheetRefProps>(null);

  const [activateFormTouch, setActivateFormTouch] = useState(false);
  const toggleActivateFormTouch = useCallback(() => {
    "worklet";

    setActivateFormTouch((prevActivateFormTouch) => !prevActivateFormTouch);
  }, []);

  var isActive;
  const onPress = useCallback(() => {
    isActive = ref?.current?.isActive();
    if (isActive) {
      ref?.current?.scrollTo(0);
      setActivateFormTouch(false);
    } else {
      ref?.current?.scrollTo(SCREENHEIGHT * 0.65);
      setActivateFormTouch(true);
    }
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="LoadingScreen"
          component={LoadingScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
