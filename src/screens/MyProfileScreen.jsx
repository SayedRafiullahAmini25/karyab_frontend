import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../constants/colors";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { apiPath, profileImageURL } from "../configs/conf";
import { changeRoleToPersion } from "../utils";
import { userInternetChecker } from "../contexts/InternetChecker";

const GREEN = COLORS.primaryDark;
const BORDER = "#EEEEEE";

export default function MyProfileScreen() {
  const navigation = useNavigation();
  const { setToken, setIsLogin, token } = useAuth();
  const [loggedInUser, setLoggedInUser] = useState();
  const [logginOut, setLoggingOut] = useState(false);
  const {hasInternet} = userInternetChecker()

    !hasInternet && alert("لطفا انترنت خود را وصل کنید");


  const getLoggedInUser = async () => {
    try {
      const res = await axios.post(
        `${apiPath}/api/v1/user/getLoggedInUser`,
        {},
        {
          headers: { token: token },
        },
      );
      setLoggedInUser(res.data.loggedInUser);
    } catch (err) {
      Toast.show({
        type: "error",
        text2: "خطای رخ داده است",
        position: "bottom",
        visibilityTime: 4000,
        autoHide: true,
        text2Style: { fontFamily: "yakan", fontSize: 18, textAlign: "right" },
      });
    }
  };

  useEffect(() => {
    getLoggedInUser();
  }, []);

  return logginOut ? (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="rgb(185, 52, 11)" />
      <Text style={{ marginTop: 12 }}>در حال خروج</Text>
    </View>
  ) : (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>پروفایل من</Text>
        </View>

        {/* User */}
        <View style={styles.userSection}>
          <Image
            source={{
              uri: loggedInUser?.profileImage
            }}
            style={styles.avatar}
          />

          <View style={styles.userInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{loggedInUser?.name}</Text>

              <MaterialCommunityIcons
                name="check-decagram"
                size={17}
                color={GREEN}
              />
            </View>

            <Text style={styles.role}>
              {changeRoleToPersion(loggedInUser?.role)}
            </Text>
          </View>
        </View>

        {/* Menu */}
        <View style={styles.menu}>
          <MenuItem
            icon="person-outline"
            title="مشاهده پروفایل عمومی"
            onPress={() => {
              if (loggedInUser?.role === "worker")
                return navigation.navigate("workerProflile", {
                  workerId: loggedInUser?._id,
                });
              navigation.navigate("employerProfile", { user: loggedInUser });
            }}
          />

          <MenuItem
            icon="create-outline"
            title="ویرایش پروفایل"
            onPress={() => alert("این قابلیت در نسخه های بعدی اضافه خواهد شد")}
          />

          <MenuItem
            icon="briefcase-outline"
            title="کارهای من"
            onPress={() => navigation.navigate("myJobs")}
          />

          <MenuItem
            onPress={() => alert("این قابلیت در نسخه های بعدی اضافه خواهد شد")}
            icon="settings-outline"
            title="تنظیمات"
          />

          <MenuItem
            icon="log-out-outline"
            title="خروج"
            danger
            onPress={() =>
              AsyncStorage.clear().then(() => {
                setLoggingOut(true);
                setToken(null);
                setIsLogin(false);
                setTimeout(() => {
                  setLoggingOut(false);
                  navigation.replace("splash");
                }, 2000);
              })
            }
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* Menu Item */

function MenuItem({ icon, title, onPress, danger }) {
  return (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.menuLeft}>
        <Ionicons name="chevron-back" size={17} color="#aaa" />
      </View>

      <View style={styles.menuRight}>
        <Ionicons name={icon} size={20} color={danger ? "#D9534F" : "#555"} />

        <Text style={[styles.menuText, danger && styles.dangerText]}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  scroll: {
    paddingBottom: 100,
  },

  header: {
    height: 65,
    paddingHorizontal: 20,
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerTitle: {
    fontFamily: "yakan",
    fontSize: 18,
    fontWeight: "600",
    color: "#222",
  },

  userSection: {
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },

  avatar: {
    width: 67,
    height: 67,
    borderRadius: 34,
  },

  userInfo: {
    flex: 1,
    alignItems: "flex-end",
    marginRight: 13,
  },

  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  name: {
    fontFamily: "yakan",
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
  },

  role: {
    fontFamily: "yakan",
    fontSize: 11,
    color: "#777",
    marginTop: 3,
  },

  menu: {
    marginTop: 10,
    paddingHorizontal: 15,
  },

  menuItem: {
    height: 54,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F1F1",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  menuLeft: {
    width: 30,
    alignItems: "flex-start",
  },

  menuRight: {
    flex: 1,
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 12,
  },

  menuText: {
    fontFamily: "yakan",
    fontSize: 12,
    color: "#444",
  },

  dangerText: {
    color: "#D9534F",
  },

  bottomNav: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 74,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: BORDER,
    flexDirection: "row-reverse",
    justifyContent: "space-around",
    alignItems: "center",
  },
});
