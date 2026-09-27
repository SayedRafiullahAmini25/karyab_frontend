import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Input from "../components/inputs/Input";
import { containerStyle, MainTabTitleTextStyle } from "../constants/styles";
import { COLORS } from "../constants/colors";
import { Picker } from "@react-native-picker/picker";
import jobsCategory from "../staticData/jobs";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import axios from "axios";
import { apiPath } from "../configs/conf";
import Toast from "react-native-toast-message";
import { useAuth } from "../contexts/AuthContext";
import { useAppContext } from "../contexts/AppContext";
import { useNavigation } from "@react-navigation/native";
import { userInternetChecker } from "../contexts/InternetChecker";

export default function AddWorkScreen() {
  const [workTitle, setWorkTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [salary, setSalary] = useState("");
  const [isLoadin, setIsLoading] = useState(false);
  const {hasInternet} = userInternetChecker()
  const { token } = useAuth();
  const { getListOfJobs } = useAppContext();

  const navigation = useNavigation();

  const resetStates = () => {
    setWorkTitle("");
    setCategory("");
    setDescription("");
    setAddress("");
    setSalary("");
  };

  const jobInformation = {
    title: workTitle,
    description: description,
    category: category,
    location: address,
    salary: salary,
  };

  const addWorkHandler = async () => {
    setIsLoading(true);
    try {
      const res = await axios.post(
        `${apiPath}/api/v1/job/create`,
        jobInformation,
        { headers: { token: token } },
      );
      if (!res.data.success)
        return Toast.show({
          type: "error",
          text2: res.data.message,
          position: "bottom",
          visibilityTime: 4000,
          autoHide: true,
          text2Style: { fontFamily: "yakan", fontSize: 18, textAlign: "right" },
        });

      getListOfJobs();
      Toast.show({
        type: "success",
        text2: res.data.message,
        position: "bottom",
        visibilityTime: 4000,
        autoHide: true,
        text2Style: { fontFamily: "yakan", fontSize: 18, textAlign: "right" },
      });
      resetStates();
      navigation.navigate("jobList");
    } catch (err) {
      Toast.show({
        type: "error",
        text2: "خطا در ارسال اطلاعات",
        position: "bottom",
        visibilityTime: 4000,
        autoHide: true,
        text2Style: { fontFamily: "yakan", fontSize: 18, textAlign: "right" },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={MainTabTitleTextStyle}>ثبت کار جدید</Text>
      <View>
        <Text style={styles.label}>عنوان کار</Text>
        <Input
          value={workTitle}
          setValue={setWorkTitle}
          placeHolder="مثال : نیاز به نجار ماهر"
        />
      </View>
      <View style={{ width: "100%", marginTop: 0, gap: 0 }}>
        <Text style={styles.dropDownINputLabel}>دسته بندی</Text>
        <View style={styles.dropDownInputContainer}>
          <Picker onValueChange={setCategory} selectedValue={category}>
            <Picker.Item
              fontFamily="yakan"
              enabled={false}
              label="انتخاب دسته بندی"
              value="none"
            />
            {jobsCategory.map((job, index) => (
              <Picker.Item
                fontFamily="yakan"
                key={index}
                label={job.title}
                value={job.title}
              />
            ))}
          </Picker>
        </View>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>توضیحات</Text>
        <View style={styles.aboutContainer}>
          <TextInput
            placeholder="جزییات کار را بنویسید"
            textAlign="right"
            style={styles.aboutInput}
            multiline={true}
            numberOfLines={6}
            onChangeText={setDescription}
            value={description}
          />
        </View>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>موقعیت</Text>
        <Input
          value={address}
          setValue={setAddress}
          placeHolder="آدرس کامل (ولابت , ولسوالی , ناحیه)"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>بودجه</Text>
        <Input
          value={salary}
          setValue={setSalary}
          placeHolder="مثال : 5000 افغانی"
          keyboardType="number-pad"
        />
      </View>

      <TouchableOpacity style={styles.btn1} onPress={addWorkHandler}>
        {isLoadin ? (
          <ActivityIndicator size="small" color='#fff' />
        ) : (
          <Text style={styles.btn1Text}>ثبت کار</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: containerStyle.paddingVertical,
    paddingHorizontal: containerStyle.paddingHorizontal,
    justifyContent: "center",
  },
  dropDownInputContainer: {
    borderWidth: 2,
    borderRadius: 8,
    borderColor: COLORS.border,
    width: "100%",
    height: 60,
    justifyContent: "center",
    // alignItems : 'center'
  },
  dropDownINputLabel: {
    textAlign: "right",
    fontFamily: "yakan",
    fontSize: 16,
    marginBottom: -12,
    color: COLORS.textSecondary,
  },
  label: {
    textAlign: "right",
    fontFamily: "yakan",
    fontSize: 15,
    color: COLORS.textSecondary,
    marginVertical: 5,
  },
  title: {
    textAlign: "center",
    marginVertical: 10,
    fontFamily: "yakan",
    fontSize: 22,
    color: "#000000c0",
  },
  inputContainer: {
    marginTop: 10,
  },
  aboutContainer: {
    borderWidth: 2,
    borderRadius: 8,
    borderColor: COLORS.border,
    width: "100%",
    height: 100,
    // justifyContent: "center",
    // marginTop: 20,
    // alignItems : 'center'
  },
  aboutInput: {
    fontFamily: "yakan",
    paddingEnd: 10,
    height: "100%",
    borderRadius: 8,
  },
  btn1: {
    width: "100%",
    height: 50,
    borderRadius: 8,
    backgroundColor: COLORS.primaryDark,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: -20,
    alignSelf: "center",
  },
  btn1Text: {
    fontFamily: "yakan",
    color: COLORS.btnText,
    fontWeight: "600",
    fontSize: 16,
  },
});
