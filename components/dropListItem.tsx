import {
  View,
  useWindowDimensions,
  StyleSheet,
  Text,
  Alert,
} from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  useAnimatedReaction,
  SharedValue,
} from "react-native-reanimated";
import Color from "color";
import { Dispatch, SetStateAction } from "react";

type DropListItemType = {
  label: string;
};

type DropListItemProps = DropListItemType & {
  index: number;
  dropdownItemsCount: number;
  isExpanded: Animated.SharedValue<boolean>;
  grade: Dispatch<SetStateAction<number>>;
  secondRow: boolean;
};

const DropListItem: React.FC<DropListItemProps> = ({
  label,
  index,
  dropdownItemsCount,
  isExpanded,
  grade,
  secondRow,
}) => {
  const { width: windowWidth } = useWindowDimensions();
  const DropListItemHeight = 30;
  const DropListItemWidth = 75;
  const Margin = 2;

  const fUllDropdiownHeight =
    dropdownItemsCount * (DropListItemHeight + Margin);

  const collapsedTop = 0;
  const expandedTop = (DropListItemHeight + Margin) * index;

  const expandedScale = 1;
  const collapsedScale = 1;

  const expandedBackgroundColor = "#1B1B1B";
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

  const isHeader = index === 0;

  return (
    <Animated.View
      onTouchEnd={() => {
        if (label === "V7") {
          grade(7);
        } else {
          secondRow ? grade(index + 7) : grade(index - 1);
        }
        isExpanded.value = !isExpanded.value;
      }}
      style={[
        {
          zIndex: dropdownItemsCount - index,
          position: "absolute",
          width: DropListItemWidth,
          height: DropListItemHeight,
          borderRadius: 10,
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
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    color: "#D4D4D4",
    fontSize: 22,
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
});

export { DropListItem };

export type { DropListItemType };
