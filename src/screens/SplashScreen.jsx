import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  BackHandler,
  TouchableOpacity,
} from "react-native";
import { COLORS } from "../constants/colors";
import SplashIcon from "../components/splash/SplashIcon";
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { userInternetChecker } from "../contexts/InternetChecker";

export default function SplashScreen() {
  const { hasInternet, checkInternet, isLoading } = userInternetChecker();
  const { isLogin, authLoading } = useAuth();

  const retry = () => {
    checkInternet();
  };

  const navigation = useNavigation();

  useEffect(() => {
    checkInternet();
    const timer = setTimeout(() => {
      if (!authLoading && hasInternet) {
        navigation.replace(isLogin ? "MainTab" : "welcome");
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [isLogin, hasInternet, authLoading]);

  return (
    <View style={styles.container}>
      <SplashIcon />
      <Text style={styles.text}>
        {hasInternet
          ? "بهترین کارگران در یک مکان"
          : "لطفا ابتدا به انترنت وصل شوید!"}
      </Text>
      {!hasInternet && (
        <TouchableOpacity onPress={() => retry()} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>تلاش مجدد</Text>
        </TouchableOpacity>
      )}
      {(hasInternet || isLoading || authLoading) && (
          <ActivityIndicator
            style={styles.loader}
            size="large"
            color={COLORS.activeIcon}
          />
        )}

      <View style={styles.badgeBottom}></View>
      <View style={styles.badgeTop}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    marginTop: 30,
    fontWeight: "600",
    color: COLORS.text,
    fontSize: 17,
    fontFamily: "yakan",
  },
  loader: {
    marginTop: 100,
  },
  badgeBottom: {
    backgroundColor: COLORS.primary,
    width: 160,
    height: 80,
    position: "absolute",
    bottom: 0,
    right: 0,
    borderTopLeftRadius: 80,
  },
  badgeTop: {
    backgroundColor: COLORS.primary,
    width: 160,
    height: 80,
    position: "absolute",
    top: 0,
    left: 0,
    borderBottomRightRadius: 80,
  },
  retryButton: {
    backgroundColor: "lightgray",
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginTop: 15,
    borderRadius: 8,
  },
  retryButtonText: {
    fontFamily: "yakan",
    color: COLORS.textSecondary,
  },
});
