import { StyleSheet, View, Image, Dimensions } from "react-native";
import Profile from "./profile";
import LeaderboardList from "../leaderboardList";
import DropdownForm, { BottomSheetRefProps } from "../dropdownForm";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useContext,
  createContext,
} from "react";
import DropdownContent from "../dropdownContent";
import DropdownLocation from "../dropListLocation";
import businessLocations from "../data/climbgymlocations";
import { runOnJS, useSharedValue } from "react-native-reanimated";
import { LocationContext } from "../context/locationcontext";
import externalStyles from "../styles/styles";
const { height: SCREENHEIGHT } = Dimensions.get("screen");
const logo =
  "https://climbhangar18.com/wp-content/uploads/2020/06/hangar-4-color-logo.png";

// Create options dynamically based on businessLocations
const options = businessLocations.map((location) => ({
  label: location.name,
}));

export default function HomeScreen() {
  const ref = useRef<BottomSheetRefProps>();

  const isLocationExpanded = useSharedValue(false);
  const [activateFormTouch, setActivateFormTouch] = useState(false);
  const [currentUser, setCurrentUser] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<string>(
    options[0].label
  );

  const [sessionScrollTo, setSessionScrollTo] = useState(0);
  const [lbScrollTo, setLBScrollTo] = useState(0);
  const [header, setHeader] = useState({ label: options[0].label });

  useEffect(() => {
    setHeader({ label: selectedLocation });
  }, [selectedLocation]);

  const toggleActivateFormTouch = useCallback(() => {
    "worklet";
    runOnJS(setActivateFormTouch)(
      (prevActivateFormTouch) => !prevActivateFormTouch
    );
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
    <LocationContext.Provider
      value={{
        sessionScrollTo,
        setSessionScrollTo,
        lbScrollTo,
        setLBScrollTo,
        selectedLocation,
        setSelectedLocation,
      }}
    >
      <GestureHandlerRootView style={styles.container}>
        <View style={[styles.wrapper, externalStyles.secondColor]}>
          <Profile onPress={onPress} />
          <LeaderboardList onPress={onPress} lbScrollTo={lbScrollTo} />
          <DropdownForm
            ref={ref}
            onToggle={() => toggleActivateFormTouch}
            setActivateFormTouch={setActivateFormTouch}
            activateFormTouch={activateFormTouch}
          >
            <View style={styles.topAdjustment}>
              <DropdownContent currentUser={currentUser} />
            </View>
          </DropdownForm>
          <View
            style={{
              position: "absolute",
              top: 396 + 20,
              right: 20,
              height: 50,
              width: 175,
              borderRadius: 20,
              backgroundColor: "blue",
              alignSelf: "flex-end",
              zIndex: 1.5,
            }}
          >
            <DropdownLocation
              header={header}
              options={options}
              isExpanded={isLocationExpanded}
              selectedLocation={selectedLocation}
              setSelectedLocation={setSelectedLocation}
            />
          </View>
        </View>
      </GestureHandlerRootView>
    </LocationContext.Provider>
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

    gap: -30,
  },
  topAdjustment: { top: 225 },
});
