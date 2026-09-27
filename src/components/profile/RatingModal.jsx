import React, { useEffect, useMemo, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const GREEN = "#008F4C";

export default function RatingModal({ visible, workerName, submitting, onClose, onSubmit }) {
  const [rating, setRating] = useState(5);

  useEffect(() => {
    if (visible) setRating(5);
  }, [visible]);

  const ratingLabel = useMemo(() => {
    if (rating >= 4.5) return "عالی";
    if (rating >= 3.5) return "خوب";
    if (rating >= 2.5) return "متوسط";
    if (rating >= 1.5) return "ضعیف";
    return "خیلی ضعیف";
  }, [rating]);

  const setHalfRating = (index, side) => {
    const value = side === "left" ? index + 0.5 : index + 1;
    setRating(value);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        <View style={styles.modal}>
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons name="star-face" size={31} color="#D79A00" />
          </View>

          <TouchableOpacity onPress={onClose} style={styles.closeButton} disabled={submitting}>
            <Ionicons name="close" size={21} color="#555" />
          </TouchableOpacity>

          <Text style={styles.title}>امتیاز به کارگر</Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            تجربه کار با {workerName || "این کارگر"} را ثبت کنید
          </Text>

          <View style={styles.starsRow}>
            {[0, 1, 2, 3, 4].map((index) => {
              const full = rating >= index + 1;
              const half = rating === index + 0.5;

              return (
                <View key={index} style={styles.starWrap}>
                  <TouchableOpacity
                    style={styles.starTouch}
                    onPress={() => setHalfRating(index, "right")}
                    onLongPress={() => setHalfRating(index, "left")}
                    disabled={submitting}
                  >
                    <Ionicons
                      name={full ? "star" : half ? "star-half" : "star-outline"}
                      size={39}
                      color="#E1A900"
                    />
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>

          <View style={styles.ratingValueBox}>
            <Text style={styles.ratingValue}>{rating.toFixed(1)}</Text>
            <Text style={styles.ratingLabel}>{ratingLabel}</Text>
          </View>

          <TouchableOpacity
            style={[styles.submitButton, submitting && styles.disabled]}
            onPress={() => onSubmit?.(rating)}
            disabled={submitting}
            activeOpacity={0.85}
          >
            {submitting ? (
              <Text style={styles.submitText}>در حال ثبت...</Text>
            ) : (
              <>
                <Text style={styles.submitText}>ثبت امتیاز</Text>
                <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(20, 30, 25, .48)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modal: {
    width: "100%",
    maxWidth: 410,
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 22,
    alignItems: "center",
  },
  iconCircle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: "#FFF7DF",
    alignItems: "center",
    justifyContent: "center",
    marginTop: -2,
  },
  closeButton: {
    position: "absolute",
    top: 14,
    left: 14,
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: "#F4F6F5",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontFamily: "yakan",
    fontSize: 18,
    color: "#202B25",
    marginTop: 13,
  },
  subtitle: {
    fontFamily: "yakan",
    fontSize: 12,
    color: "#7A857F",
    marginTop: 5,
    maxWidth: "90%",
    textAlign: "center",
  },
  starsRow: {
    flexDirection: "row-reverse",
    justifyContent: "center",
    marginTop: 19,
    gap: 3,
  },
  starWrap: {
    alignItems: "center",
  },
  starTouch: {
    padding: 2,
  },
  ratingValueBox: {
    marginTop: 11,
    alignItems: "center",
  },
  ratingValue: {
    fontFamily: "yakan",
    fontSize: 25,
    color: GREEN,
  },
  ratingLabel: {
    fontFamily: "yakan",
    fontSize: 11,
    color: "#78847E",
    marginTop: -2,
  },
  submitButton: {
    width: "100%",
    height: 46,
    borderRadius: 13,
    backgroundColor: GREEN,
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    marginTop: 18,
  },
  submitText: {
    fontFamily: "yakan",
    fontSize: 13,
    color: "#fff",
  },
  disabled: {
    opacity: 0.65,
  },
});
