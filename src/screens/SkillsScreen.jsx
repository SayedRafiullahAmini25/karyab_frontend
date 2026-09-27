import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Touchable,
  ScrollView,
} from "react-native";
import { COLORS } from "../constants/colors";
import { containerStyle, titleTextStyles } from "../constants/styles";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Picker } from "@react-native-picker/picker";
import Toast from "react-native-toast-message";
import { useWorker } from "../contexts/WorkerInfoContext";
import jobsCategory from "../staticData/jobs";
import Input from "../components/inputs/Input";

// const skills = ["چوش کاری", "رنگ کاری", "نجاری", "لوله کش", "برقی", "سایر"];

export default function SkillsScreen() {
  const insets = useSafeAreaInsets();

  const navigation = useNavigation();
  const [skills, setSkills] = useState(['مهارت اول', 'مهارت دوم','مهارت سوم','مهارت چهرم','مهارت پنجم',])

  const {choosenSkills, setChoosenSkills, job, setJob, experience, setExperience, about, setAbout} = useWorker()

  useEffect(()=> {
    setSkills(job !== '' && jobsCategory.find(j => j.title === job).skills)
  })


  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backBtn}
      >
        <AntDesign name="left" size={22} />
      </TouchableOpacity>

      <View style={{ width: "100%", marginTop: 120, gap: 22 }}>
        <Text style={styles.dropDownINputLabel}>شغل اصلی</Text>
        <View style={styles.dropDownInputContainer}>
          <Picker
            onValueChange={(e)=> {
              setSkills(job !== '' && jobsCategory.find(j => j.title === job).skills)
              setJob(e) 
            }}
            selectedValue={job}
          >
            <Picker.Item
              fontFamily="yakan"
              enabled={false}
              label="انتخاب شغل"
              value="none"
            />
            {
              jobsCategory.map((job, index) => <Picker.Item fontFamily="yakan" key={index} label={job.title} value={job.title} />)
            }
          </Picker>
        </View>
      </View>

      <View style={styles.skillsContainer}>
        <Text style={styles.skillText}>مهارت ها (چند مورد را انتخاب کنید)</Text>
        <View style={styles.badgeContainer}>
          {skills.length > 0 && skills.map((skill, index) => (
            <TouchableOpacity key={index} onPress={()=> setChoosenSkills(prevVal => {
              if(prevVal && prevVal.includes(skill)) {
                 return prevVal.filter(s => s !== skill)
              }else{
               return [...prevVal, skill]
              }
            })}>
              <View style={[styles.skillBadge, choosenSkills.length > 0 && choosenSkills.includes(skill) &&  {backgroundColor : COLORS.primaryDark}]}>
                <Text style={[{ fontFamily: "yakan"}, choosenSkills.length > 0 && choosenSkills.includes(skill) && {color : 'white'}]}>{skill}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>


      <View style={{ width: "100%", marginTop: 30, gap: 22 }}>
        <Text style={styles.dropDownINputLabel}>تجربه کاری</Text>
        <View style={styles.dropDownInputContainer}>
          <Input
            value={experience}
            setValue={setExperience}
            placeHolder="تجربه کاری مثلا (1 سال)"
            icon="work-history"
            isDropDown={false}
            keyboardType='number-pad'
          />
        </View>
      </View>

      <View style={{ width: "100%", marginTop: 20 }}>
        <Text
          style={{
            fontFamily: "yakan",
            fontSize: 16,
            color: COLORS.textSecondary,
            textAlign: "right",
            marginBottom: -12,
          }}
        >
          در باه خودتان
        </Text>
        <View style={styles.aboutContainer}>
          <TextInput
            placeholder="چند خط در باره تجربه و مهارت خود بنویسید ..."
            textAlign="right"
            style={styles.aboutInput}
            multiline={true}
            numberOfLines={6}
            onChangeText={setAbout}
            value={about}
          />
        </View>
      </View>
      <TouchableOpacity
        onPress={() => {
          if(job ==='' || choosenSkills.length === 0 || experience === '' || about === '') {
            Toast.show({
              type : 'error',
              text2 : 'لطفا تمام ورودی ها را پر کنید',
              text2Style : { fontFamily : 'yakan', fontSize : 18, textAlign : 'right'},
              position : 'bottom',
              visibilityTime : 4000,
              autoHide : true
            })
          }else {
            navigation.navigate('workSample')
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
    paddingVertical: 0,
    backgroundColor: COLORS.background,
    alignItems: "center",
  },
  dropDownInputContainer: {
    borderWidth: 2,
    borderRadius: 8,
    borderColor: COLORS.border,
    width: "100%",
    height: 50,
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
  badge: {
    position: "absolute",
    left: 8,
  },
  input: {
    fontFamily: "yakan",
    paddingEnd: 10,
  },

  badge: {},

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
  skillsContainer: {
    gap: 3,
    justifyContent: "center",
    marginTop: 20,
  },
  skillText: {
    fontFamily: "yakan",
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign : 'right'
  },
  badgeContainer: {
    flexDirection: "row",
    gap: 20,
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 12,
  },
  skillBadge: {
    padding: 10,
    backgroundColor: "#c4d1d6a4",
    borderRadius: 16,
  },
  aboutContainer: {
    borderWidth: 2,
    borderRadius: 8,
    borderColor: COLORS.border,
    width: "100%",
    height: 100,
    // justifyContent: "center",
    marginTop: 20,
    // alignItems : 'center'
  },
  aboutInput: {
    fontFamily: "yakan",
    paddingEnd: 10,
    height: "100%",
    borderRadius: 8,
  },
});
