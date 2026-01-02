import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";

export default function Navigation({ navigation, activeTab }) {
  // 탭 메뉴 설정 (이름, 아이콘, 이동할 라우트명)
  const tabs = [
    {
      name: "home",
      label: "홈",
      route: "HomeIndex",
      iconType: "Ionicons",
      icon: "home-outline",
      activeIcon: "home",
    },
    {
      name: "category",
      label: "카테고리",
      route: "Category",
      iconType: "Feather",
      icon: "menu",
      activeIcon: "menu",
    },
    {
      name: "discover",
      label: "발견",
      route: "Discover",
      iconType: "MaterialCommunityIcons",
      icon: "compass-outline",
      activeIcon: "compass",
    },
    {
      name: "store",
      label: "올영매장",
      route: "Store",
      iconType: "Ionicons",
      icon: "location-outline",
      activeIcon: "location",
    },
    {
      name: "likes",
      label: "좋아요",
      route: "Likes",
      iconType: "Ionicons",
      icon: "heart-outline",
      activeIcon: "heart",
    },
    {
      name: "mypage",
      label: "마이",
      route: "MyPage",
      iconType: "Ionicons",
      icon: "person-outline",
      activeIcon: "person",
    },
  ];

  const handlePress = (route) => {
    // 해당 페이지로 이동
    // (아직 안 만든 페이지는 에러 방지를 위해 체크하거나 임시 처리 가능)
    if (route) {
      navigation.navigate(route);
    }
  };

  const renderIcon = (tab, isActive) => {
    const color = isActive ? "#000" : "#999";
    const iconName = isActive && tab.activeIcon ? tab.activeIcon : tab.icon;
    const size = 24;

    if (tab.iconType === "Feather") {
      return <Feather name={iconName} size={size} color={color} />;
    } else if (tab.iconType === "MaterialCommunityIcons") {
      return (
        <MaterialCommunityIcons name={iconName} size={size} color={color} />
      );
    } else {
      return <Ionicons name={iconName} size={size} color={color} />;
    }
  };

  return (
    <View style={styles.bottomNav}>
      {tabs.map((tab, index) => {
        const isActive = activeTab === tab.name;
        return (
          <TouchableOpacity
            key={index}
            style={styles.navItem}
            onPress={() => handlePress(tab.route)}
          >
            {renderIcon(tab, isActive)}
            <Text style={[styles.navText, isActive && styles.activeNavText]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
    position: "absolute",
    bottom: 0,
    width: "100%",
    paddingBottom: 20, // 아이폰 노치 영역 대응
    elevation: 10, // 안드로이드 그림자
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#fff", // 배경색 필수 (투명하면 내용 비침)
    // [필수] 화면 맨 위로 올리기 위한 설정
    elevation: 10, // 안드로이드 그림자 및 계층
    zIndex: 999, // iOS 및 웹 계층
  },
  navItem: {
    alignItems: "center",
    flex: 1,
    paddingTop: 4,
  },
  navText: {
    fontSize: 9, // 메뉴가 6개라 폰트를 살짝 줄임
    marginTop: 4,
    color: "#999",
  },
  activeNavText: {
    color: "#000",
    fontWeight: "bold",
  },
});
