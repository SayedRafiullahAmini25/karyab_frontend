import React, { useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

const GREEN = "#008F4C";

export default function SettingsScreen({ navigation }) {
  const [notifications, setNotifications] = useState(true);
  const [messages, setMessages] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()}>
          <Ionicons
            name="arrow-forward"
            size={23}
            color="#222"
          />
        </TouchableOpacity>

        <Text style={styles.title}>
          تنظیمات
        </Text>

        <View style={{ width: 23 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        {/* Account */}

        <Text style={styles.sectionTitle}>
          حساب کاربری
        </Text>

        <View style={styles.card}>
          <SettingItem
            icon="person-outline"
            title="اطلاعات حساب"
            subtitle="نام، شماره موبایل و ایمیل"
          />

          <SettingItem
            icon="lock-closed-outline"
            title="تغییر رمز عبور"
          />

          <SettingItem
            icon="shield-checkmark-outline"
            title="امنیت حساب"
          />
        </View>

        {/* Notifications */}

        <Text style={styles.sectionTitle}>
          اعلان ها
        </Text>

        <View style={styles.card}>
          <SwitchItem
            icon="notifications-outline"
            title="اعلان ها"
            value={notifications}
            onPress={() =>
              setNotifications(!notifications)
            }
          />

          <SwitchItem
            icon="chatbubble-outline"
            title="پیام های جدید"
            value={messages}
            onPress={() =>
              setMessages(!messages)
            }
          />
        </View>

        {/* General */}

        <Text style={styles.sectionTitle}>
          عمومی
        </Text>

        <View style={styles.card}>
          <SettingItem
            icon="language-outline"
            title="زبان"
            value="فارسی"
          />

          <SettingItem
            icon="information-circle-outline"
            title="درباره کاریاب"
          />

          <SettingItem
            icon="document-text-outline"
            title="شرایط استفاده"
          />

          <SettingItem
            icon="shield-outline"
            title="حریم خصوصی"
          />
        </View>

        {/* Logout */}

        <TouchableOpacity style={styles.logout}>
          <Ionicons
            name="log-out-outline"
            size={21}
            color="#D9534F"
          />

          <Text style={styles.logoutText}>
            خروج از حساب
          </Text>
        </TouchableOpacity>

        <Text style={styles.version}>
          کاریاب — نسخه 1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function SettingItem({
  icon,
  title,
  subtitle,
  value,
}) {
  return (
    <TouchableOpacity style={styles.item}>
      <Ionicons
        name="chevron-back"
        size={17}
        color="#aaa"
      />

      <View style={styles.itemRight}>
        <Ionicons
          name={icon}
          size={20}
          color="#555"
        />

        <View style={styles.itemText}>
          <Text style={styles.itemTitle}>
            {title}
          </Text>

          {subtitle && (
            <Text style={styles.subtitle}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>

      {value && (
        <Text style={styles.value}>
          {value}
        </Text>
      )}
    </TouchableOpacity>
  );
}

function SwitchItem({
  icon,
  title,
  value,
  onPress,
}) {
  return (
    <TouchableOpacity
      style={styles.item}
      onPress={onPress}
    >
      <View
        style={[
          styles.switch,
          value && styles.switchActive,
        ]}
      >
        <View
          style={[
            styles.switchCircle,
            value && styles.switchCircleActive,
          ]}
        />
      </View>

      <View style={styles.itemRight}>
        <Ionicons
          name={icon}
          size={20}
          color="#555"
        />

        <Text style={styles.itemTitle}>
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

  header: {
    height: 62,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  title: {
    fontFamily: "yakan",
    fontSize: 16,
    fontWeight: "700",
    color: "#222",
  },

  sectionTitle: {
    fontFamily: "yakan",
    fontSize: 12,
    fontWeight: "700",
    color: "#333",
    textAlign: "right",
    marginHorizontal: 18,
    marginTop: 18,
    marginBottom: 8,
  },

  card: {
    marginHorizontal: 17,
    borderWidth: 1,
    borderColor: "#EAEAEA",
    borderRadius: 12,
    overflow: "hidden",
  },

  item: {
    minHeight: 55,
    paddingHorizontal: 13,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F1F1",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  itemRight: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 11,
    flex: 1,
    justifyContent: "flex-start",
  },

  itemText: {
    alignItems: "flex-end",
  },

  itemTitle: {
    fontFamily: "yakan",
    fontSize: 11,
    color: "#333",
  },

  subtitle: {
    fontFamily: "yakan",
    fontSize: 8,
    color: "#999",
    marginTop: 3,
  },

  value: {
    fontFamily: "yakan",
    fontSize: 9,
    color: "#999",
  },

  switch: {
    width: 43,
    height: 24,
    borderRadius: 15,
    backgroundColor: "#ddd",
    justifyContent: "center",
    paddingHorizontal: 3,
  },

  switchActive: {
    backgroundColor: GREEN,
  },

  switchCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#fff",
    alignSelf: "flex-start",
  },

  switchCircleActive: {
    alignSelf: "flex-end",
  },

  logout: {
    marginHorizontal: 17,
    marginTop: 25,
    height: 50,
    borderWidth: 1,
    borderColor: "#F0D5D5",
    borderRadius: 11,
    flexDirection: "row-reverse",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },

  logoutText: {
    fontFamily: "yakan",
    color: "#D9534F",
    fontSize: 12,
  },

  version: {
    fontFamily: "yakan",
    textAlign: "center",
    color: "#aaa",
    fontSize: 8,
    marginVertical: 25,
  },
});