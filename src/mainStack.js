// src/MainStack.js
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginIndex from "../components/login/index";
import Register from "../components/login/register"; // 회원가입
import FindId from "../components/login/findId"; // 아이디 찾기
import FindPassword from "../components/login/findPassword"; // 비번 찾기

// 메인홈
import HomeIndex from "../components/home/index";

import CommunityIndex from "../components/community/index"; // 커뮤니티
// 좋아요
import Likes from "../components/likes/index";
//마이페이지
import MyPageIndex from "../components/mypage";

const Stack = createNativeStackNavigator();

export default function MainStack() {
  return (
    <Stack.Navigator
      initialRouteName="LoginIndex"
      screenOptions={{ headerShown: false }} // 상단 헤더 숨김 (원하면 true)
    >
      <Stack.Screen name="LoginIndex" component={LoginIndex} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="FindId" component={FindId} />
      <Stack.Screen name="FindPassword" component={FindPassword} />
      <Stack.Screen name="HomeIndex" component={HomeIndex} />
      <Stack.Screen name="CommunityIndex" component={CommunityIndex} />
      <Stack.Screen
        name="LikesIndex"
        component={Likes}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="MyPageIndex" component={MyPageIndex} />
    </Stack.Navigator>
  );
}
