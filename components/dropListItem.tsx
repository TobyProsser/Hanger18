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
import { Dispatch, SetStateAction, useEffect, useState } from "react";

type DropListItemType = {
  label: string;
};

type DropListItemProps = DropListItemType & {
  index: number;
  dropdownItemsCount: number;
  isExpanded: Animated.SharedValue<boolean>;
  setGrade: Dispatch<SetStateAction<number>>;
  grade: number;
  secondRow: boolean;
};

const DropListItem: React.FC<DropListItemProps> = ({
  label,
  index,
  dropdownItemsCount,
  isExpanded,
  grade,
  secondRow,
  setGrade,
}) => {
  const { width: windowWidth } = useWindowDimensions();
  const [gradeSet, setGradeSet] = useState(false);
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

  //If grade has data, set gradeSet? true
  useEffect(() => {
    if(grade != -1)
    {
      setGradeSet(true);
      console.log("The grade has been set ")
    }
  }, [grade])
  
  const isHeader = index === 0;

  return (
    <Animated.View
      onTouchEnd={() => {
        //If grade is set, dont allow user to click on button
        if(!gradeSet)
        {
          if (label === "V7") {
            setGrade(7);
          } else {
            secondRow ? setGrade(index + 7) : setGrade(index - 1);
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
