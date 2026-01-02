import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
} from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

// [Context] 로그인 상태 관리
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// Pages
import SplashIndex from "./src/splash"; // [복구] 스플래시 컴포넌트
import LoginIndex from "./components/login/index";
import Register from "./components/login/register";
import FindId from "./components/login/findId";
import FindPassword from "./components/login/findPassword";

import HomeIndex from "./components/home/index";
import CategoryIndex from "./components/category/index";
import DiscoverIndex from "./components/discover/index";
import MyPage from "./components/mypage/index";
import Likes from "./components/likes/";
import Store from "./components/store/";

SplashScreen.preventAutoHideAsync();

// [1] 가짜 네비게이션 객체 (에러 방지용)
const createFakeNavigation = (setCurrentScreen) => ({
  navigate: (screenName) => setCurrentScreen(screenName),
  push: (screenName) => setCurrentScreen(screenName),
  goBack: () => setCurrentScreen("Home"),
  addListener: () => {},
  setOptions: () => {},
});

// [2] 메인 앱 컴포넌트 (로그인 후)
function MainApp() {
  const [activeTab, setActiveTab] = useState("Home");
  const navigation = createFakeNavigation(setActiveTab);

  const renderContent = () => {
    switch (activeTab) {
      case "Home":
        return <HomeIndex navigation={navigation} />;
      case "Category":
        return <CategoryIndex navigation={navigation} />;
      case "Discover":
        return <DiscoverIndex navigation={navigation} />;
      case "Likes":
        return <Likes navigation={navigation} />;
      case "MyPage":
        return <MyPage navigation={navigation} />;
      case "Store":
        return <Store navigation={navigation} />;
      default:
        return <HomeIndex navigation={navigation} />;
    }
  };

  return (
    <View style={styles.fullSize}>
      <View style={styles.contentContainer}>{renderContent()}</View>
      {/* 하단 탭바 (항상 고정) */}
      <View style={styles.bottomTabBar}>
        <TabButton
          name="Home"
          icon="home-outline"
          label="홈"
          activeTab={activeTab}
          onPress={setActiveTab}
        />
        <TabButton
          name="Category"
          icon="menu-outline"
          label="카테고리"
          activeTab={activeTab}
          onPress={setActiveTab}
        />
        <TabButton
          name="Discover"
          icon="compass-outline"
          label="발견"
          activeTab={activeTab}
          onPress={setActiveTab}
        />
        <TabButton
          name="Store"
          icon="location-outline"
          label="올영매장"
          activeTab={activeTab}
          onPress={setActiveTab}
        />
        <TabButton
          name="Likes"
          icon="heart-outline"
          label="좋아요"
          activeTab={activeTab}
          onPress={setActiveTab}
        />
        <TabButton
          name="MyPage"
          icon="person-outline"
          label="마이"
          activeTab={activeTab}
          onPress={setActiveTab}
        />
      </View>
    </View>
  );
}

const TabButton = ({ name, icon, label, activeTab, onPress }) => {
  const isActive = activeTab === name;
  return (
    <TouchableOpacity style={styles.tabBtn} onPress={() => onPress(name)}>
      <Ionicons
        name={isActive ? icon.replace("-outline", "") : icon}
        size={24}
        color={isActive ? "#000" : "#ccc"}
      />
      <Text style={[styles.tabText, { color: isActive ? "#000" : "#ccc" }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

// [3] 로그인/비로그인 분기 처리
function RootContent() {
  const { user, loading } = useAuth();
  const [authScreen, setAuthScreen] = useState("Login");

  if (loading) return null;

  const authNav = createFakeNavigation(setAuthScreen);

  // 비로그인 상태
  if (!user) {
    switch (authScreen) {
      case "Login":
        return <LoginIndex navigation={authNav} />;
      case "Register":
        return <Register navigation={authNav} />;
      case "FindId":
        return <FindId navigation={authNav} />;
      case "FindPassword":
        return <FindPassword navigation={authNav} />;
      default:
        return <LoginIndex navigation={authNav} />;
    }
  }

  // 로그인 상태
  return <MainApp />;
}

// [4] 최상위 App 컴포넌트
export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  // [핵심] 스플래시가 끝났는지 여부 (한 번 true가 되면 앱 끌 때까지 유지됨)
  const [isSplashFinished, setIsSplashFinished] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500)); // 기본 로딩
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }
    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // 앱 준비가 되면 Native 스플래시(흰 화면)를 숨기고, 우리가 만든 SplashIndex를 보여줌
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <AuthProvider>
      <SafeAreaProvider>
        <View style={styles.webBackground} onLayout={onLayoutRootView}>
          <View style={styles.mobileFrame}>
            {/* [로직] 스플래시가 아직 안 끝났으면 SplashIndex 표시 */}
            {!isSplashFinished ? (
              <SplashIndex
                // 스플래시 화면에서 작업이 끝나면 이 함수를 호출하게 됨
                callbackSplashFunc={() => setIsSplashFinished(true)}
              />
            ) : (
              // 스플래시가 끝났으면 실제 앱 내용 표시
              <RootContent />
            )}
          </View>
        </View>
      </SafeAreaProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  fullSize: { flex: 1, backgroundColor: "#fff" },
  webBackground: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    alignItems: "center",
    justifyContent: "center",
  },
  mobileFrame: {
    width: Platform.OS === "web" ? 450 : "100%",
    height: "100%",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  contentContainer: {
    flex: 1,
  },
  bottomTabBar: {
    height: 60,
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "space-around",
    paddingBottom: 5,
  },
  tabBtn: {
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
  },
  tabText: {
    fontSize: 10,
    marginTop: 2,
    fontWeight: "bold",
  },
});
