import { View, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import Color from "color";
import { Dispatch, SetStateAction, useEffect } from "react";

type DropListItemColorType = {
  label: string;
};

type DropListItemColorProps = DropListItemColorType & {
  index: number;
  dropdownItemsCount: number;
  isExpanded: boolean;
  setIsExpanded: Dispatch<SetStateAction<boolean>>;
  color: Dispatch<SetStateAction<string>>;
  getColor: string;
  secondRow: boolean;
  submitted: boolean;
};

const ColorDropListItem: React.FC<DropListItemColorProps> = ({
  index,
  dropdownItemsCount,
  isExpanded,
  setIsExpanded,
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

  const expand = useSharedValue(false);
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
  useEffect(() => {
    expand.value = isExpanded;
  }, [isExpanded]);

  const rStyle = useAnimatedStyle<AnimatedStyle>(() => {
    return {
      backgroundColor: withTiming(
        expand.value ? expandedBackgroundColor : colapsedBackgroundColor
      ),
      top: withSpring(expand.value ? expandedTop : collapsedTop, {
        damping: 13,
      }),
      transform: [
        {
          scale: withSpring(expand.value ? expandedScale : collapsedScale),
        },
      ],
    };
  }, []);

  const isHeader = index === 0;

  return (
    <View>
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
            setIsExpanded(!isExpanded);
          }
        }}
        style={[
          styles.animatedView,
          {
            zIndex: dropdownItemsCount - index,
            width: DropListItemWidth,
            height: DropListItemHeight,
            shadowColor: "#FFFFFF", // White shadow color
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.25,
            shadowRadius: 6,
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
                  (index == 0 || index == 5) && !secondRow
                    ? getColor
                    : secondRow
                    ? returnColorString(index + 6)
                    : returnColorString(index),
              },
            ]}
          />
        </View>
      </Animated.View>
    </View>
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
