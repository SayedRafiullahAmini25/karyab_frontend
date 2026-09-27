import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
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
import { useWorker } from "../contexts/WorkerInfoContext";

export default function PersonalInformationScreen() {
  const insets = useSafeAreaInsets();

  const {
    setUserName, setPhoneNumber, setEmail, setProvince, setDistrict, setPassword, setImage,
    userName, phoneNumber, email, province, district, password, image
  } = useWorker()

  // image picking from user
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const navigation = useNavigation();

  return (
    <View style={styles.container}>
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
          type='telephoneNumber'
        />
        <Input
          value={email}
          setValue={setEmail}
          placeHolder="ایمیل (اختیاری)"
          icon="email"
          isDropDown={false}
          type='emailAddress'
        />
        <Input
          value={province}
          setValue={setProvince}
          placeHolder="ولایت"
          icon="location-on"
          isDropDown={false}
        />
        <Input
          value={district}
          setValue={setDistrict}
          placeHolder="ولسوالی / شهر"
          icon="location-city"
          isDropDown={false}
        />
        <Input
          value={password}
          setValue={setPassword}
          placeHolder="رمز عبور"
          icon="lock"
          isSecret={true}
        />
      </View>

      <TouchableOpacity
        onPress={() => {
          if (
            userName === "" ||
            phoneNumber === "" ||
            province === "" ||
            district === "" ||
            password === "" ||
            !image
          ) {
            Toast.show({
              type : 'error',
              // text1 : 'خطا',
              text2 : 'لطفا ورودی های مورد نظر را پر کنید',
              position : 'bottom',
              visibilityTime : 4000,
              autoHide : true,
              // text1Style : {fontFamily : 'yakan', fontSize : 18},
              text2Style : {fontFamily : 'yakan', fontSize : 18, textAlign : 'right'}
            })
          }else if(phoneNumber.length !== 10 || !phoneNumber.startsWith('07')){
            Toast.show({
              type : 'error',
              // text1 : 'خطا',
              text2 : 'شماره موبایل معتبر نمیباشد',
              position : 'bottom',
              visibilityTime : 4000,
              autoHide : true,
              // text1Style : {fontFamily : 'yakan', fontSize : 18},
              text2Style : {fontFamily : 'yakan', fontSize : 18, textAlign : 'right'}
            })
          }
           else {
            navigation.navigate("skills");
          }
        }}
        style={[styles.btn1, { bottom: insets.bottom + 20 }]}
      >
        <Text style={styles.btn1Text}>ادامه</Text>
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
  btn1Text: {
    fontFamily: "yakan",
    color: COLORS.btnText,
    fontWeight: "600",
    fontSize: 16,
  },
});
