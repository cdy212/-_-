// src/utils/googleAuth.js
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";

// 앱 시작 시 한 번만 호출되도록 설정 (App.js 또는 이 파일 로드 시)
GoogleSignin.configure({
  // Firebase Console에서 가져온 웹 클라이언트 ID (Android/iOS 공통 사용 권장)
  webClientId:
    "331739821804-82eobrek98d3hro3f2do6vnebut8qto7.apps.googleusercontent.com",
  offlineAccess: true,
});

export const signInWithGoogle = async () => {
  try {
    // 1. Play Service 확인
    await GoogleSignin.hasPlayServices();

    console.log("statusCodes:::");
    console.log(statusCodes);

    // 2. 로그인 창 띄우기
    const userInfo = await GoogleSignin.signIn();

    // 3. 토큰 및 유저 정보 반환
    return userInfo;
  } catch (error) {
    console.log(error.code);

    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      // 사용자가 로그인을 취소함
      console.log("User cancelled the login flow");
      return null;
    } else if (error.code === statusCodes.IN_PROGRESS) {
      // 이미 로그인 진행 중
      console.log("Sign in is in progress already");
      return null;
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      // 구글 플레이 서비스가 없거나 구버전
      console.log("Play services not available or outdated");
      return null;
    } else {
      // 기타 에러
      console.error("Google Sign-In Error:", error);
      throw error;
    }
  }
};

export const signOutGoogle = async () => {
  try {
    await GoogleSignin.signOut();
    // 필요 시 계정 연결 끊기: await GoogleSignin.revokeAccess();
  } catch (error) {
    console.error(error);
  }
};
