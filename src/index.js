import React from "react";
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

// [중요] 분리해둔 로그인 폼 컴포넌트 불러오기
// 파일 경로가 src/components/login/index.js 라고 가정합니다.
import LoginForm from "./components/login";

export default function IndexPage({ navigation }) {
  // App.js의 Stack.Screen에서 렌더링되므로, navigation 객체가 props로 자동으로 들어옵니다.
  // 이 navigation을 LoginForm에 전달하여, 폼 내부에서 화면 이동(CommunityIndex 등)을 할 수 있게 합니다.

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* 1. 로고 영역 */}
            <View style={styles.logoArea}>
              <Text style={styles.logoText}>Korean.net</Text>
              <Text style={styles.subLogoText}>
                재외동포청 재외동포 365 민원포털
              </Text>
            </View>

            {/* 2. 로그인 폼 컴포넌트 (navigation 객체 전달) */}
            <LoginForm navigation={navigation} />

            {/* 3. 하단 카피라이트 */}
            <View style={styles.copyrightArea}>
              <Text style={styles.copyrightText}>
                Copyright © Overseas Koreans Agency.{"\n"}All Rights Reserved.
              </Text>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 40,
  },
  logoArea: {
    alignItems: "center",
    marginBottom: 40,
    marginTop: 20,
  },
  logoText: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1e4f98",
    letterSpacing: -1,
    marginBottom: 5,
  },
  subLogoText: {
    fontSize: 14,
    color: "#666",
  },
  copyrightArea: {
    marginTop: 50,
    alignItems: "center",
  },
  copyrightText: {
    fontSize: 11,
    color: "#999",
    textAlign: "center",
    lineHeight: 16,
  },
});
