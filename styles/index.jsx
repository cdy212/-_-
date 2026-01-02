import { StyleSheet } from "react-native";

export const mainStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 80,
  },
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    opacity: 0.2,
  },
  logo: {
    width: 220,
    height: 100,
    marginTop: 60,
  },
  body: {
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 5,
  },
  box: {
    justifyContent: "flex-end",
    alignItems: "center",
    width: "100%",
    height: 650,
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    paddingBottom: 60,
  },
  titleCad: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    paddingBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 3,
    padding: 5,
    width: 250,
    height: 30,
    textAlign: "center",
    marginVertical: 5,
    color: "#fff",
  },
  button: {
    backgroundColor: "#fff",
    width: 250,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 3,
  },
});
