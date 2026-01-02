import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, Feather } from "@expo/vector-icons";

// 탭 화면들
import HomeIndex from "../components/home/HomeIndex";
import CategoryIndex from "../components/category"; // 위에서 만든 파일
import Discover from "../components/discover"; // 지난번 만든 파일
import Store from "../components/store"; // 지난번 만든 파일
import MyPage from "../components/mypage";

const Tab = createBottomTabNavigator();

export default function MainTab() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#000",
        tabBarInactiveTintColor: "#999",
        tabBarStyle: { height: 60, paddingBottom: 5, borderTopColor: "#eee" },
        tabBarLabelStyle: { fontSize: 10, marginTop: -5 },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
            return <Ionicons name={iconName} size={24} color={color} />;
          } else if (route.name === "Category") {
            return <Ionicons name="menu" size={24} color={color} />;
          } else if (route.name === "Discover") {
            return <Ionicons name="grid-outline" size={24} color={color} />; // 발견 아이콘 대체
          } else if (route.name === "Store") {
            return <Ionicons name="location-outline" size={24} color={color} />;
          } else if (route.name === "MyPage") {
            return <Ionicons name="person-outline" size={24} color={color} />;
          }
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeIndex} options={{ title: "홈" }} />
      <Tab.Screen
        name="Category"
        component={CategoryIndex}
        options={{ title: "카테고리" }}
      />
      <Tab.Screen
        name="Discover"
        component={Discover}
        options={{ title: "발견" }}
      />
      <Tab.Screen
        name="Store"
        component={Store}
        options={{ title: "올영매장" }}
      />
      <Tab.Screen
        name="MyPage"
        component={MyPage}
        options={{ title: "마이" }}
      />
    </Tab.Navigator>
  );
}
