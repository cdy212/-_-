import AsyncStorage from "@react-native-async-storage/async-storage";
import BASE_URL_BACKEND from "../config/baseUrl";
import customAlert from "./common/customAlert";

const authLogin = async (username, password) => {
  console.log("authLogin " + username + " " + password);

  try {
    const res = await fetch(BASE_URL_BACKEND + "api/auth/login", {
      method: "POST",
      // mode: "no-cors",
      // credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });

    const data = await res.json();
    // customAlert(JSON.stringify(data));
    await AsyncStorage.setItem("user", JSON.stringify(data));
    return data;
  } catch (err) {
    return err;
  }
};

const register = async (username, password, profileName, email) => {
  // console.log(
  //   `username:${username},password:${password},profileName:${profileName}, email:${email}`
  // );
  // console.log("url::" + BASE_URL_BACKEND + "api/auth/register");

  try {
    const res = await fetch(BASE_URL_BACKEND + "api/auth/register", {
      method: "POST",
      // mode: "no-cors",
      // credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
        profileName: profileName,
        email: email,
      }),
    });

    // success:
    //Response {type: 'cors', url: 'http://10.70.206.4:7777/api/auth/register', redirected: false, status: 200, ok: true, …}
    // fali:
    //Response {type: 'cors', url: 'http://10.70.206.4:7777/api/auth/register', redirected: false, status: 400, ok: false, …}

    const data = await res.json();
    console.log(
      "===========================authController==========================="
    );
    console.log(data);
    console.log(
      "===========================authController==========================="
    );

    /*
    {"error": "Bad Request", "errors": [
    {"arguments": [Array], "bindingFailure": false, "code": "Size", "codes": [Array], "defaultMessage": "크기가 6에서 40 사이여야 합니다", "field": "password", "objectName": "signupRequest", "rejectedValue": "111"}, 
    {"arguments": [Array], "bindingFailure": false, "code": "Size", "codes": [Array], "defaultMessage": "크기가 3에서 20 사이여야 합니다", "field": "username", "objectName": "signupRequest", "rejectedValue": "11"}, 
    {"arguments": [Array], "bindingFailure": false, "code": "Email", "codes": [Array], "defaultMessage": "올바른 형식의 이메일 주소여야 합니다", "field": "email", "objectName": "signupRequest", "rejectedValue": "11"}], "message": "Validation failed for object='signupRequest'. Error count: 3", "path": "/api/auth/register", "status": 400, "timestamp": "2025-08-26T05:44:39.049+00:00", "trace": "org.springframework.web.bind.MethodArgumentNotValidException: Validation failed for argument [0] in public org.springframework.http.ResponseEntity<?> bmb.authentication.controller.AuthController.registerUser(bmb.authentication.payload.request.SignupRequest) with 3 errors: [Field error in object 'signupRequest' on field 'password': rejected value [111]; codes [Size.signupRequest.password,Size.password,Size.java.lang.String,Size]; 
    arguments [org.springframework.context.support.DefaultMessageSourceResolvable: codes [signupRequest.password,password]; 
    arguments []; default message [password],40,6]; default message [크기가 6에서 40 사이여야 합니다]] [Field error in object 'signupRequest' on field 'username': rejected value [11]; codes [Size.signupRequest.username,Size.username,Size.java.lang.String,Size]; 
    arguments [org.springframework.context.support.DefaultMessageSourceResolvable: codes [signupRequest.username,username]; 
    arguments []; default message [username],20,3]; default message [크기가 3에서 20 사이여야 합니다]] [Field error in object 'signupRequest' on field 'email': rejected value [11]; codes [Email.signupRequest.email,Email.email,Email.java.lang.String,Email]; 
    arguments [org.springframework.context.support.DefaultMessageSourceResolvable: codes [signupRequest.email,email]; 
    arguments []; default message [email],[Ljavax.validation.constraints.Pattern$Flag;@3c6a5dd2,.*]; default message [올바른 형식의 이메일 주소여야 합니다]]
*/
    if (data?.status == 200) {
      // console.log("create success!!");
      await AsyncStorage.setItem("user", JSON.stringify(data));
    }

    return data;
  } catch (err) {
    return `register.error:${err}`;
  }
};

const authLogout = async () => {
  console.log("authController.authLogout:: user logout");
  try {
    await AsyncStorage.removeItem("user");
  } catch (error) {
    console.log(error);
  }
};

const authUser = async () => {
  console.log("authController.authUser:: user login");
  try {
    const value = await AsyncStorage.getItem("user");
    if (value !== null) {
      return JSON.parse(value);
    }
    return null;
  } catch (error) {
    console.log(error);
  }
};

const authController = {
  authLogout,
  authLogin,
  authUser,
  register,
};

export default authController;
