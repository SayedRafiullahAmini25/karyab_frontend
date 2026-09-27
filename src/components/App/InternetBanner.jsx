import { StyleSheet, Text, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";
import { userInternetChecker } from "../../contexts/InternetChecker";

export default function InternetBanner() {
  const { hasInternet, isLoading } = userInternetChecker();

  if (isLoading || hasInternet) return null;

  return (
    <View style={styles.container}>
      <AntDesign name="disconnect" size={18} color="#fff" />
      <Text style={styles.text}>اتصال اینترنت برقرار نیست</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    minHeight: 42,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#b3261e",
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    elevation: 10,
  },
  text: {
    color: COLORS.btnText,
    fontFamily: "yakan",
    fontSize: 15,
    textAlign: "center",
  },
});
