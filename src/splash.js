import React, { useEffect, useState } from "react";
import { View, StyleSheet, ImageBackground, Platform } from "react-native";
import * as Animatable from "react-native-animatable";

const Splash = ({ onLayoutRootView, callbackSplashFunc }) => {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCounter((prev) => prev + 1);

      // 약 3초(3번의 카운트) 후에 메인으로 이동하도록 설정 (조절 가능)
      if (counter >= 3) {
        callbackSplashFunc(true);
      }
    }, 1000);

    return () => clearTimeout(timer); // 메모리 누수 방지
  }, [counter]);

  return (
    // onLayout을 최상위 View에 배치하여 로딩 완료를 알림
    <View style={styles.outerContainer} onLayout={onLayoutRootView}>
      <ImageBackground
        source={require("../assets/splash_slash_image.png")}
        style={styles.background}
        imageStyle={styles.backgroundImage} // 이미지 자체 스타일 제어
      >
        <View style={styles.overlay}>
          {/* <Animatable.Image
            source={require("../assets/splash_icon_mark.png")}
            style={styles.logo}
            duration={1500}
            animation={"pulse"}
            iterationCount="infinite"
          /> */}
          {/* 타이완 톡 스타일의 텍스트를 스플래시에 추가하고 싶다면 아래 주석 해제 */}
          {/* <Animatable.Text 
              animation="fadeInUp" 
              style={styles.splashBrand}
          >
              TAIWAN TALK
          </Animatable.Text> */}
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundImage: {
    // 웹 프레임 안에서 이미지가 찌그러지지 않도록 설정
    resizeMode: "cover",
  },
  overlay: {
    flex: 1,
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.05)", // 로고 부각을 위한 미세한 어두움
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 100,
    // 그림자 효과 (iOS/Web용)
    ...Platform.select({
      web: {
        filter: "drop-shadow(0px 4px 8px rgba(0,0,0,0.2))",
      },
    }),
  },
  splashBrand: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: 4,
    color: "#333",
  },
});

export default Splash;
