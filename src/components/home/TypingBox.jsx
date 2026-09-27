
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";

const GREEN = COLORS.primaryDark;

const messages = [
  "آیا به کارگر ماهر برای کارهایتان نیاز دارید؟",
  "کارگر مناسب کارتان را همین‌جا پیدا کنید",
  "مهارت دارید؟ کار مناسب مهارت‌تان را پیدا کنید",
  "دنبال کار هستید؟ فرصت مناسب خود را پیدا کنید",
  "نجار، برق‌کار یا رنگ‌کار می‌خواهید؟",
  "متخصص مناسب کارتان را پیدا کنید",
  "مهارت‌تان را به فرصت کاری تبدیل کنید",
];

export default function TypingBox({ onPress }) {
  const [index, setIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    let charIndex = 0;

    setDisplayText("");

    const typingTimer = setInterval(() => {
      if (charIndex < messages[index].length) {
        setDisplayText(messages[index].slice(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(typingTimer);

        setTimeout(() => {
          setIndex((prev) => (prev + 1) % messages.length);
        }, 3000);
      }
    }, 55);

    return () => {
      clearInterval(typingTimer);
    };
  }, [index]);

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={styles.container}
    >
      {/* Search Icon */}
      <View style={styles.searchBox}>
        <Ionicons
          name="search"
          size={21}
          color="#fff"
        />
      </View>

      {/* Text */}
      <View style={styles.textContainer}>
        <View style={styles.topRow}>
          <Text style={styles.smallTitle}>
            کاریاب
          </Text>

          <View style={styles.badge}>
            <Ionicons
              name="sparkles"
              size={11}
              color={GREEN}
            />

            <Text style={styles.badgeText}>
              پیشنهاد برای شما
            </Text>
          </View>
        </View>

        <View style={styles.typingContainer}>
          <Text style={styles.typingText}>
            {displayText}
          </Text>

          <View style={styles.cursor} />
        </View>
      </View>

      {/* Arrow */}
      <View style={styles.arrowContainer}>
        <Ionicons
          name="arrow-back"
          size={18}
          color={GREEN}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 76,
    marginVertical: 20,
    marginHorizontal: 18,

    backgroundColor: "#F7FBF8",

    borderRadius: 17,

    borderWidth: 1,
    borderColor: "#DDEDE4",

    flexDirection: "row-reverse",
    alignItems: "center",

    paddingHorizontal: 9,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 7,

    elevation: 2,
  },

  searchBox: {
    width: 46,
    height: 46,

    borderRadius: 14,

    backgroundColor: GREEN,

    alignItems: "center",
    justifyContent: "center",

    marginLeft: 10,
  },

  textContainer: {
    flex: 1,

    paddingHorizontal: 3,

    alignItems: "flex-end",
  },

  topRow: {
    width: "100%",

    flexDirection: "row-reverse",

    alignItems: "center",

    justifyContent: "space-between",

    marginBottom: 3,
  },

  smallTitle: {
    fontFamily: "yakan",

    fontSize: 8,

    color: "#999",
  },

  badge: {
    flexDirection: "row-reverse",

    alignItems: "center",

    backgroundColor: "#EAF7F0",

    paddingHorizontal: 7,
    paddingVertical: 3,

    borderRadius: 7,

    gap: 3,
  },

  badgeText: {
    fontFamily: "yakan",

    fontSize: 7,

    color: GREEN,
  },

  typingContainer: {
    width: "100%",

    flexDirection: "row-reverse",

    alignItems: "center",

    minHeight: 28,
  },

  typingText: {
    fontFamily: "yakan",

    fontSize: 11,

    lineHeight: 22,

    color: "#222",

    textAlign: "right",
  },

  cursor: {
    width: 2,

    height: 16,

    backgroundColor: GREEN,

    marginRight: 3,

    borderRadius: 2,
  },

  arrowContainer: {
    width: 30,

    alignItems: "center",
    justifyContent: "center",

    marginRight: 4,
  },
});
