import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import {SafeAreaView} from 'react-native-safe-area-context'
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import SinglePageHeader from "../components/App/SinglePageHeader";
import { useNavigation, useRoute } from "@react-navigation/native";
import { COLORS } from "../constants/colors";
import { changeReqStatusToPersion } from "../utils";
import { apiPath, profileImageURL } from "../configs/conf";
const GREEN = COLORS.primaryDark;

export default function RequestsScreen() {
  const {params : {applications, job}} = useRoute()
  const navigation = useNavigation()
  const application = applications[0]


  return (
    <SafeAreaView style={styles.container}>

      <SinglePageHeader headerTitle='درخواست ها' navigation={navigation}/>
      {/* Job Summary */}
      <View style={styles.jobSummary}>
        <View style={styles.summaryIcon}>
          <MaterialCommunityIcons
            name="hammer-wrench"
            size={23}
            color={GREEN}
          />
        </View>

        <View style={styles.summaryInfo}>
          <Text style={styles.summaryTitle}>
            {job.title}
          </Text>

          <View style={styles.summaryRow}>
            <Ionicons
              name="location-outline"
              size={14}
              color="#888"
            />

            <Text style={styles.summaryText}>
              {job.location}
            </Text>

            <Text style={styles.dot}>•</Text>

            <Text style={styles.summaryText}>
              {job.salary} افغانی
            </Text>
          </View>
        </View>

        <View style={styles.countBadge}>
          <Text style={styles.countText}>
            {applications.length}
          </Text>

          <Text style={styles.countLabel}>
            درخواست
          </Text>
        </View>
      </View>

      {/* Title */}
      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>
          درخواست‌های دریافتی
        </Text>

        <Text style={styles.listCount}>
          {applications.length} نفر
        </Text>
      </View>

      {/* Requests */}
      <FlatList
        data={applications}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <RequestCard
            request={item}
            navigation={navigation}
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

function RequestCard({ request, navigation }) {
  return (
    <View style={styles.card}>
      {/* Top */}
      <View style={styles.cardTop}>
        <View style={[styles.status, request?.status === 'rejected' && {backgroundColor : '#e62626'}]}>
          <View style={styles.statusDot} />

          <Text style={[styles.statusText, request?.status === 'rejected' && {color : 'white'}]}>
            {changeReqStatusToPersion(request.status)}
          </Text>
        </View>

        <View style={styles.userSection}>
          <Image
            source={{ uri: request?.worker?.profileImage}}
            style={styles.avatar}
          />

          <View style={styles.userInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>
                {request.worker.name}
              </Text>

              <MaterialCommunityIcons
                name="check-decagram"
                size={16}
                color={GREEN}
              />
            </View>

            <Text style={styles.job}>
              {request.worker.job}
            </Text>
          </View>
        </View>
      </View>

      {/* Info */}
      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Ionicons
            name="star"
            size={15}
            color="#F4B400"
          />

          <Text style={styles.rating}>
            {request.worker.rate}
          </Text>


        </View>

        <View style={styles.infoItem}>
          <Ionicons
            name="location-outline"
            size={15}
            color="#777"
          />

          <Text style={styles.infoText}>
            {request.worker.province} {request.worker.district}
          </Text>
        </View>

        <View style={styles.infoItem}>
          <Ionicons
            name="briefcase-outline"
            size={15}
            color="#777"
          />

          <Text style={styles.infoText}>
            {request.worker.expereinceYear} سال
          </Text>
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.buttons}>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() =>
            navigation?.navigate("workerProflile", {
              workerId: request.worker._id,
            })
          }
        >
          <Ionicons
            name="person-outline"
            size={16}
            color={GREEN}
          />

          <Text style={styles.profileButtonText}>
            مشاهده پروفایل
          </Text>
        </TouchableOpacity>

        {/* <TouchableOpacity
          style={styles.selectButton}
          onPress={() => {}}
        >
          <Ionicons
            name="checkmark-circle-outline"
            size={17}
            color="#fff"
          />

          <Text style={styles.selectButtonText}>
            انتخاب کارگر
          </Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  // Header

  header: {
    height: 65,
    paddingHorizontal: 17,
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backButton: {
    width: 30,
    alignItems: "center",
  },

  headerCenter: {
    alignItems: "center",
  },

  headerTitle: {
    fontFamily: "yakan",
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
  },

  headerSubtitle: {
    fontFamily: "yakan",
    fontSize: 9,
    color: "#999",
    marginTop: 3,
  },

  // Job Summary

  jobSummary: {
    marginHorizontal: 17,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 13,
    padding: 11,
    flexDirection: "row-reverse",
    alignItems: "center",
  },

  summaryIcon: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: "#EAF7F0",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },

  summaryInfo: {
    flex: 1,
    alignItems: "flex-end",
  },

  summaryTitle: {
    fontFamily: "yakan",
    fontSize: 12,
    fontWeight: "600",
    color: "#222",
  },

  summaryRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginTop: 5,
  },

  summaryText: {
    fontFamily: "yakan",
    fontSize: 8,
    color: "#777",
    marginHorizontal: 3,
  },

  dot: {
    color: "#bbb",
    fontSize: 10,
  },

  countBadge: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 52,
    height: 48,
    borderRadius: 10,
    backgroundColor: "#F5FAF7",
  },

  countText: {
    fontFamily: "yakan",
    fontSize: 15,
    fontWeight: "600",
    color: GREEN,
  },

  countLabel: {
    fontFamily: "yakan",
    fontSize: 7,
    color: "#777",
    marginTop: 1,
  },

  // List Header

  listHeader: {
    marginHorizontal: 18,
    marginTop: 20,
    marginBottom: 10,
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
  },

  listTitle: {
    fontFamily: "yakan",
    fontSize: 13,
    fontWeight: "600",
    color: "#222",
  },

  listCount: {
    fontFamily: "yakan",
    fontSize: 9,
    color: "#999",
  },

  // List

  list: {
    paddingHorizontal: 17,
    paddingBottom: 25,
  },

  // Card

  card: {
    borderWidth: 1,
    borderColor: "#E9E9E9",
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
  },

  cardTop: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
  },

  userSection: {
    flexDirection: "row-reverse",
    alignItems: "center",
  },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginLeft: 10,
  },

  userInfo: {
    alignItems: "flex-end",
  },

  nameRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 4,
  },

  name: {
    fontFamily: "yakan",
    fontSize: 12,
    fontWeight: "600",
    color: "#222",
  },

  job: {
    fontFamily: "yakan",
    fontSize: 9,
    color: "#777",
    marginTop: 4,
  },

  status: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: "#EAF7F0",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 7,
  },

  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: GREEN,
    marginLeft: 5,
  },

  statusText: {
    fontFamily: "yakan",
    fontSize: 7,
    color: GREEN,
  },

  // Info

  infoContainer: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F1F1F1",
    flexDirection: "row-reverse",
    justifyContent: "space-between",
  },

  infoItem: {
    flexDirection: "row-reverse",
    alignItems: "center",
  },

  rating: {
    fontFamily: "yakan",
    fontSize: 9,
    color: "#555",
    marginRight: 3,
  },

  reviews: {
    fontFamily: "yakan",
    fontSize: 8,
    color: "#999",
    marginRight: 2,
  },

  infoText: {
    fontFamily: "yakan",
    fontSize: 8,
    color: "#777",
    marginRight: 4,
  },

  // Buttons

  buttons: {
    flexDirection: "row-reverse",
    gap: 8,
    marginTop: 13,
  },

  profileButton: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: GREEN,
    borderRadius: 8,
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },

  profileButtonText: {
    fontFamily: "yakan",
    fontSize: 9,
    color: GREEN,
  },

  selectButton: {
    flex: 1,
    height: 40,
    backgroundColor: GREEN,
    borderRadius: 8,
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },

  selectButtonText: {
    fontFamily: "yakan",
    fontSize: 9,
    color: "#fff",
    fontWeight: "700",
  },
});