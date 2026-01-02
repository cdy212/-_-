import {
  SafeAreaView,
  TextInput,
  StyleSheet,
  Button,
  Alert,
  Text,
  Dimensions,
} from "react-native";
import React, { useState, useEffect } from "react";
import authController from "../components/authController";
import { View } from "react-native-animatable";
import { useEvent } from "expo";
import { useVideoPlayer, VideoView } from "expo-video";

import {
  useNavigation,
  createNavigationContainerRef,
} from "@react-navigation/native";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginIndex from "../components/login";
import Register from "../components/login/regist";
import UserIndex from "../components/user";
import MyLinks from "../pages/MyLinks";
import customAlert from "../components/common/customAlert";

/**
 * 페이지 최상단 페이지(로그인)
 *
 * @returns
 */
const IndexPage = (props) => {
  const navigation = useNavigation();
  const navigationRef = createNavigationContainerRef();
  const Stack = createNativeStackNavigator();

  // login-user
  // const { user, setUser } = props;
  //"UserIndex" : "LoginIndex"
  const [defaultStack, setDefaultStack] = useState("LoginIndex");
  const [user, setUser] = useState(null);
  // const [username, setUsername] = useState("");
  // const [pass, setPass] = useState("");

  useEffect(() => {
    const getAuth = async () => {
      const userAuth = await authController.authUser();
      setUser(userAuth);
    };
    getAuth();
  }, []);

  // 로딩바 넣어야할듯...
  useEffect(() => {
    if (user != null) {
      setDefaultStack("UserIndex");
      navigation.navigate("UserIndex");
    } else {
      navigation.navigate("LoginIndex");
    }
  }, [user]);

  console.log("login-user:::====");
  console.log(user);
  console.log("login-user:::====");

  async function reqLogin(username, pass) {
    console.log("[58] index.jsp::reqLogin====");

    if (!username || !pass) {
      // return Alert.alert("Username and password are required");
      return customAlert("아이디 또는 패스워드를 입력해주세요.");
    }
    const res = await authController.authLogin(username, pass);

    console.log(res);

    if (res.message) {
      let message = "";
      if (res.message == "user_notfound") {
        message = "유저정보가 존재하지 않습니다. 등록후 이용해주세요.";
      } else if (res.message == "Bad credentials") {
        message = "ID/패스워드를 확인해주세요.";
      } else {
        message = res.message;
      }
      customAlert(message);
      // Alert.alert(res.message);
    } else {
      setUser(res);
    }
  }

  const authLogout = () => {
    console.log("=====authLogout=====");

    authController.authLogout();
    setUser(null);
  };

  const goStackPage = (type) => {
    console.log(`index.goStackPage:::${type}`);

    if (type == "index") {
      navigation.navigate("IndexScreen");
    } else if (type == "regist") {
      navigation.navigate("RegistScreen");
    } else if (type == "password") {
      // navigation.push("../pages/MyLinks");
      navigation.navigate("password");
    } else {
      navigation.navigate("splash");
    }
  };

  const gopage = (type) => {
    console.log(type);
    if (type == "index") {
      navigation.navigate("IndexScreen");
    } else if (type == "regist") {
      navigation.navigate("RegistScreen");
    } else if (type == "password") {
      // navigation.push("../pages/MyLinks");
      navigation.navigate("password");
    } else {
      navigation.navigate("splash");
    }
  };

  let localVideo = "";
  // "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

  // localVideo = require("../assets/splash.mp4");

  const player = useVideoPlayer(localVideo, (player) => {
    player.loop = true;
    player.muted = true; // Mute the background video
    player.play();
  });

  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });

  function SamplePageFunc() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text onPress={() => gopage("index")}>
          SplashScreen Demo! 클릭시 인덱스로 이동합니다.
        </Text>
      </View>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName={defaultStack}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Group>
        <Stack.Screen
          name="splash"
          style={styles.container}
          component={SamplePageFunc}
        ></Stack.Screen>
        {/* props 형태로 전달하기위해서 아래 방식ㅊ으로 처리 */}
        <Stack.Screen
          name="LoginIndex"
          style={styles.container}
          // component={LoginIndex}
          // goStackPage={goStackPage}
        >
          {(props) => (
            <LoginIndex
              {...props}
              user={user}
              setUser={setUser}
              reqLogin={reqLogin}
              goStackPage={goStackPage}
            />
          )}
        </Stack.Screen>
        <Stack.Screen
          name="RegistScreen"
          style={styles.container}
          // component={Register}
        >
          {(props) => (
            <Register
              {...props}
              user={user}
              setUser={setUser}
              goStackPage={goStackPage}
              navigation={navigation}
            />
          )}
        </Stack.Screen>
        <Stack.Screen
          name="password"
          style={styles.container}
          component={MyLinks}
        ></Stack.Screen>
      </Stack.Group>
      <Stack.Group>
        <Stack.Screen
          name="UserIndex"
          style={styles.container}
          // component={UserIndex}
        >
          {(props) => (
            <UserIndex
              {...props}
              user={user ? user : null}
              goStackPage={goStackPage}
              authLogout={authLogout}
            />
          )}
        </Stack.Screen>
      </Stack.Group>
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputBody: {
    backgroundColor: "transparent",
    // top: "40%",
    // width: "100%",
    // position: "absolute",
    // alignItems: "center",
    // justifyContent: "center",
    // width: "100%",
    display: "flex",
    alignContent: "center",
    // position: "absolute",
    height: "30",
    // transform: "translate(-50%, -50%)",
    // transform: "translate(0, -50%)",
  },
  br: {
    margin: "3",
  },
  loginButton: {
    width: "90%",
    margin: 12,
    height: 40,
  },
  regButton: {},
  forgetButton: {},
  input: {
    // width: "90%",
    height: 40,
    borderWidth: 1,
    margin: 5,
    padding: 10,
  },
  backgroundVideo: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    opacity: 0.2,
    // width: Dimensions.get("window").width,
    // height: Dimensions.get("window").height,
  },
});

export default IndexPage;
