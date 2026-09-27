import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS } from "../constants/colors";
import { containerStyle, titleTextStyles } from "../constants/styles";
import { AntDesign } from "@expo/vector-icons";
import Input from "../components/inputs/Input";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";
import Checkbox from "expo-checkbox";
import axios from "axios";
import { apiPath } from "../configs/conf";
import { useAuth } from "../contexts/AuthContext";

export default function PersonalInformationScreen() {
  const insets = useSafeAreaInsets();
  const [userName, setUserName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isChecked, setIsChecked] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  //user image URL choosen from user gallery
  const [image, setImage] = useState(null);

  const role = "employer";

  const formData = new FormData();

  // user data for sending to another screen
  const personalInfo = {
    userName,
    phoneNumber,
    email,
    password,
    confirmPassword,
  };

  const submitHandler = async () => {
    if (!isChecked || isLoading) return;
    if (
      userName === "" ||
      phoneNumber === "" ||
      password === "" ||
      password === "" ||
      !image ||
      isChecked === false
    ) {
      Toast.show({
        type: "error",
        text2: "لطفا ورودی های مورد نظر را پر کنید",
        position: "bottom",
        visibilityTime: 4000,
        autoHide: true,
        text2Style: { fontFamily: "yakan", fontSize: 18, textAlign: "right" },
      });
    } else if (confirmPassword !== password) {
      Toast.show({
        type: "error",
        text2: "پسورد وارد شده با تکرار آن مطابقت ندارد",
        position: "bottom",
        visibilityTime: 4000,
        autoHide: true,
        text2Style: { fontFamily: "yakan", fontSize: 18, textAlign: "right" },
      });
    }else if(phoneNumber.length !== 10 || !phoneNumber.startsWith('07')){
      Toast.show({
        type: "error",
        text2: "شماره معتبر نمیاشد",
        position: "bottom",
        visibilityTime: 4000,
        autoHide: true,
        text2Style: { fontFamily: "yakan", fontSize: 18, textAlign: "right" },
      });
    }
     else {
      setIsLoading(true);
      formData.append("name", userName);
      formData.append("phone", phoneNumber);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("role", role);
      formData.append("profileImage", {
        uri : image,
        name : `profileImage${Math.floor(Math.random() * 100)}.jpg`,
        type : 'image/jpeg',
      });

      try {
        const res = await axios.post(`${apiPath}/api/v1/user/signup`, formData);
        if (!res.data.success) {
           Toast.show({
            type: "error",
            text2: res.data.message,
            position: "bottom",
            visibilityTime: 4000,
            autoHide: true,
            text2Style: {
              fontFamily: "yakan",
              fontSize: 18,
              textAlign: "right",
            },
          });
          setIsLoading(false)
          return
        }
        Toast.show({
          type: "success",
          text2: res.data.message,
          position: "bottom",
          visibilityTime: 4000,
          autoHide: true,
          text2Style: { fontFamily: "yakan", fontSize: 18, textAlign: "right" },
        });
        setIsLoading(false);
        navigation.replace('login')
      } catch (err) {
        console.log(err);
      }
    }
  };

  // image picking from user
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.75,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const navigation = useNavigation();

  return (
    <View
      style={[
        styles.container,
        isLoading && { backgroundColor: "rgb(199, 198, 198)" },
      ]}
    >
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backBtn}
      >
        <AntDesign name="left" size={22} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.profileContianer} onPress={pickImage}>
        {image ? (
          <Image style={styles.profileImage} source={{ uri: image }} />
        ) : (
          <AntDesign name="camera" size={30} color={"white"} />
        )}

        <View style={styles.badgeContainer}>
          <AntDesign
            name="camera"
            size={20}
            color={COLORS.textSecondary}
            style={styles.badge}
          />
        </View>
      </TouchableOpacity>

      <Text style={styles.profileTitle}>عکس پروفایل</Text>

      <View style={{ width: "100%", marginTop: 30, gap: 8 }}>
        <Input
          value={userName}
          setValue={setUserName}
          placeHolder="نام کامل"
          icon="person-outline"
          isDropDown={false}
        />
        <Input
          value={phoneNumber}
          setValue={setPhoneNumber}
          placeHolder="شماه موبایل"
          icon="phone"
          isDropDown={false}
        />
        <Input
          value={email}
          setValue={setEmail}
          placeHolder="ایمیل (اختیاری)"
          icon="email"
          isDropDown={false}
        />
        <Input
          value={password}
          setValue={setPassword}
          placeHolder="رمز عبور"
          icon="lock"
          isDropDown={false}
        />
        <Input
          value={confirmPassword}
          setValue={setConfirmPassword}
          placeHolder="تکرار رمز عبور"
          icon="lock"
          isDropDown={false}
        />
      </View>

      <View style={styles.checkBoxContainer}>
        <Checkbox
          style={styles.checkBox}
          value={isChecked}
          onValueChange={setIsChecked}
          color={isChecked ? COLORS.primaryDark : "rgba(190, 26, 4, 1)"}
        />
        <Text
          style={{
            color: COLORS.textSecondary,
            fontFamily: "yakan",
            fontSize: 17,
          }}
        >
          شرایط و قوانین را میپذیرم.
        </Text>
      </View>

      <TouchableOpacity
        onPress={submitHandler}
        disabled={!isChecked || isLoading}
        activeOpacity={isChecked && !isLoading ? 0.75 : 1}
        style={[styles.btn1, (!isChecked || isLoading) && styles.btnDisabled]}
      >
        {isLoading ? (
          <ActivityIndicator color="white" size="small" />
        ) : (
          <Text style={styles.btn1Text}>ثبت نام</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: containerStyle.paddingHorizontal,
    paddingVertical: containerStyle.paddingVertical,
    backgroundColor: COLORS.background,
    alignItems: "center",
  },
  profileContianer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#c7d4e4cb",
    justifyContent: "center",
    alignItems: "center",
    marginTop: titleTextStyles.marginTop,
  },
  profileImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: 45,
  },
  badgeContainer: {
    position: "absolute",
    bottom: -2,
    right: 0,
    width: 30,
    height: 30,
    backgroundColor: "#ffffffd3",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  badge: {},
  profileTitle: {
    fontFamily: "yakan",
    marginTop: 20,
    fontWeight: "600",
    fontSize: 17,
  },
  backBtn: {
    position: "absolute",
    left: 17,
    top: 40,
  },
  btn1: {
    width: "100%",
    height: 50,
    borderRadius: 8,
    backgroundColor: COLORS.primaryDark,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 70,
  },
  btnDisabled: {
    backgroundColor: "#D1D5DB",
  },
  btn1Text: {
    fontFamily: "yakan",
    color: COLORS.btnText,
    fontWeight: "600",
    fontSize: 16,
  },
  checkBoxContainer: {
    marginTop: 40,
    flexDirection: "row-reverse",
    gap: 12,
    alignItems: "center",
    alignSelf: "flex-end",
  },
});
