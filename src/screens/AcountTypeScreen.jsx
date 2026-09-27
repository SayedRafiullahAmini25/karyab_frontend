import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../constants/colors";
import { containerStyle, titleTextStyles } from "../constants/styles";
import { useNavigation } from "@react-navigation/native";

import {
  AntDesign,
  FontAwesome,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { act, useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import { useAuth } from "../contexts/AuthContext";

const accountTypes = [
  {
    selected: "worker",
    title: "کارگر هستم",
    text: "خدمات خود را ارایه میدهم و دریافت میکنم",
    icon: "engineering",
  },
  {
    selected: "employer",
    title: "کارفرما هستم",
    text: "خدماتبه دنبال کارگر میگردم, به کارگر نیاز دارم",
    icon: "work-outline",
  },
];

export default function AccoutTypeScreen() {
  const [choosenAccountType, setChoosenAccountType] = useState("");
  const navigation = useNavigation();

  const {isLogin}  = useAuth()
  useEffect(() => {
    isLogin && navigation.replace("MainTab");
  });

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>نوعیت حساب</Text>
      <Text style={styles.askText}>
        شما به عنوان چی کسی میخواهید ثبت نام کنید؟
      </Text>
      <View style={{ gap: 8, width: "100%" }}>
        {accountTypes.map((accType, index) => (
          <TouchableOpacity
            onPress={() => setChoosenAccountType(accType.selected)}
            key={index}
          >
            <AccountTypeCard
              key={index}
              title={accType.title}
              text={accType.text}
              icon={accType.icon}
              isSelected={choosenAccountType === accType.selected}
            />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        onPress={() => {
          if(choosenAccountType === 'worker') {
            navigation.navigate('personalInformation')
          }else if(choosenAccountType === 'employer') {
            navigation.navigate('signup')
          }else {
            Toast.show({
              text2 : 'لطفا نوعیت حساب خود را انتخاب کنید',
              visibilityTime : 4000,
              text2Style : {fontFamily : 'yakan', fontSize : 17, textAlign : 'right'},
              autoHide : true,
              position : 'bottom',
              type : 'info'
            })
          }
        }}
        style={styles.btn1}
      >
        <Text style={styles.btn1Text}>شروع کنید</Text>
      </TouchableOpacity>
    </View>
  );
}

const AccountTypeCard = ({ title, text, icon, isSelected }) => {
  return (
    <View
      style={[
        styles.cardContainer,
        isSelected && {
          backgroundColor: COLORS.primaryLight,
          borderColor: COLORS.primary,
        },
      ]}
    >
      {isSelected && (
        <View style={styles.badge}>
          <MaterialIcons
            name="check-circle"
            size={26}
            color={COLORS.primaryDark}
          />
        </View>
      )}
      <MaterialIcons name={icon} size={100} color={COLORS.primaryDark} />
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardText}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: containerStyle.paddingHorizontal,
    paddingVertical: containerStyle.paddingVertical,
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: "center",
  },
  titleText: {
    marginTop: titleTextStyles.marginTop,
    fontFamily: "lalezar",
    fontSize: titleTextStyles.fontSize,
  },
  askText: {
    marginVertical: 20,
    fontFamily: "yakan",
    fontWeight: "600",
    fontSize: 17,
    color: COLORS.textSecondary,
  },
  cardContainer: {
    width: "100%",
    // height: 200,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    alignItems: "center",
    // paddingVertical: 12,
    position: "relative",
  },
  cardTitle: {
    fontFamily: "lalezar",
    fontSize: 20,
  },
  cardText: {
    marginVertical: 18,
    fontFamily: "yakan",
    color: COLORS.textSecondary,
    fontSize: 17,
    width: "60%",
    textAlign: "center",
    lineHeight: 25,
  },
  badge: {
    position: "absolute",
    right: 12,
    top: 20,
  },
  btn1: {
    position : 'absolute',
    bottom : 70,
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
});
