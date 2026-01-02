import React, { useState, useEffect } from "react";
import { Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function Mypage() {
  const navigation = useNavigation();

  return (
    <View
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      //   onLayout={onLayoutRootView}
    >
      <Text onPress={() => navigation.navigate("IndexScreen")}>
        index callback!!!!
      </Text>
      <Text onPress={() => navigation.navigate("splash")}>
        splash callback!!!
      </Text>
      {/* <Entypo name="rocket" size={30} /> */}
    </View>
  );
}
