import React, { useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// [수정 완료] googleAuth 경로 변경
// AS-IS: src/utils/googleAuth.js
// TO-BE: components/common/googleAuth.js
// 현재 위치(components/login/)에서 ../common/googleAuth로 접근
import { signInWithGoogle } from "../common/googleAuth";

import PhraseGen from "korean-random-words";

function Register({ navigation }) {
  // 1. 닉네임 자동 생성 (라이브러리 에러 방지 처리)
  let initialProfileName = "User";
  try {
    const phraseGen = new PhraseGen();
    const generated = phraseGen.generatePhrase
      ? phraseGen.generatePhrase()
      : "user-test-123";
    const splitList = generated.split("-");
    // "형용사-명사" 구조일 때만 조합
    if (splitList.length > 2) {
      initialProfileName = `${splitList[1]} ${splitList[2]}`;
    }
  } catch (err) {
    console.log("korean-random-words 라이브러리 로드 실패:", err);
  }

  const [username, setUsername] = useState("");
  const [pass, setPass] = useState("");
  const [profileName, setProfileName] = useState(initialProfileName);
  const [emailAddr, setEmailAddr] = useState("");

  // 2. 아이디 입력 시 이메일/비번 자동 완성 (테스트 편의 기능)
  const usernameFunc = (value) => {
    setUsername(value);
    setEmailAddr(`${value}@test.com`);
    setPass(value);
  };

  // 3. 이메일 회원가입 로직
  async function createByEmail() {
    console.log("회원가입 시도:", username);

    if (!username || !pass || !emailAddr) {
      Alert.alert("알림", "아이디, 이메일, 비밀번호를 모두 입력해주세요.");
      return;
    }

    // TODO: 실제 API 호출 (Firebase or Server)
    // const result = await authController.register(...);

    Alert.alert("성공", `[${username}]님 가입을 환영합니다! (테스트)`);
    // 가입 성공 후 로그인 페이지로 이동하려면:
    // navigation.navigate("LoginIndex");
  }

  // 4. 소셜 회원가입 로직
  const handleSocialRegister = async (platform) => {
    if (platform === "Google") {
      try {
        const userInfo = await signInWithGoogle();
        if (userInfo && userInfo.user) {
          const { email, name } = userInfo.user;

          setUsername(email.split("@")[0]);
          setEmailAddr(email);
          setProfileName(name || "Google User");
          setPass("social_user_pass"); // 소셜 유저용 더미 패스워드

          Alert.alert(
            "구글 연동 성공",
            "정보를 불러왔습니다. 내용을 확인 후 '등록하기'를 눌러주세요."
          );
        }
      } catch (e) {
        console.error(e);
        Alert.alert("오류", "구글 로그인 연동 중 문제가 발생했습니다.");
      }
    } else {
      Alert.alert("알림", `${platform} 로그인은 아직 준비 중입니다.`);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        <Text style={styles.title}>회원가입</Text>

        <Text style={styles.label}>ID</Text>
        <TextInput
          style={styles.input}
          onChangeText={usernameFunc}
          placeholder="사용하실 아이디 입력"
          value={username}
          autoCapitalize="none"
        />

        <Text style={styles.label}>E-MAIL</Text>
        <TextInput
          style={styles.input}
          onChangeText={setEmailAddr}
          placeholder="이메일 주소 입력"
          value={emailAddr}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>프로필명</Text>
        <TextInput
          style={styles.input}
          onChangeText={setProfileName}
          placeholder="프로필명 입력"
          value={profileName}
        />

        <Text style={styles.label}>패스워드</Text>
        <TextInput
          style={styles.input}
          onChangeText={setPass}
          placeholder="비밀번호 입력"
          secureTextEntry={true}
          value={pass}
        />

        {/* 등록 버튼 */}
        <TouchableOpacity style={styles.registerButton} onPress={createByEmail}>
          <Text style={styles.registerButtonText}>등록하기</Text>
        </TouchableOpacity>

        {/* 취소 버튼 */}
        <TouchableOpacity
          onPress={() => navigation.navigate("LoginIndex")}
          style={styles.cancelButton}
        >
          <Text style={styles.cancelButtonText}>취소</Text>
        </TouchableOpacity>

        {/* 소셜 회원가입 영역 */}
        <View style={styles.socialContainer}>
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>SNS 계정으로 가입</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialButtonsRow}>
            {/* 네이버 */}
            <TouchableOpacity
              style={[styles.socialBtn, styles.naverBtn]}
              onPress={() => handleSocialRegister("Naver")}
            >
              <Text style={styles.naverText}>N</Text>
            </TouchableOpacity>

            {/* 카카오 */}
            <TouchableOpacity
              style={[styles.socialBtn, styles.kakaoBtn]}
              onPress={() => handleSocialRegister("Kakao")}
            >
              <Ionicons name="chatbubble-sharp" size={20} color="#381e1f" />
            </TouchableOpacity>

            {/* 구글 */}
            <TouchableOpacity
              style={[styles.socialBtn, styles.googleBtn]}
              onPress={() => handleSocialRegister("Google")}
            >
              <Ionicons name="logo-google" size={22} color="#4285F4" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#fff",
  },
  container: {
    marginTop: 60,
    marginHorizontal: 30,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    height: 45,
    marginTop: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    paddingHorizontal: 12,
    backgroundColor: "#f9f9f9",
  },
  label: {
    fontWeight: "600",
    color: "#555",
    marginLeft: 2,
  },
  registerButton: {
    backgroundColor: "#1e4f98",
    paddingVertical: 14,
    borderRadius: 4,
    alignItems: "center",
    marginTop: 10,
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    marginTop: 15,
    paddingVertical: 10,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#888",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  socialContainer: {
    marginTop: 40,
    alignItems: "center",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#eee",
  },
  dividerText: {
    marginHorizontal: 10,
    fontSize: 12,
    color: "#999",
  },
  socialButtonsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
  },
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

export default Register;
