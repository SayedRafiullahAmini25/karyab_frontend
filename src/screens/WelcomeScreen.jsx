import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../constants/colors";
import { containerStyle, titleTextStyles } from "../constants/styles";
import welcomeImage from "../../assets/images/welcomeImage.png";
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function WelcomeScreen() {

  const {isLogin}  = useAuth()
  useEffect(() => {
    isLogin && navigation.replace("MainTab");
  });

  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeTitle}>خوش آمدید</Text>

      <View>
        <Image style={styles.image} source={welcomeImage} />
      </View>

      <Text style={styles.mainText}>
        برای استفاده از امکانات برنامه, لطفا نوع حساب خود را انتخاب کنید.
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate("acountType")}
          style={styles.btn1}
        >
          <Text style={styles.btn1Text}>شروع کنید</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("login")}
          style={styles.btn2}
        >
          <Text style={styles.btn2Text}>ورود به حساب</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: containerStyle.paddingHorizontal,
    paddingVertical: containerStyle.paddingVertical,
  },
  welcomeTitle: {
    fontSize: titleTextStyles.fontSize,
    fontWeight: "600",
    color: COLORS.text,
    marginTop: titleTextStyles.marginTop,
    textAlign: "center",
    fontFamily: "lalezar",
  },
  image: {
    width: "100%",
    height: 400,
    resizeMode: "center",
  },
  mainText: {
    marginVertical: 16,
    alignSelf: "center",
    width: "80%",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 20,
    fontFamily: "yakan",
    color: COLORS.textSecondary,
  },
  buttonContainer: {
    gap: 10,
    marginTop: 12,
  },
  btn1: {
    width: "100%",
    height: 50,
    borderRadius: 8,
    backgroundColor: COLORS.primaryDark,
    justifyContent: "center",
    alignItems: "center",
  },
  btn1Text: {
    fontFamily: "yakan",
    color: COLORS.btnText,
    fontWeight: "600",
    fontSize: 16,
  },
  btn2: {
    width: "100%",
    height: 50,
    borderRadius: 8,
    borderWidth: 1.2,
    borderColor: COLORS.primaryDark,
    justifyContent: "center",
    alignItems: "center",
  },
  btn2Text: {
    color: COLORS.primaryDark,
    fontWeight: "600",
    fontSize: 16,
    fontFamily: "yakan",
  },
});
