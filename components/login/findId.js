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

function FindId({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleFindId = () => {
    if (!name || !email) {
      Alert.alert("알림", "이름과 이메일을 모두 입력해주세요.");
      return;
    }
    // TODO: 실제 서버 API 연동 필요
    console.log("아이디 찾기 시도:", name, email);

    // 모의 응답
    Alert.alert("알림", "회원님의 아이디는 [ test_user ] 입니다.", [
      {
        text: "로그인하러 가기",
        onPress: () => navigation.navigate("LoginIndex"),
      },
    ]);
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>

        <Text style={styles.title}>아이디 찾기</Text>
        <Text style={styles.subTitle}>
          가입 시 등록한 이름과 이메일을 입력해주세요.
        </Text>

        <Text style={styles.label}>이름</Text>
        <TextInput
          style={styles.input}
          placeholder="이름을 입력해주세요."
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>이메일</Text>
        <TextInput
          style={styles.input}
          placeholder="이메일을 입력해주세요."
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TouchableOpacity style={styles.confirmButton} onPress={handleFindId}>
          <Text style={styles.confirmButtonText}>아이디 찾기</Text>
        </TouchableOpacity>
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
  backButton: {
    marginBottom: 20,
    alignSelf: "flex-start",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 30,
    lineHeight: 20,
  },
  label: {
    fontWeight: "600",
    color: "#555",
    marginLeft: 2,
    marginBottom: 5,
  },
  input: {
    height: 45,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    paddingHorizontal: 12,
    backgroundColor: "#f9f9f9",
  },
  confirmButton: {
    backgroundColor: "#1e4f98",
    paddingVertical: 14,
    borderRadius: 4,
    alignItems: "center",
    marginTop: 10,
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default FindId;
