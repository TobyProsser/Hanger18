import { StyleSheet, View, Image, Dimensions } from "react-native";
import Profile from "./profile";
import LeaderboardList from "../leaderboardList";
import DropdownForm, { BottomSheetRefProps } from "../dropdownForm";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useCallback, useRef, useState } from "react";
import DropdownContent from "../dropdownContent";

const { height: SCREENHEIGHT } = Dimensions.get("screen");
const logo =
  "https://climbhangar18.com/wp-content/uploads/2020/06/hangar-4-color-logo.png";

export default function HomeScreen() {
  const ref = useRef<BottomSheetRefProps>();

  const [activateFormTouch, setActivateFormTouch] = useState(false);
  const [currentUser, setCurrentUser] = useState("");
  const toggleActivateFormTouch = useCallback(() => {
    "worklet";

    setActivateFormTouch((prevActivateFormTouch) => !prevActivateFormTouch);
  }, []);

  var isActive;
  const onPress = useCallback((currentUser: string) => {
    setCurrentUser(currentUser);
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
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.wrapper}>
        <Profile onPress={onPress} />
        <LeaderboardList onPress={onPress} />
        <DropdownForm
          ref={ref}
          onToggle={() => toggleActivateFormTouch}
          activateFormTouch={activateFormTouch}
        >
          <View style={styles.topAdjustment}>
            <DropdownContent currentUser={currentUser} />
          </View>
        </DropdownForm>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    flex: 1,
    width: "100%",
    flexDirection: "column",
    backgroundColor: "#2a3641",
    gap: -30,
  },
  topAdjustment: { top: 225 },
});
