// # alert.js
import { Alert, Platform } from "react-native";

const alertPolyfill = (title, description, options, extra) => {
  const result = window.confirm(
    [title, description].filter(Boolean).join("\n")
  );

  if (result) {
    // TODO 컨트롤할것..(window 버전에서 안됨)
    //   const confirmOption = options.find(({ style }) => style !== "cancel");
    //   confirmOption && confirmOption.onPress();
    // } else {
    //   // TODO 컨트롤할것..(window 버전에서 안됨)
    //   const cancelOption = options.find(({ style }) => style === "cancel");
    //   cancelOption && cancelOption.onPress();
  }
};
// console.log(Platform.OS);
const customAlert = Platform.OS === "web" ? alertPolyfill : Alert.alert;

export default customAlert;
