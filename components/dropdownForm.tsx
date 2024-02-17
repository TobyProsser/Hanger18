import { Dimensions, View, StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import React, { useCallback, useEffect, useImperativeHandle } from "react";

const { height: SCREENHEIGHT } = Dimensions.get("screen");

const MAX_TRANSLATE_Y = SCREENHEIGHT - 50;

type BottomeSheetProps = {
  children?: React.ReactNode;
};
export type BottomSheetRefProps = {
  scrollTo: (destination: number) => void;
  isActive: () => boolean;
};

const DropdownForm = React.forwardRef<BottomSheetRefProps, BottomeSheetProps>(
  ({ children }, ref) => {
    const translateY = useSharedValue(SCREENHEIGHT);
    const active = useSharedValue(false);

    const scrollTo = useCallback((destination: number) => {
      "worklet";

      //CHANGE TO SCREEN HEIGHT
      active.value = Math.abs(destination) > 0;
      console.log(destination + " " + active.value);

      translateY.value = withSpring(destination, { damping: 50 });
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
        console.log(event.translationY);

        translateY.value = event.translationY + context.value.y;
        translateY.value = Math.min(translateY.value, MAX_TRANSLATE_Y);
      })
      .onEnd(() => {
        if (translateY.value > SCREENHEIGHT * 0.8) {
          console.log("fired");
          scrollTo(SCREENHEIGHT - 50);
        } else if (translateY.value < SCREENHEIGHT * 0.6) {
          scrollTo(0);
        }
      });

    const rBottomSheetStyle = useAnimatedStyle(() => {
      const borderRadius = interpolate(
        translateY.value,
        [MAX_TRANSLATE_Y - 50, MAX_TRANSLATE_Y],
        [25, 5],
        Extrapolate.CLAMP
      );
      return {
        borderRadius,
        transform: [{ translateY: translateY.value }],
      };
    });

    return (
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.bottomSheetContainer, rBottomSheetStyle]}>
          <View style={[styles.line]}></View>
          {children}
        </Animated.View>
      </GestureDetector>
    );
  }
);

export default DropdownForm;

const styles = StyleSheet.create({
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
    marginVertical: SCREENHEIGHT - 15,
    borderRadius: 2,
  },
});
