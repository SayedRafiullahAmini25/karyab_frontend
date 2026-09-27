import {
  ActivityIndicator,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Input from "../components/inputs/Input";
import { COLORS } from "../constants/colors";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import { memo, useEffect, useState } from "react";
import axios from "axios";
import { apiPath } from "../configs/conf";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { userInternetChecker } from "../contexts/InternetChecker";

export default memo(function LoginScreen() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  const { isLogin, token, setToken, setIsLogin } = useAuth();
  const [isLoadin, setIsLoading] = useState(false);
  const {hasInternet} = userInternetChecker()

  useEffect(() => {
    if (isLogin) navigation.replace("MainTab");
  }, [isLogin, navigation]);

  useEffect(() => {
    if (!hasInternet) {
      Toast.show({
        type: "error",
        text2: "لطفا اتصال اینترنت خود را بررسی کنید",
        position: "bottom",
        visibilityTime: 3000,
        autoHide: true,
        text2Style: { fontFamily: "yakan", fontSize: 17, textAlign: "right" },
      });
    }
  }, [hasInternet]);

  const loginHandler = async () => {
    if (!hasInternet || isLoadin) return;
    setIsLoading(true);
    try {
      const res = await axios.post(`${apiPath}/api/v1/user/login`, {
        phone,
        password,
      });
      if (!res.data.success) {
        Toast.show({
          type: "error",
          text2: res.data.message,
          position: "bottom",
          visibilityTime: 4000,
          autoHide: true,
          text2Style: { fontFamily: "yakan", fontSize: 18, textAlign: "right" },
        });
        setIsLoading(false);
        return;
      }
      AsyncStorage.setItem("token", res.data.token);
      AsyncStorage.setItem("userId", res.data.loggedInUserId);
      setIsLogin(true);
      setToken(res.data.token);
      Toast.show({
        type: "success",
        text2: res.data.message,
        position: "bottom",
        visibilityTime: 4000,
        autoHide: true,
        text2Style: { fontFamily: "yakan", fontSize: 18, textAlign: "right" },
      });
    } catch (err) {
      Toast.show({
        type: "error",
        text2: err.response?.data?.message || "خطا در اتصال به سرور",
        position: "bottom",
        visibilityTime: 3000,
        autoHide: true,
        text2Style: { fontFamily: "yakan", fontSize: 17, textAlign: "right" },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ImageBackground
      imageStyle={styles.imageCanvas}
      style={styles.container}
      source={require("../../assets/images/loginBackround.png")}
    >
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logoContainer}>
            <Image
              style={styles.logo}
              source={require("../../assets/splash-icon/splashLogo.png")}
            />
            <Text
              style={{ textAlign: "center", fontFamily: "yakan", fontSize: 18 }}
            >
              بهترین کارگران در یک مکان
            </Text>
          </View>
          <View style={styles.formContainer}>
            <Text style={styles.text1}>ورود به حساب کاربری</Text>
            <Text style={styles.text2}>به حساب خود وارد شوید و ادامه دهید</Text>

            <View style={styles.inputsWrapper}>
              <Input
                icon="phone"
                placeHolder="شماره موبایل"
                setValue={setPhone}
                value={phone}
              />
              <Input
                icon="lock"
                placeHolder="رمز عبور"
                isSecret={true}
                setValue={setPassword}
                value={password}
              />
            </View>
            <TouchableOpacity onPress={loginHandler} disabled={!hasInternet || isLoadin} style={[styles.btn1, (!hasInternet || isLoadin) && { opacity: 0.6 }]}>
              {isLoadin ? (
                <ActivityIndicator size="small" color="#ffff" />
              ) : (
                <Text style={styles.btn1Text}>ورود</Text>
              )}
            </TouchableOpacity>

            <View style={{ flexDirection: "row", gap: 7, marginTop: 12 }}>
              <TouchableOpacity
                onPress={() => navigation.navigate("acountType")}
              >
                <Text
                  style={{ color: COLORS.primaryDark, fontFamily: "yakan" }}
                >
                  ثبت نام کنید
                </Text>
              </TouchableOpacity>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "yakan",
                  color: COLORS.textSecondary,
                }}
              >
                حساب کاربری ندارید؟
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    resizeMode: "contain",
    paddingVertical: 40,
    gap: 0,
    paddingHorizontal: 6,
  },
  keyboardContainer: { flex: 1, width: "100%" },
  scrollContent: { paddingVertical: 30, paddingHorizontal: 6, gap: 0 },
  logoContainer: {
    gap: 10,
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: "center",
    alignSelf: "center",
  },
  formContainer: {
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 16,
    backgroundColor: COLORS.background,
    paddingVertical: 35,
    minHeight: 360,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 20,
    justifyContent: "center",
    marginTop: 70,
  },
  imageCanvas: {
    mixBlendMode: "darken",
    backgroundColor: "rgba(221, 221, 221, 1)",
    resizeMode: "cover",
  },
  text1: {
    marginVertical: 10,
    fontFamily: "yakan",
    fontSize: 20,
  },
  text2: {
    fontFamily: "yakan",
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  inputsWrapper: {
    marginTop: 15,
    paddingVertical: 6,
    width: "100%",
    gap: 16,
  },
  btn1: {
    width: "100%",
    height: 50,
    borderRadius: 8,
    backgroundColor: COLORS.primaryDark,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 20,
  },
  btn1Text: {
    fontFamily: "yakan",
    color: COLORS.btnText,
    fontWeight: "600",
    fontSize: 16,
  },
});
