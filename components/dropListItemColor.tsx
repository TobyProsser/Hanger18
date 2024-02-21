import { View, useWindowDimensions, StyleSheet, Text } from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  useAnimatedReaction,
} from "react-native-reanimated";
import Color from "color";

type DropListItemType = {
  label: string;
};

type DropListItemProps = DropListItemType & {
  index: number;
  dropdownItemsCount: number;
  isExpanded: Animated.SharedValue<boolean>;
};

const ColorDropListItem: React.FC<DropListItemProps> = ({
  label,
  index,
  dropdownItemsCount,
  isExpanded,
}) => {
  const { width: windowWidth } = useWindowDimensions();
  const DropListItemHeight = 50;
  const DropListItemWidth = 100;
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
      top: withSpring(isExpanded.value ? expandedTop : collapsedTop),
      transform: [
        {
          scale: withSpring(isExpanded.value ? expandedScale : collapsedScale),
        },
        { translateY: fUllDropdiownHeight / 2 },
      ],
    };
  }, []);

  const isHeader = index === 0;

  return (
    <Animated.View
      onTouchEnd={() => {
        if (isHeader) {
          isExpanded.value = !isExpanded.value;
        }
      }}
      style={[
        {
          zIndex: dropdownItemsCount - index,
          position: "absolute",
          width: DropListItemWidth,
          height: DropListItemHeight,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 25,
        },
        rStyle,
      ]}
    >
      <View
        style={{
          width: 80,
          height: 30,
          borderRadius: 25,
          backgroundColor: "#282424",
          alignItems: "center",
          justifyContent: "center",
          alignSelf: "center",
        }}
      >
        <View
          style={{
            width: 75,
            height: 25,
            borderRadius: 25,
            backgroundColor: "#F81C1C",
          }}
        />
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

export { ColorDropListItem };

export type { DropListItemType };
