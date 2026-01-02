import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Header({
  title = "대만한인회",
  onSearchPress,
  onCartPress,
}) {
  return (
    <View style={styles.header}>
      {/* 로고 영역 */}
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>{title}</Text>
        <Ionicons name="chevron-down" size={20} color="black" />
      </View>

      {/* 우측 아이콘 영역 */}
      <View style={styles.headerIcons}>
        <TouchableOpacity style={styles.iconBtn} onPress={onSearchPress}>
          <Ionicons name="search" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn} onPress={onCartPress}>
          <Ionicons name="bag-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee", // 헤더 구분선 추가 (선택사항)
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoText: {
    fontSize: 20,
    fontWeight: "bold", // 글씨 굵게
    marginRight: 4,
  },
  headerIcons: {
    flexDirection: "row",
  },
  iconBtn: {
    marginLeft: 16,
  },
});
