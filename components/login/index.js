import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";

// [필수] AuthSession 관련 모듈
import {
  makeRedirectUri,
  useAuthRequest,
  ResponseType,
} from "expo-auth-session";

import { useAuth } from "../../contexts/AuthContext";

WebBrowser.maybeCompleteAuthSession();

// ============================================================
// [설정] 디스커버리 (API 주소) 정의
// ============================================================
const kakaoDiscovery = {
  authorizationEndpoint: "https://kauth.kakao.com/oauth/authorize",
  tokenEndpoint: "https://kauth.kakao.com/oauth/token",
};

const naverDiscovery = {
  authorizationEndpoint: "https://nid.naver.com/oauth2.0/authorize",
  tokenEndpoint: "https://nid.naver.com/oauth2.0/token",
};

// [중요] 네이버 클라이언트 정보
const NAVER_CLIENT_ID = "tetuiln3PBymHYaT5F5_";
const NAVER_CLIENT_SECRET = "fAykmzgh6u";

export default function LoginIndex({ navigation }) {
  const { login } = useAuth();
  const [userId, setUserId] = useState("");
  const [userPw, setUserPw] = useState("");

  // ============================================================
  // 1. 구글 로그인 설정
  // ============================================================
  const [googleRequest, googleResponse, googlePromptAsync] =
    Google.useAuthRequest({
      // 웹, 안드로이드, iOS 클라이언트 ID (설정 필요)
      webClientId:
        "331739821804-82eobrek98d3hro3f2do6vnebut8qto7.apps.googleusercontent.com",
      androidClientId:
        "331739821804-82eobrek98d3hro3f2do6vnebut8qto7.apps.googleusercontent.com",
      iosClientId:
        "331739821804-82eobrek98d3hro3f2do6vnebut8qto7.apps.googleusercontent.com",
    });

  // ============================================================
  // 2. 카카오 로그인 설정 (REST API)
  // ============================================================
  const [kakaoRequest, kakaoResponse, kakaoPromptAsync] = useAuthRequest(
    {
      clientId: "2b88972754fcc2cc2979de57713cff6b",
      scopes: ["profile_nickname", "profile_image", "account_email"],
      redirectUri: makeRedirectUri({ useProxy: true }),
      responseType: ResponseType.Code,
      usePKCE: false,
    },
    kakaoDiscovery
  );

  // ============================================================
  // 3. 네이버 로그인 설정 (REST API 방식)
  // ============================================================
  const [naverRequest, naverResponse, naverPromptAsync] = useAuthRequest(
    {
      clientId: NAVER_CLIENT_ID,
      scopes: [],
      redirectUri: makeRedirectUri({ useProxy: true }),
      responseType: ResponseType.Code,
      extraParams: {
        state: "koreataiwan_login_state",
      },
      usePKCE: false,
    },
    naverDiscovery
  );

  // ------------------------------------------------------------
  // 응답 처리 (useEffect)
  // ------------------------------------------------------------

  // [구글] 응답 처리
  useEffect(() => {
    if (googleResponse?.type === "success") {
      fetchGoogleUserInfo(googleResponse.authentication.accessToken);
    }
  }, [googleResponse]);

  // [카카오] 응답 처리
  useEffect(() => {
    if (kakaoResponse?.type === "success") {
      getKakaoToken(kakaoResponse.params.code);
    }
  }, [kakaoResponse]);

  // [네이버] 응답 처리
  useEffect(() => {
    if (naverResponse?.type === "success") {
      const { code, state } = naverResponse.params;
      getNaverToken(code, state);
    } else if (naverResponse?.type === "error") {
      Alert.alert("오류", "네이버 로그인 실패");
    }
  }, [naverResponse]);

  // ------------------------------------------------------------
  // 토큰 및 사용자 정보 교환 함수들
  // ------------------------------------------------------------

  // [구글] 정보 가져오기
  const fetchGoogleUserInfo = async (token) => {
    try {
      const res = await fetch("https://www.googleapis.com/userinfo/v2/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = await res.json();
      await login({
        id: user.id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        token: token,
        provider: "google",
      });
    } catch (error) {
      console.error(error);
      Alert.alert("오류", "구글 로그인 정보를 가져오는데 실패했습니다.");
    }
  };

  // [카카오] 토큰 및 정보 가져오기
  const getKakaoToken = async (code) => {
    try {
      const tokenRes = await fetch("https://kauth.kakao.com/oauth/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `grant_type=authorization_code&client_id=${kakaoRequest.clientId}&redirect_uri=${kakaoRequest.redirectUri}&code=${code}`,
      });
      const tokenJson = await tokenRes.json();
      const accessToken = tokenJson.access_token;

      const userRes = await fetch("https://kapi.kakao.com/v2/user/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const userJson = await userRes.json();

      await login({
        id: String(userJson.id),
        name: userJson.properties?.nickname || "Kakao User",
        email: userJson.kakao_account?.email || "",
        picture: userJson.properties?.profile_image || "",
        token: accessToken,
        provider: "kakao",
      });
    } catch (e) {
      console.error("Kakao Login Error", e);
      Alert.alert("오류", "카카오 로그인 중 문제가 발생했습니다.");
    }
  };

  // [네이버] 토큰 및 정보 가져오기 (Proxy 사용)
  const getNaverToken = async (code, state) => {
    try {
      // 1. 토큰 요청 (CORS 우회를 위해 Proxy 사용)
      const originalUrl = `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${NAVER_CLIENT_ID}&client_secret=${NAVER_CLIENT_SECRET}&code=${code}&state=${state}`;
      const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(
        originalUrl
      )}`;

      const tokenRes = await fetch(proxyUrl);
      const tokenJson = await tokenRes.json();

      if (tokenJson.error) {
        throw new Error(tokenJson.error_description);
      }

      const accessToken = tokenJson.access_token;

      // 2. 프로필 정보 요청
      const targetProfileUrl = "https://openapi.naver.com/v1/nid/me";
      const proxyProfileUrl = `https://corsproxy.io/?${encodeURIComponent(
        targetProfileUrl
      )}`;

      const profileRes = await fetch(proxyProfileUrl, {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const profileJson = await profileRes.json();

      if (profileJson.resultcode === "00") {
        const userData = profileJson.response;
        await login({
          id: userData.id,
          name: userData.name || userData.nickname || "Naver User",
          email: userData.email,
          picture: userData.profile_image,
          token: accessToken,
          provider: "naver",
        });
      } else {
        Alert.alert("오류", "네이버 프로필 정보를 가져오지 못했습니다.");
      }
    } catch (e) {
      console.error("Naver Login Error:", e);
      Alert.alert("오류", "네이버 로그인 중 문제가 발생했습니다.");
    }
  };

  // ============================================================
  // 통합 로그인 핸들러
  // ============================================================
  const handleSocialLogin = (targetSocial) => {
    if (targetSocial === "google") {
      googlePromptAsync();
    } else if (targetSocial === "kakao") {
      kakaoPromptAsync();
    } else if (targetSocial === "naver") {
      if (!naverRequest) return;
      naverPromptAsync();
    }
  };

  // 일반 로그인
  const handleLogin = async () => {
    if (!userId || !userPw) {
      Alert.alert("알림", "아이디와 비밀번호를 입력해주세요.");
      return;
    }
    await login({
      id: "test_user_id",
      name: userId,
      email: "test@email.com",
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.logoArea}>
        <Text style={styles.logoText}>중화민국 한인회</Text>
        <Text style={styles.subText}>오신걸 환영합니다.</Text>
      </View>

      <View style={styles.inputArea}>
        <TextInput
          style={styles.input}
          placeholder="아이디"
          value={userId}
          onChangeText={setUserId}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="비밀번호"
          value={userPw}
          onChangeText={setUserPw}
          secureTextEntry={true}
        />

        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
          <Text style={styles.loginBtnText}>로그인</Text>
        </TouchableOpacity>

        <View style={styles.menuRow}>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.menuText}>회원가입</Text>
          </TouchableOpacity>
          <Text style={styles.divider}>|</Text>
          <TouchableOpacity onPress={() => navigation.navigate("FindId")}>
            <Text style={styles.menuText}>아이디/비번 찾기</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.socialContainer}>
        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>SNS 계정으로 로그인</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.socialButtonsRow}>
          {/* 네이버 버튼 */}
          <TouchableOpacity
            style={[styles.socialBtn, styles.naverBtn]}
            onPress={() => handleSocialLogin("naver")}
          >
            <Text style={styles.naverText}>N</Text>
          </TouchableOpacity>

          {/* 카카오 버튼 */}
          <TouchableOpacity
            style={[styles.socialBtn, styles.kakaoBtn]}
            onPress={() => handleSocialLogin("kakao")}
          >
            <Ionicons name="chatbubble-sharp" size={20} color="#381e1f" />
          </TouchableOpacity>

          {/* 구글 버튼 */}
          <TouchableOpacity
            style={[styles.socialBtn, styles.googleBtn]}
            onPress={() => handleSocialLogin("google")}
          >
            <Ionicons name="logo-google" size={22} color="#4285F4" />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 30,
    justifyContent: "center",
    paddingBottom: 50,
  },
  logoArea: { alignItems: "center", marginBottom: 50, marginTop: 50 },
  logoText: { fontSize: 28, fontWeight: "bold", color: "#1e4f98" },
  subText: { fontSize: 16, color: "#888", marginTop: 8 },
  inputArea: { marginBottom: 30 },
  input: {
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginBottom: 15,
    fontSize: 16,
    paddingHorizontal: 5,
  },
  loginBtn: {
    backgroundColor: "#1e4f98",
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  loginBtnText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  menuRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    alignItems: "center",
  },
  menuText: { color: "#666", fontSize: 14 },
  divider: { marginHorizontal: 15, color: "#ddd" },
  socialContainer: { marginTop: 20, alignItems: "center" },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: "#eee" },
  dividerText: { marginHorizontal: 10, fontSize: 12, color: "#999" },
  socialButtonsRow: { flexDirection: "row", justifyContent: "center", gap: 15 },
  socialBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  naverBtn: { backgroundColor: "#03C75A" },
  naverText: { color: "#fff", fontWeight: "900", fontSize: 16 },
  kakaoBtn: { backgroundColor: "#FEE500" },
  googleBtn: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#eee" },
});
