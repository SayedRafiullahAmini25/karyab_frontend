import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import Input from "../components/inputs/Input";
import { useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { containerStyle } from "../constants/styles";
import { COLORS } from "../constants/colors";
import Toast from "react-native-toast-message";

export default function LocationScreen() {
  const insets = useSafeAreaInsets();
  const {
    params: {
      userName,
      phoneNumber,
      email,
      province,
      district,
      image,
      choosenSkills,
      job,
      experience,
      about,
    },
  } = useRoute();
  const navigation = useNavigation();

  const userInfo = {
    userName,
    phoneNumber,
    email,
    province,
    district,
    image,
    choosenSkills,
    job,
    experience,
    about,
    address
  };

  const [address, setAddress] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backBtn}
      >
        <AntDesign name="left" size={22} />
      </TouchableOpacity>

      <View>
        <Text
          style={{
            textAlign: "right",
            fontFamily: "yakan",
            fontSize: 17,
            marginBottom: 12,
          }}
        >
          موفعیت کاری شما
        </Text>
        <Input
          value={address}
          setValue={setAddress}
          placeHolder="آدرس دقیق خود را وارد کنید..."
          icon="add-location-alt"
          isDropDown={false}
        />
      </View>

      <TouchableOpacity
        onPress={() => {
          if (address === "") {
            Toast.show({
              type: "error",
              // text1 : 'خطا',
              text2: "لطفا ورودی های مورد نظر را پر کنید",
              position: "bottom",
              visibilityTime: 4000,
              autoHide: true,
              // text1Style : {fontFamily : 'yakan', fontSize : 18},
              text2Style: {
                fontFamily: "yakan",
                fontSize: 18,
                textAlign: "right",
              },
            });
          } else {
            navigation.navigate("workSample", userInfo);
          }
        }}
        style={[styles.btn1, { bottom: insets.bottom + 20 }]}
      >
        <Text style={styles.btn1Text}>ادامه</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: containerStyle.paddingHorizontal,
    paddingVertical: containerStyle.paddingVertical,
  },
  backBtn: {
    marginBottom: 66,
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
