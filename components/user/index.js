import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";

import authController from "../../components/authController";
import customAlert from "../common/customAlert";
import { commonStyles } from "../../styles/base";

// https://github.com/tomekvenits/react-native-login-template
const UserIndexPage = ({ user, authLogout }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>안녕하세요</Text>
      <Text style={styles.logo}>'{user?.profileName}'님</Text>
      <View style={styles.inputView}>
        <Text style={styles.inputText2}>{user?.username}</Text>
      </View>

      <View style={styles.inputView}>
        <Text style={styles.inputText2}>{user?.email}</Text>
      </View>
      <View style={styles.inputView}>
        <Text style={styles.inputText2}>{user?.token}</Text>
      </View>
      <TouchableOpacity style={styles.loginBtn} onPress={authLogout}>
        <Text style={styles.loginText}>LOGOUT</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#003f5c",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    paddingBottom: 10,
    fontWeight: "bold",
    fontSize: 45,
    color: "#fb5b5a",
    // marginBottom: 40,
  },
  inputView: {
    width: "80%",
    backgroundColor: "#465881",
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: "center",
    padding: 20,
  },
  inputText: {
    height: 80,
    color: "white",
  },
  inputText2: {
    marginTop: 60,
    height: 80,
    color: "white",
  },
  forgot: {
    color: "white",
    fontSize: 11,
  },
  loginBtn: {
    width: "80%",
    backgroundColor: "#fb5b5a",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 10,
  },
  loginText: {
    color: "white",
  },
});
export default UserIndexPage;

// import React, { useState, useEffect } from "react";
// import {
//   Text,
//   View,
//   TouchableOpacity,
//   TextInput,
//   StyleSheet,
//   Button,
//   Alert,
// } from "react-native";

// //https://github.com/tomekvenits/react-native-login-template

// // import authController from "../../components/authController";
// import customAlert from "../common/customAlert";
// import { commonStyles } from "../../styles/base";

// const UserIndexPage = ({ user }) => {
//   console.log(user);

//   return (
//     <View style={styles.inputBody}>
//       <Text style={styles.container}>
//         I Welcome {user.username} with email {user.email}
//       </Text>
//       <Text>사용자 대시보드</Text>
//       <Text>로그아웃</Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   inputBody: {
//     backgroundColor: "transparent",
//     display: "flex",
//     alignContent: "center",
//     height: "30px",
//   },
//   br: {
//     margin: "3px",
//   },
//   loginButton: {
//     width: "90%",
//     margin: 12,
//     height: 40,
//   },
//   regButton: {},
//   forgetButton: {},
//   input: {
//     // width: "90%",
//     height: 40,
//     borderWidth: 1,
//     margin: 5,
//     padding: 10,
//   },
//   backgroundVideo: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     bottom: 0,
//     right: 0,
//     opacity: 0.2,
//     // width: Dimensions.get("window").width,
//     // height: Dimensions.get("window").height,
//   },
// });
