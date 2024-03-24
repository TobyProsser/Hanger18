import { View, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import Color from "color";
import { Dispatch, SetStateAction } from "react";

type DropListItemColorType = {
  label: string;
};

type DropListItemColorProps = DropListItemColorType & {
  index: number;
  dropdownItemsCount: number;
  isExpanded: Animated.SharedValue<boolean>;
  color: Dispatch<SetStateAction<string>>;
  getColor: string;
  secondRow: boolean;
  submitted: boolean;
};

const ColorDropListItem: React.FC<DropListItemColorProps> = ({
  index,
  dropdownItemsCount,
  isExpanded,
  color,
  getColor,
  secondRow,
  submitted,
}) => {
  const DropListItemHeight = 50;
  const DropListItemWidth = 100;
  const Margin = 2;

  const collapsedTop = 0;
  const expandedTop = (DropListItemHeight + Margin) * index;

  const expandedScale = 1;
  const collapsedScale = 1;

  const expandedBackgroundColor = "#1B1B1B";
  const colapsedBackgroundColor = Color(expandedBackgroundColor)
    .lighten(index * 0.25)
    .hex();

  type AnimatedStyle = {
    backgroundColor: string;
    top: number;
    transform: { scale: number }[];
  };

  const returnColorString = (index: number) => {
    if (submitted) {
      return getColor;
    }
    switch (index) {
      case 0:
        return getColor;
      case 1:
        return "blue";
      case 2:
        return "purple";
      case 3:
        return "yellow";
      case 4:
        return "grey";
      case 5:
        return "green";
      case 6:
        return "red";
      case 7:
        return "orange";
      case 8:
        return "black";
      case 9:
        return "teal";
      case 10:
        return "brown";
    }
  };
  const rStyle = useAnimatedStyle<AnimatedStyle>(() => {
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
        //If the color has been set, dont allow the user to click on the color drop down
        if (!submitted) {
          if (!isHeader) {
            secondRow
              ? color(returnColorString(index + 6))
              : color(returnColorString(index));
          } else {
            if (secondRow) {
              color(returnColorString(index + 6));
            }
          }

          isExpanded.value = !isExpanded.value;
        }
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
      <View style={styles.innerOval}>
        <Animated.View
          style={[
            styles.innerAnimatedView,
            {
              backgroundColor:
                index == 0 && !secondRow
                  ? getColor
                  : secondRow
                  ? returnColorString(index + 6)
                  : returnColorString(index),
            },
          ]}
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  innerAnimatedView: {
    width: 75,
    height: 25,
    borderRadius: 25,
  },
  innerOval: {
    width: 80,
    height: 30,
    borderRadius: 25,
    backgroundColor: "#412A2A",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  animatedView: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 25,
  },
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

export type { DropListItemColorType };
