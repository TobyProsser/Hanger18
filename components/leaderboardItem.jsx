import React from "react";

const SPACING = 5;
const AVATAR_SIZE = 70;

export default LeadboardItem = () => {
  <Animated.View
    style={{
      flexDirection: "row",
      flex: 1,
      padding: SPACING,
      marginBottom: SPACING,
      borderRadius: 18,
      backgroundColor: "#6aafdf",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.15,
      shadowRadius: 2,
      opacity,
      //transform:[{scale}]
    }}
  >
    <Image
      source={{ uri: item.image }}
      style={{
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
        borderRadius: AVATAR_SIZE,
        marginRight: SPACING / 2,
      }}
    />
    <View>
      <Text style={{ fontSize: 22, fontWeight: "700" }}>{item.name}</Text>
      <Text style={{ fontSize: 22, opacity: 0.7 }}>{item.jobTitle}</Text>
      <Text style={{ fontSize: 22, opacity: 0.8, color: "#0099cc" }}>
        {item.email}
      </Text>
    </View>
  </Animated.View>;
};

const styles = StyleSheet.create({
  rowStyle: {
    left: -30,
    width: 125,
    height: 40,
    flexDirection: "row",
    alignSelf: "center",
  },
});
