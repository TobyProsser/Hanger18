import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Profile from "./components/profile";
import LeaderboardList from "./components/leaderboardList";
import DropdownForm, { BottomSheetRefProps } from "./components/dropdownForm";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useCallback, useRef, useState, useEffect } from "react";
import DropdownContent from "./components/dropdownContent";
import Dropdown from "./components/dropList";
import Animated, { useSharedValue } from "react-native-reanimated";

const { height: SCREENHEIGHT } = Dimensions.get("screen");
const logo =
  "https://climbhangar18.com/wp-content/uploads/2020/06/hangar-4-color-logo.png";

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

  useEffect(() => {
    console.log("ActiveTouch: " + activateFormTouch);
  }, [activateFormTouch]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Image
          source={{ uri: logo }}
          style={StyleSheet.absoluteFillObject}
          blurRadius={20}
        />
        <View
          style={{
            flex: 1,
            width: "100%",
            flexDirection: "column",
            backgroundColor: "#2a3641",
            gap: -30,
          }}
        >
          <Profile onPress={onPress} />

          <LeaderboardList />
          <DropdownForm
            ref={ref}
            onToggle={() => toggleActivateFormTouch}
            activateFormTouch={activateFormTouch}
          >
            <View style={{ top: 225 }}>
              <DropdownContent />
            </View>
          </DropdownForm>
        </View>

        <StatusBar style="auto" />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
