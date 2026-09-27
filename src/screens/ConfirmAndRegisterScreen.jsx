import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS } from "../constants/colors";
import { containerStyle, titleTextStyles } from "../constants/styles";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { Checkbox } from "expo-checkbox";
import { useState } from "react";
import { useWorker } from "../contexts/WorkerInfoContext";
import axios from "axios";
import { apiPath } from "../configs/conf";

export default function ConfirmAndRegisterScreen() {
  const insets = useSafeAreaInsets();
  const {
    userName,
    phoneNumber,
    email,
    province,
    district,
    password,
    image,
    choosenSkills,
    job,
    experience,
    about,
    images,
    setUserName,
    setPhoneNumber,
    setEmail,
    setProvince,
    setDistrict,
    setPassword,
    setImage,
    setChoosenSkills,
    setJobsetExperience,
    setAbout,
    setImages,
  } = useWorker();

  const role = "worker";

  // does the user checks privicy and policy
  const [isChecked, setIsChecked] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const submitHandler = async () => {
    if (!isChecked || isLoading) return;
    if (!isChecked) {
      Toast.show({
        type: "error",
        // text1 : 'خطا',
        text2: "لطفا شرایط و قوانین را بپذرید",
        position: "bottom",
        visibilityTime: 4000,
        autoHide: true,
        // text1Style : {fontFamily : 'yakan', fontSize : 18},
        text2Style: { fontFamily: "yakan", fontSize: 18, textAlign: "right" },
      });
    } else {
      setIsLoading(true);
      // req to the server for storing user information
      const formData = new FormData();
      formData.append("name", userName);
      formData.append("phone", phoneNumber);
      formData.append("email", email);
      formData.append("province", province);
      formData.append("district", district);
      formData.append("password", password);
      formData.append("profileImage", {
        uri: image,
        name: `profileImage${Math.floor(Math.random() * 100)}.jpg`,
        type: "image/jpeg",
      });
      formData.append("job", job);
      formData.append("skills", JSON.stringify(choosenSkills));
      formData.append("expereinceYear", experience);
      formData.append("about", about);
      formData.append("role", role);
      for (let i = 0; i < images.length; i++) {
        formData.append("gallery", {
          uri: images[i],
          name: `image${i}.jpg`,
          type: "image/jpeg",
        });
      }
      try {
        const res = await axios.post(
          `${apiPath}/api/v1/user/signup`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );
        if (!res.data.success)
          return Toast.show({
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
        Toast.show({
          type: "success",
          text2: res.data.message,
          position: "bottom",
          visibilityTime: 4000,
          autoHide: true,
          text2Style: { fontFamily: "yakan", fontSize: 18, textAlign: "right" },
        });
        navigation.replace("login");
          setUserName(''),
          setPhoneNumber('')
          setEmail('')
          setProvince('')
          setDistrict('')
          setPassword('')
          setImage(null)
          setChoosenSkills([])
          setJobsetExperience('')
          setAbout('')
          setImages([])
      } catch (err) {
        console.log(err);
        console.log(err.response?.status);
        console.log(err.response?.data);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const confirmationInfo = [
    { key: "نوع", value: "کارگر" },
    { key: "نام", value: userName },
    { key: "موبایل", value: phoneNumber },
    { key: "شغل", value: job },
    { key: "موقعیت", value: province + " - " + district },
    { key: "ایمیل آدرس", value: email },
  ];

  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backBtn}
      >
        <AntDesign name="left" size={22} />
      </TouchableOpacity>

      <View style={styles.mainContentContainer}>
        <Image
          style={styles.image}
          source={require("../../assets/images/undraw_confirmed_c5lo.png")}
        />
        <Text style={styles.title}>اطلاعات شما</Text>
        <Text style={styles.text}>لطفا اطلاعات زیر را بررسی کنید</Text>

        <View style={styles.confirmationInfoContainer}>
          {confirmationInfo.map((info, index) => (
            <View
              key={index}
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text
                style={{
                  fontSize: 17,
                  fontFamily: "yakan",
                  color: COLORS.textSecondary,
                }}
              >
                {info.value}
              </Text>
              <Text style={{ fontSize: 18, fontFamily: "yakan" }}>
                {info.key}
              </Text>
            </View>
          ))}
        </View>
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
    // alignItems: "center",
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
    alignSelf: "center",
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
  mainContentContainer: {
    justifyContent: "center",
    marginTop: titleTextStyles.marginTop,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: "cover",
    alignSelf: "center",
  },
  title: {
    textAlign: "center",
    fontSize: 20,
    fontFamily: "yakan",
    marginVertical: 10,
  },
  text: {
    color: COLORS.textSecondary,
    textAlign: "center",
    fontFamily: "yakan",
    fontSize: 16,
  },
  confirmationInfoContainer: {
    gap: 14,
  },
  checkBoxContainer: {
    marginTop: 40,
    flexDirection: "row-reverse",
    gap: 12,
    alignItems: "center",
    alignSelf: "flex-end",
  },
});
