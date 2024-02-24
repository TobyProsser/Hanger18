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
  AnimatedStyle,
  SharedValue,
} from "react-native-reanimated";
import Color from "color";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

type DropListItemColorType = {
  label: string;
};

type DropListItemColorProps = DropListItemColorType & {
  index: number;
  dropdownItemsCount: number;
  isExpanded: Animated.SharedValue<boolean>;
  color: Dispatch<SetStateAction<string>>;
  getColor: string;
};

const ColorDropListItem: React.FC<DropListItemColorProps> = ({
  label,
  index,
  dropdownItemsCount,
  isExpanded,
  color,
  getColor,
}) => {
  const { width: windowWidth } = useWindowDimensions();
  const DropListItemHeight = 50;
  const DropListItemWidth = 100;
  const Margin = 2;

  const selectedColor = useSharedValue("red");
  const [colorSet, setColorSet] = useState(false);

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

  useEffect(() => {
    setColorSet(getColor != 'null');
  }, []);

  type AnimatedStyle = {
    backgroundColor: string;
    top: number;
    transform: { scale: number }[];
  };

  const returnColorString = (index: number) => {
    if(colorSet)
    {
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
        if(!colorSet)
        {
          if (!isHeader) {
            color(returnColorString(index));
            console.log(getColor);
          }
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
        <Animated.View
          style={{
            width: 75,
            height: 25,
            borderRadius: 25,
            backgroundColor: index == 0 ? getColor : returnColorString(index),
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

export type { DropListItemColorType };
