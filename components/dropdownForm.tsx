import { Dimensions, View, StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useImperativeHandle,
} from "react";

const { height: SCREENHEIGHT } = Dimensions.get("screen");

const MAX_TRANSLATE_Y = SCREENHEIGHT - 50;

type BottomeSheetProps = {
  children?: React.ReactNode;
  onToggle?: () => void;
  activateFormTouch?: boolean;
  setActivateFormTouch?: Dispatch<SetStateAction<boolean>>;
};
export type BottomSheetRefProps = {
  scrollTo: (destination: number) => void;
  isActive: () => boolean;
};

const DropdownForm = React.forwardRef<BottomSheetRefProps, BottomeSheetProps>(
  ({ children, onToggle, activateFormTouch, setActivateFormTouch }, ref) => {
    const translateY = useSharedValue(SCREENHEIGHT);
    const active = useSharedValue(false);

    const scrollTo = useCallback((destination: number) => {
      "worklet";

      active.value = Math.abs(destination) > 0;

      translateY.value = withSpring(destination, { damping: 500 });
    }, []);

    const isActive = useCallback(() => {
      return active.value;
    }, []);

    useImperativeHandle(ref, () => ({ scrollTo, isActive }), [
      scrollTo,
      isActive,
    ]);

    const context = useSharedValue({ y: SCREENHEIGHT });
    const gesture = Gesture.Pan()
      .onStart(() => {
        context.value = { y: translateY.value };
      })
      .onUpdate((event) => {
        translateY.value = event.translationY + context.value.y;
        translateY.value = Math.min(translateY.value, MAX_TRANSLATE_Y);
      })
      .onEnd(() => {
        if (translateY.value > SCREENHEIGHT * 0.8) {
          scrollTo(SCREENHEIGHT - 50);
        } else {
          scrollTo(0);
          runOnJS(setActivateFormTouch)(false);
          //onToggle();
        }
      });

    const rBottomSheetStyle = useAnimatedStyle(() => {
      const borderRadius = interpolate(
        translateY.value,
        [MAX_TRANSLATE_Y - 50, MAX_TRANSLATE_Y],
        [25, 20]
      );
      return {
        borderRadius,
        transform: [{ translateY: translateY.value }],
      };
    });

    return activateFormTouch ? (
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.bottomSheetContainer, rBottomSheetStyle]}>
          <View style={{ flex: 1, borderRadius: 35 }}>
            <View style={styles.container}>{children}</View>
            <View style={styles.line}></View>
          </View>
        </Animated.View>
      </GestureDetector>
    ) : (
      <View />
    );
  }
);

export default DropdownForm;

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center" },
  bottomSheetContainer: {
    flex: 1,
    height: SCREENHEIGHT,
    width: "100%",
    backgroundColor: "white",
    position: "absolute",
    bottom: SCREENHEIGHT,
    zIndex: 2,
  },
  line: {
    width: 75,
    height: 4,
    backgroundColor: "grey",
    alignSelf: "center",
    borderRadius: 2,
    bottom: 15,
  },
});
