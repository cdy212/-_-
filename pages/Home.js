import React, { useState, useEffect } from "react";
import { Text, View } from "react-native";

export default function Homepage() {
  return (
    <View
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      onLayout={onLayoutRootView}
    >
      <Text>Homepage Demo! 👋</Text>
      <Entypo name="rocket" size={30} />
    </View>
  );
}
