import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

// 키 값 상수
const USER_SESSION_KEY = "@user_session";

export const storage = {
  // 1. 데이터 저장 (로그인 시)
  save: async (key, value) => {
    try {
      const jsonValue = JSON.stringify(value);

      if (Platform.OS === "web") {
        // [웹] 브라우저 LocalStorage 또는 쿠키 설정 가능
        // 만약 쿠키를 써야 한다면 document.cookie = ... 로직을 여기에 작성
        await AsyncStorage.setItem(key, jsonValue);
      } else {
        // [앱] 기기 내부 저장소 (AsyncStorage 또는 SecureStore)
        await AsyncStorage.setItem(key, jsonValue);
      }
    } catch (e) {
      console.error("Storage Save Error", e);
    }
  },

  // 2. 데이터 불러오기 (자동 로그인 체크 시)
  get: async (key) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.error("Storage Get Error", e);
      return null;
    }
  },

  // 3. 데이터 삭제 (로그아웃 시)
  remove: async (key) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      console.error("Storage Remove Error", e);
    }
  },
};

export { USER_SESSION_KEY };
