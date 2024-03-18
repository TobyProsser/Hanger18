import { View, StyleSheet, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import Color from "color";
import { Dispatch, SetStateAction } from "react";

import businessLocations from "./data/climbgymlocations";

type DropListItemLocationType = {
  label: string;
};

type DropListItemLocationProps = DropListItemLocationType & {
  index: number;
  dropdownItemsCount: number;
  isExpanded: Animated.SharedValue<boolean>;

  selectedLocation: string;
  setSelectedLocation: Dispatch<SetStateAction<string>>;
};

const DropListItemLocation: React.FC<DropListItemLocationProps> = ({
  label,
  index,
  dropdownItemsCount,
  isExpanded,
  selectedLocation,
  setSelectedLocation,
}) => {
  const DropListItemHeight = 50;
  const DropListItemWidth = 175;
  const Margin = 2;

  const collapsedTop = 0;
  const expandedTop = (DropListItemHeight + Margin) * index;

  const expandedScale = 1;
  const collapsedScale = 1;

  const expandedBackgroundColor = "#6aafdf";
  const colapsedBackgroundColor = Color(expandedBackgroundColor)
    .lighten(index * 0.25)
    .hex();

  const rStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: withTiming(
        isExpanded.value ? expandedBackgroundColor : colapsedBackgroundColor
      ),
      top: withSpring(isExpanded.value ? expandedTop : collapsedTop, {
        damping: 13,
      }),
      transform: [
        {
          scale: withSpring(isExpanded.value ? expandedScale : collapsedScale),
        },
      ],
    };
  }, []);

  return (
    <Animated.View
      onTouchEnd={() => {
        isExpanded.value = !isExpanded.value;
        const names = businessLocations.map((location) => location.name);
        setSelectedLocation(names[index - 1]);
      }}
      style={[
        styles.animatedView,
        {
          zIndex: dropdownItemsCount - index,
          width: DropListItemWidth,
          height: DropListItemHeight,
        },
        rStyle,
      ]}
    >
      <View style={styles.container}>
        <Text style={styles.label}>{label}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  animatedView: {
    position: "absolute",
    borderRadius: 20,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    color: "white",
    fontSize: 22,
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
});

export { DropListItemLocation };

export type { DropListItemLocationType };
