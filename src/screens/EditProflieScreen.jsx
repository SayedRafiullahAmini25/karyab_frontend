import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import {SafeAreaView} from 'react-native-safe-area-context'

import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const GREEN = "#008F4C";

export default function EditProfileScreen({ navigation }) {
  const [name, setName] = useState("احمد رضایی");
  const [phone, setPhone] = useState("0700123456");
  const [email, setEmail] = useState("ahmad@gmail.com");
  const [about, setAbout] = useState(
    "من یک کارگر با تجربه هستم و در زمینه کارهای ساختمانی فعالیت دارم."
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* Header */}

        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation?.goBack()}>
            <Ionicons
              name="arrow-back"
              size={23}
              color="#222"
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            ویرایش پروفایل
          </Text>

          <View style={{ width: 23 }} />
        </View>

        {/* Profile Image */}

        <View style={styles.imageSection}>
          <View style={styles.imageWrapper}>
            <Image
              source={{
                uri: "https://i.pravatar.cc/200?img=12",
              }}
              style={styles.profileImage}
            />

            <TouchableOpacity style={styles.camera}>
              <Ionicons
                name="camera"
                size={17}
                color="#fff"
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.changeText}>
            تغییر عکس پروفایل
          </Text>
        </View>

        {/* Form */}

        <Text style={styles.label}>نام کامل</Text>

        <View style={styles.inputBox}>
          <Ionicons
            name="person-outline"
            size={19}
            color="#777"
          />

          <TextInput
            value={name}
            onChangeText={setName}
            style={styles.input}
            textAlign="right"
          />
        </View>

        <Text style={styles.label}>شماره موبایل</Text>

        <View style={styles.inputBox}>
          <Ionicons
            name="phone-portrait-outline"
            size={19}
            color="#777"
          />

          <TextInput
            value={phone}
            onChangeText={setPhone}
            style={styles.input}
            keyboardType="phone-pad"
            textAlign="right"
          />
        </View>

        <Text style={styles.label}>ایمیل</Text>

        <View style={styles.inputBox}>
          <Ionicons
            name="mail-outline"
            size={19}
            color="#777"
          />

          <TextInput
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
            textAlign="right"
          />
        </View>

        {/* Job */}

        <Text style={styles.label}>شغل اصلی</Text>

        <TouchableOpacity style={styles.inputBox}>
          <Ionicons
            name="chevron-down"
            size={19}
            color="#777"
          />

          <Text style={styles.selectText}>
            نجار
          </Text>

          <MaterialCommunityIcons
            name="hammer-wrench"
            size={19}
            color="#777"
          />
        </TouchableOpacity>

        {/* Location */}

        <Text style={styles.label}>ولایت / شهر</Text>

        <TouchableOpacity style={styles.inputBox}>
          <Ionicons
            name="chevron-down"
            size={19}
            color="#777"
          />

          <Text style={styles.selectText}>
            کندز / خان آباد
          </Text>

          <Ionicons
            name="location-outline"
            size={20}
            color="#777"
          />
        </TouchableOpacity>

        {/* About */}

        <Text style={styles.label}>
          درباره من
        </Text>

        <View style={styles.textAreaBox}>
          <TextInput
            value={about}
            onChangeText={setAbout}
            multiline
            textAlign="right"
            textAlignVertical="top"
            style={styles.textArea}
            placeholder="درباره خود بنویسید..."
            placeholderTextColor="#aaa"
          />
        </View>

        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveText}>
            ذخیره تغییرات
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  scroll: {
    paddingBottom: 30,
    paddingHorizontal: 18,
  },

  header: {
    height: 62,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  headerTitle: {
    fontFamily: "yakan",
    fontSize: 16,
    fontWeight: "700",
    color: "#222",
  },

  imageSection: {
    alignItems: "center",
    marginVertical: 15,
  },

  imageWrapper: {
    position: "relative",
  },

  profileImage: {
    width: 92,
    height: 92,
    borderRadius: 46,
  },

  camera: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 31,
    height: 31,
    borderRadius: 16,
    backgroundColor: GREEN,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },

  changeText: {
    fontFamily: "yakan",
    color: GREEN,
    fontSize: 10,
    marginTop: 8,
  },

  label: {
    fontFamily: "yakan",
    fontSize: 11,
    color: "#444",
    textAlign: "right",
    marginTop: 14,
    marginBottom: 6,
  },

  inputBox: {
    height: 48,
    borderWidth: 1,
    borderColor: "#E7E7E7",
    borderRadius: 10,
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingHorizontal: 12,
    gap: 9,
  },

  input: {
    flex: 1,
    fontFamily: "yakan",
    fontSize: 11,
    color: "#333",
  },

  selectText: {
    flex: 1,
    fontFamily: "yakan",
    fontSize: 11,
    color: "#444",
    textAlign: "right",
  },

  textAreaBox: {
    minHeight: 105,
    borderWidth: 1,
    borderColor: "#E7E7E7",
    borderRadius: 10,
    padding: 10,
  },

  textArea: {
    flex: 1,
    fontFamily: "yakan",
    fontSize: 11,
    color: "#444",
    lineHeight: 22,
  },

  saveButton: {
    height: 48,
    backgroundColor: GREEN,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 22,
  },

  saveText: {
    fontFamily: "yakan",
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },
});