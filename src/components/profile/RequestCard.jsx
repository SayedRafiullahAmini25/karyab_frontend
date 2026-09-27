import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { apiPath } from "../../configs/conf";

const GREEN = "#008F4C";

export default function RequestCard({
  item,
  onApprove,
  onReject,
  navigations,
  setModalVisible
}) {
  const isPending = item.status === "pending";
  const isApproved = item.status === "accept";
  const isRejected = item.status === "rejected";

  return (
    <TouchableOpacity
      onPress={()=> {
        navigations.navigate('workerProflile', {workerId : item?.worker._id})
        setModalVisible(false)
      }}
      style={[
        styles.card,

        isApproved && styles.approvedCard,
        isRejected && styles.rejectedCard,
      ]}
    >
      {/* Status */}
      {!isPending && (
        <View
          style={[
            styles.statusBanner,
            isApproved
              ? styles.approvedBanner
              : styles.rejectedBanner,
          ]}
        >
          <Ionicons
            name={
              isApproved
                ? "checkmark-circle"
                : "close-circle"
            }
            size={17}
            color={
              isApproved
                ? GREEN
                : "#D64545"
            }
          />

          <Text
            style={[
              styles.statusText,
              isApproved
                ? styles.approvedText
                : styles.rejectedText,
            ]}
          >
            {isApproved
              ? "درخواست تأیید شد"
              : "درخواست رد شد"}
          </Text>
        </View>
      )}

      {/* User */}
      <View style={styles.top}>
        <Image
          source={{ uri:item?.worker.profileImage}}
          style={styles.avatar}
        />

        <View style={styles.userInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>
              {item?.worker.name}
            </Text>

            {item.verified && (
              <MaterialCommunityIcons
                name="check-decagram"
                size={17}
                color={GREEN}
              />
            )}
          </View>

          <Text style={styles.job}>
            {item?.worker.job}
          </Text>
        </View>

        <View style={styles.rating}>
          <Ionicons
            name="star"
            size={14}
            color="#F4B400"
          />

          <Text style={styles.ratingText}>
            {item?.worker.rate}
          </Text>
        </View>
      </View>

      {/* Details */}
      <View style={styles.details}>
        <View style={styles.detail}>
          <Ionicons
            name="location-outline"
            size={16}
            color="#777"
          />

          <Text style={styles.detailText}>
            {item?.worker.province} , {item?.worker.district}
          </Text>
        </View>

        <View style={styles.detail}>
          <MaterialCommunityIcons
            name="briefcase-outline"
            size={16}
            color="#777"
          />

          <Text style={styles.detailText}>
            {item?.worker.expereinceYear} سال
          </Text>
        </View>
      </View>

      {/* Actions */}
      {isPending && (
        <View style={styles.actions}>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.rejectButton}
            onPress={() => onReject?.(item)}
          >
            <Ionicons
              name="close-circle-outline"
              size={19}
              color="#D64545"
            />

            <Text style={styles.rejectText}>
              رد درخواست
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.approveButton}
            onPress={() => onApprove?.(item)}
          >
            <Ionicons
              name="checkmark-circle-outline"
              size={19}
              color="#fff"
            />

            <Text style={styles.approveText}>
              تأیید درخواست
            </Text>
          </TouchableOpacity>

        </View>
      )}

      {/* Approved message */}
      {isApproved && (
        <View style={styles.resultBox}>
          <Ionicons
            name="checkmark-circle"
            size={20}
            color={GREEN}
          />

          <Text style={styles.resultText}>
            این کارگر برای این کار انتخاب شده است
          </Text>
        </View>
      )}

      {/* Rejected message */}
      {isRejected && (
        <View style={styles.rejectedResultBox}>
          <Ionicons
            name="close-circle"
            size={20}
            color="#D64545"
          />

          <Text style={styles.rejectedResultText}>
            این درخواست رد شده است
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}



const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 17,
    padding: 14,
    marginBottom: 12,

    borderWidth: 1,
    borderColor: "#E1EAE5",
  },

  approvedCard: {
    borderColor: "#CBE8D8",
    backgroundColor: "#FCFFFD",
  },

  rejectedCard: {
    borderColor: "#F0D5D5",
    backgroundColor: "#FFFDFD",
  },

  // Status

  statusBanner: {
    flexDirection: "row-reverse",
    alignItems: "center",
    alignSelf: "flex-start",

    paddingHorizontal: 9,
    paddingVertical: 5,

    borderRadius: 8,

    marginBottom: 12,
  },

  approvedBanner: {
    backgroundColor: "#EAF7F0",
  },

  rejectedBanner: {
    backgroundColor: "#FFF0F0",
  },

  statusText: {
    fontFamily: "yakan",
    fontSize: 10,
    marginRight: 5,
  },

  approvedText: {
    color: GREEN,
  },

  rejectedText: {
    color: "#D64545",
  },

  // User

  top: {
    flexDirection: "row-reverse",
    alignItems: "center",
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
    marginLeft: 10,
  },

  userInfo: {
    flex: 1,
    alignItems: "flex-end",
  },

  nameRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
  },

  name: {
    fontFamily: "yakan",
    fontSize: 14,
    color: "#202B25",
    marginLeft: 5,
  },

  job: {
    fontFamily: "yakan",
    fontSize: 11,
    color: "#7A857F",
    marginTop: 2,
  },

  rating: {
    flexDirection: "row",
    alignItems: "center",

    backgroundColor: "#FFF8E5",

    paddingHorizontal: 7,
    paddingVertical: 5,

    borderRadius: 8,
  },

  ratingText: {
    fontFamily: "yakan",
    fontSize: 11,
    color: "#765F20",
    marginLeft: 3,
  },

  // Details

  details: {
    flexDirection: "row-reverse",

    marginTop: 12,
    paddingTop: 10,

    borderTopWidth: 1,
    borderTopColor: "#EEF2EF",
  },

  detail: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginLeft: 16,
  },

  detailText: {
    fontFamily: "yakan",
    fontSize: 10,
    color: "#737C77",
    marginRight: 4,
  },

  // Buttons

  actions: {
    flexDirection: "row-reverse",
    gap: 8,
    marginTop: 13,
  },

  rejectButton: {
    flex: 1,

    height: 42,

    borderRadius: 12,

    backgroundColor: "#FFF4F4",
    borderWidth: 1,
    borderColor: "#F2D6D6",

    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
  },

  rejectText: {
    fontFamily: "yakan",
    color: "#D64545",
    fontSize: 12,
    marginRight: 6,
  },

  approveButton: {
    flex: 1.2,

    height: 42,

    borderRadius: 12,

    backgroundColor: GREEN,

    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
  },

  approveText: {
    fontFamily: "yakan",
    color: "#fff",
    fontSize: 12,
    marginRight: 6,
  },

  // Result

  resultBox: {
    marginTop: 13,

    padding: 10,

    borderRadius: 11,

    backgroundColor: "#EAF7F0",

    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
  },

  resultText: {
    fontFamily: "yakan",
    fontSize: 11,
    color: GREEN,
    marginRight: 6,
  },

  rejectedResultBox: {
    marginTop: 13,

    padding: 10,

    borderRadius: 11,

    backgroundColor: "#FFF3F3",

    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
  },

  rejectedResultText: {
    fontFamily: "yakan",
    fontSize: 11,
    color: "#D64545",
    marginRight: 6,
  },
});