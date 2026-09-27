import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { apiPath } from "../configs/conf";
import { COLORS } from "../constants/colors";
import { changeReqStatusToPersion } from "../utils";
import { useAppContext } from "../contexts/AppContext";
import { useAuth } from "../contexts/AuthContext";
import RequestCard from "../components/profile/RequestCard";
import RatingModal from "../components/profile/RatingModal";

const GREEN = COLORS.primaryDark || "#008F4C";
const COMPLETED = "completed";

export default function MyJobsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { jobs, getListOfJobs, isLoading } = useAppContext();
  const { token } = useAuth();

  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [ratingVisible, setRatingVisible] = useState(false);
  const [ratingWorker, setRatingWorker] = useState(null);
  const [ratingSubmitting, setRatingSubmitting] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem("userId").then(setLoggedInUserId);
  }, []);

  useFocusEffect(
    useCallback(() => {
      getListOfJobs();
    }, [getListOfJobs]),
  );

  const myJobs = useMemo(
    () =>
      (jobs || []).filter(
        (job) =>
          String(job?.createdBy?._id || job?.createdBy) ===
          String(loggedInUserId),
      ),
    [jobs, loggedInUserId],
  );

  const getApplications = useCallback(async (jobId) => {
    if (!jobId) return [];
    setRequestsLoading(true);
    try {
      const res = await axios.get(
        `${apiPath}/api/v1/job/${jobId}/applications`,
      );
      const data = res.data?.data || [];
      setApplications(data);
      return data;
    } catch (error) {
      console.log("getApplications:", error?.response?.data || error.message);
      Alert.alert("خطا", "گرفتن درخواست‌های این کار موفق نشد.");
      return [];
    } finally {
      setRequestsLoading(false);
    }
  }, []);

  const openRequests = async (job) => {
    setSelectedJob(job);
    setApplications([]);
    setModalVisible(true);
    await getApplications(job?._id);
  };

  const closeRequests = () => {
    setModalVisible(false);
    setSelectedJob(null);
    setApplications([]);
  };

  const handleApprove = (request) => {
    Alert.alert(
      "تأیید درخواست",
      `آیا می‌خواهید ${request?.worker?.name || "این کارگر"} را برای این کار انتخاب کنید؟`,
      [
        { text: "لغو", style: "cancel" },
        {
          text: "تأیید",
          onPress: async () => {
            if (!selectedJob?._id || !request?._id) return;
            setActionLoading(true);
            try {
              const res = await axios.patch(
                `${apiPath}/api/v1/application/${request._id}/accept`,
                { jobId: selectedJob._id, workerId: request?.worker?._id },
                { headers: { token } },
              );
              if (!res.data?.success)
                throw new Error(res.data?.message || "عملیات ناموفق بود");
              await getApplications(selectedJob._id);
              await getListOfJobs();
            } catch (error) {
              Alert.alert(
                "خطا",
                error?.response?.data?.message ||
                  error.message ||
                  "تأیید درخواست موفق نشد.",
              );
            } finally {
              setActionLoading(false);
            }
          },
        },
      ],
    );
  };

  const handleReject = (request) => {
    Alert.alert(
      "رد درخواست",
      `آیا می‌خواهید درخواست ${request?.worker?.name || "این کارگر"} را رد کنید؟`,
      [
        { text: "لغو", style: "cancel" },
        {
          text: "رد کردن",
          style: "destructive",
          onPress: async () => {
            if (!request?._id) return;
            setActionLoading(true);
            try {
              const res = await axios.patch(
                `${apiPath}/api/v1/application/${request._id}/reject`,
                {},
                { headers: { token } },
              );
              if (!res.data?.success)
                throw new Error(res.data?.message || "عملیات ناموفق بود");
              await getApplications(selectedJob?._id);
            } catch (error) {
              Alert.alert(
                "خطا",
                error?.response?.data?.message ||
                  error.message ||
                  "رد درخواست موفق نشد.",
              );
            } finally {
              setActionLoading(false);
            }
          },
        },
      ],
    );
  };

  const selectedApplication = applications.find(
    (app) => app?.status === "accept",
  );
  const selectedWorker = selectedApplication?.worker;
  const canComplete = Boolean(
    selectedJob && selectedWorker && selectedJob.status !== COMPLETED,
  );

  const completeJob = () => {
    if (!selectedJob?._id || !selectedWorker?._id) return;

    Alert.alert(
      "ختم کار",
      `آیا کار انجام شده توسط ${selectedWorker.name} را ختم می‌کنید؟`,
      [
        { text: "لغو", style: "cancel" },
        {
          text: "ختم کار",
          onPress: async () => {
            setActionLoading(true);
            try {
              // Backend endpoint: PATCH /api/v1/job/:jobId/complete
              // Body: { workerId }
              const res = await axios.patch(
                `${apiPath}/api/v1/job/${selectedJob._id}/complete`,
                { workerId: selectedWorker._id },
                { headers: { token } },
              );

              if (!res.data?.success) {
                throw new Error(res.data?.message || "ختم کار موفق نشد.");
              }

              const updatedJob = { ...selectedJob, status: COMPLETED };
              setSelectedJob(updatedJob);
              await getListOfJobs();
              setModalVisible(false);

              setRatingWorker({
                _id: selectedWorker._id,
                name: selectedWorker.name,
                jobId: selectedJob._id,
              });
              setRatingVisible(true);
            } catch (error) {
              Alert.alert(
                "خطا",
                error?.response?.data?.message ||
                  error.message ||
                  "ختم کار موفق نشد.",
              );
            } finally {
              setActionLoading(false);
            }
          },
        },
      ],
    );
  };

  const submitRating = async (rate) => {
    if (!ratingWorker?._id || !ratingWorker?.jobId) return;
    setRatingSubmitting(true);
    try {
      // Backend endpoint: PATCH /api/v1/worker/:workerId/rate
      // Body: { rate, jobId }
      const res = await axios.patch(
        `${apiPath}/api/v1/worker/${ratingWorker._id}/rate`,
        { rate, jobId: ratingWorker.jobId },
        { headers: { token } },
      );

      if (!res.data?.success) {
        throw new Error(res.data?.message || "ثبت امتیاز موفق نشد.");
      }

      setRatingVisible(false);
      setRatingWorker(null);
      await getListOfJobs();
      Alert.alert("موفق", "امتیاز شما با موفقیت ثبت شد.");
    } catch (error) {
      Alert.alert(
        "خطا",
        error?.response?.data?.message ||
          error.message ||
          "ثبت امتیاز موفق نشد.",
      );
    } finally {
      setRatingSubmitting(false);
    }
  };

  const renderJob = ({ item }) => {
    const completed = item?.status === COMPLETED;

    return (
      <TouchableOpacity
        activeOpacity={0.85}
        style={[styles.jobCard, completed && styles.completedJobCard]}
        onPress={() => openRequests(item)}
      >
        <View style={[styles.jobIcon, completed && styles.completedJobIcon]}>
          <MaterialCommunityIcons
            name={completed ? "check-circle-outline" : "briefcase-outline"}
            size={26}
            color={completed ? "#74817A" : GREEN}
          />
        </View>

        <View style={styles.jobInfo}>
          <View style={styles.titleRow}>
            <Text
              style={[styles.jobTitle, completed && styles.completedStrike]}
              numberOfLines={1}
            >
              {item.title}
            </Text>

            <View
              style={[styles.statusBadge, completed && styles.completedBadge]}
            >
              <Text
                style={[
                  styles.statusText,
                  completed && styles.completedStatusText,
                ]}
              >
                {completed
                  ? "ختم شده"
                  : changeReqStatusToPersion(item.status) || "فعال"}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={16} color="#777" />
            <Text
              style={[styles.infoText, completed && styles.completedStrike]}
            >
              {item.location}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="wallet-outline" size={16} color="#777" />
            <Text
              style={[styles.infoText, completed && styles.completedStrike]}
            >
              {item.salary} افغانی
            </Text>
          </View>

          <View style={styles.bottomRow}>
            <Text style={styles.viewText}>
              {completed ? "مشاهده جزئیات و امتیاز" : "مشاهده درخواست‌ها"}
            </Text>
            <Ionicons
              name="chevron-back"
              size={17}
              color={completed ? "#77837D" : GREEN}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={22} color="#222" />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>کارهای من</Text>
          <Text style={styles.headerSubtitle}>مدیریت کارها و درخواست‌ها</Text>
        </View>
        <View style={styles.headerIcon}>
          <MaterialCommunityIcons
            name="briefcase-check-outline"
            size={25}
            color={GREEN}
          />
        </View>
      </View>

      <View style={styles.summary}>
        <View>
          <Text style={styles.summaryTitle}>کارهای ثبت‌شده</Text>
          <Text style={styles.summaryNumber}>{myJobs.length}</Text>
        </View>
        <View style={styles.summaryIcon}>
          <MaterialCommunityIcons
            name="clipboard-text-outline"
            size={28}
            color={GREEN}
          />
        </View>
      </View>

      {isLoading && myJobs.length === 0 ? (
        <View style={styles.centerLoading}>
          <ActivityIndicator size="large" color={GREEN} />
          <Text style={styles.loadingText}>در حال دریافت کارها...</Text>
        </View>
      ) : (
        <FlatList
          data={myJobs}
          keyExtractor={(item) => item._id}
          renderItem={renderJob}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.empty}>
              <MaterialCommunityIcons
                name="briefcase-off-outline"
                size={55}
                color="#B8CFC3"
              />
              <Text style={styles.emptyTitle}>هنوز کاری ثبت نکرده‌اید</Text>
              <Text style={styles.emptyText}>
                اولین کار خود را ثبت کنید تا درخواست‌ها را دریافت کنید.
              </Text>
            </View>
          }
        />
      )}

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={closeRequests}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                onPress={closeRequests}
                style={styles.modalClose}
              >
                <Ionicons name="close" size={22} color="#333" />
              </TouchableOpacity>
              <View style={styles.modalHeaderText}>
                <Text style={styles.modalTitle}>درخواست‌های کار</Text>
                <Text style={styles.modalSubtitle} numberOfLines={1}>
                  {selectedJob?.title}
                </Text>
              </View>
              <View style={styles.modalHeaderIcon}>
                <Ionicons name="people-outline" size={23} color={GREEN} />
              </View>
            </View>

            {selectedJob && (
              <View style={styles.modalJobSummary}>
                <View style={styles.modalJobIcon}>
                  <MaterialCommunityIcons
                    name="briefcase-outline"
                    size={23}
                    color={GREEN}
                  />
                </View>
                <View style={styles.modalJobInfo}>
                  <Text style={styles.modalJobTitle}>{selectedJob.title}</Text>
                  <Text style={styles.modalJobMetaText}>
                    {selectedJob.location} • {selectedJob.salary} افغانی
                  </Text>
                </View>
                <View style={styles.requestCount}>
                  <Text style={styles.requestCountNumber}>
                    {applications.length}
                  </Text>
                  <Text style={styles.requestCountLabel}>درخواست</Text>
                </View>
              </View>
            )}

            {requestsLoading ? (
              <View style={styles.centerLoading}>
                <ActivityIndicator size="large" color={GREEN} />
                <Text style={styles.loadingText}>
                  در حال دریافت درخواست‌ها...
                </Text>
              </View>
            ) : (
              <FlatList
                data={applications}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <RequestCard
                    item={item}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    navigations={navigation}
                    setModalVisible={setModalVisible}
                  />
                )}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.modalList}
                ListHeaderComponent={
                  <View style={styles.requestTitleRow}>
                    <Text style={styles.requestTitle}>درخواست‌های دریافتی</Text>
                    <Text style={styles.requestTitleCount}>
                      {applications.length}
                    </Text>
                  </View>
                }
                ListEmptyComponent={
                  <View style={styles.noRequests}>
                    <MaterialCommunityIcons
                      name="account-search-outline"
                      size={50}
                      color="#BCD4C7"
                    />
                    <Text style={styles.noRequestsTitle}>
                      درخواستی وجود ندارد
                    </Text>
                    <Text style={styles.noRequestsText}>
                      هنوز کسی برای این کار درخواست ارسال نکرده است.
                    </Text>
                  </View>
                }
              />
            )}

            {canComplete && (
              <View style={[styles.completeBar, { paddingBottom: 11 + insets.bottom }]}>
                <View style={styles.selectedWorkerInfo}>
                  <View style={styles.selectedDot} />
                  <Text style={styles.selectedWorkerText}>
                    کارگر انتخاب‌شده: {selectedWorker.name}
                  </Text>
                </View>
                <TouchableOpacity
                  style={[
                    styles.completeButton,
                    actionLoading && styles.disabled,
                  ]}
                  onPress={completeJob}
                  disabled={actionLoading}
                >
                  <Ionicons
                    name="checkmark-done-outline"
                    size={20}
                    color="#fff"
                  />
                  <Text style={styles.completeButtonText}>ختم کار</Text>
                </TouchableOpacity>
              </View>
            )}

            {selectedJob?.status === COMPLETED && (
              <View style={[styles.completedNotice, { height: 52 + insets.bottom, paddingBottom: insets.bottom }]}>
                <Ionicons name="checkmark-circle" size={19} color={GREEN} />
                <Text style={styles.completedNoticeText}>
                  این کار قبلاً ختم شده است.
                </Text>
              </View>
            )}
          </View>
        </View>
      </Modal>

      <RatingModal
        visible={ratingVisible}
        workerName={ratingWorker?.name}
        submitting={ratingSubmitting}
        onClose={() => !ratingSubmitting && setRatingVisible(false)}
        onSubmit={submitRating}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FBF9" },
  header: {
    height: 76,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E7EEE9",
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#EAF7F0",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  headerText: { flex: 1, alignItems: "flex-end" },
  headerTitle: { fontFamily: "yakan", fontSize: 20, color: "#1D2A23" },
  headerSubtitle: {
    fontFamily: "yakan",
    fontSize: 11,
    color: "#7A857F",
    marginTop: 2,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F2F5F3",
    alignItems: "center",
    justifyContent: "center",
  },
  summary: {
    margin: 15,
    padding: 16,
    borderRadius: 17,
    backgroundColor: "#EAF7F0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  summaryTitle: {
    fontFamily: "yakan",
    fontSize: 12,
    color: "#5F7067",
    textAlign: "right",
  },
  summaryNumber: {
    fontFamily: "yakan",
    fontSize: 27,
    color: GREEN,
    textAlign: "right",
    marginTop: 1,
  },
  summaryIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  list: { paddingHorizontal: 15, paddingBottom: 30 },
  jobCard: {
    backgroundColor: "#fff",
    borderRadius: 17,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E1EAE5",
    flexDirection: "row-reverse",
    shadowColor: "#000",
    shadowOpacity: 0.035,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  completedJobCard: { backgroundColor: "#F7F9F8", borderColor: "#DDE5E0" },
  jobIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: "#EAF7F0",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 11,
  },
  completedJobIcon: { backgroundColor: "#E8ECEA" },
  jobInfo: { flex: 1, minWidth: 0 },
  titleRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 7,
  },
  jobTitle: {
    flex: 1,
    fontFamily: "yakan",
    fontSize: 15,
    color: "#1E2923",
    textAlign: "right",
  },
  completedStrike: { textDecorationLine: "line-through", color: "#7B8580" },
  statusBadge: {
    backgroundColor: "#EAF7F0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  completedBadge: { backgroundColor: "#E6EBE8" },
  statusText: { fontFamily: "yakan", fontSize: 9, color: GREEN },
  completedStatusText: { color: "#6D7872" },
  infoRow: { flexDirection: "row-reverse", alignItems: "center", marginTop: 7 },
  infoText: {
    flex: 1,
    fontFamily: "yakan",
    fontSize: 11,
    color: "#737C77",
    marginRight: 5,
    textAlign: "right",
  },
  bottomRow: {
    borderTopWidth: 1,
    borderTopColor: "#EEF2EF",
    marginTop: 12,
    paddingTop: 10,
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 4,
  },
  viewText: { fontFamily: "yakan", fontSize: 11, color: GREEN },
  centerLoading: { flex: 1, alignItems: "center", justifyContent: "center" },
  loadingText: {
    fontFamily: "yakan",
    color: "#74817A",
    fontSize: 12,
    marginTop: 10,
  },
  empty: { alignItems: "center", paddingTop: 65, paddingHorizontal: 30 },
  emptyTitle: {
    fontFamily: "yakan",
    fontSize: 16,
    color: "#47554E",
    marginTop: 14,
  },
  emptyText: {
    fontFamily: "yakan",
    fontSize: 12,
    color: "#89948E",
    textAlign: "center",
    lineHeight: 22,
    marginTop: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(20,30,25,.44)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    height: "92%",
    backgroundColor: "#F8FBF9",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    overflow: "hidden",
  },
  modalHeader: {
    height: 72,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E8EEE9",
  },
  modalHeaderIcon: {
    width: 43,
    height: 43,
    borderRadius: 13,
    backgroundColor: "#EAF7F0",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  modalHeaderText: { flex: 1, alignItems: "flex-end" },
  modalTitle: { fontFamily: "yakan", fontSize: 18, color: "#202B25" },
  modalSubtitle: {
    fontFamily: "yakan",
    fontSize: 11,
    color: "#7A857F",
    marginTop: 2,
  },
  modalClose: {
    width: 39,
    height: 39,
    borderRadius: 12,
    backgroundColor: "#F2F5F3",
    alignItems: "center",
    justifyContent: "center",
  },
  modalJobSummary: {
    margin: 14,
    padding: 12,
    borderRadius: 16,
    backgroundColor: "#EAF7F0",
    flexDirection: "row-reverse",
    alignItems: "center",
  },
  modalJobIcon: {
    width: 45,
    height: 45,
    borderRadius: 13,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  modalJobInfo: { flex: 1, alignItems: "flex-end", minWidth: 0 },
  modalJobTitle: {
    fontFamily: "yakan",
    fontSize: 13,
    color: "#1F2C25",
    textAlign: "right",
  },
  modalJobMetaText: {
    fontFamily: "yakan",
    fontSize: 10,
    color: "#6D7A73",
    marginTop: 4,
    textAlign: "right",
  },
  requestCount: { alignItems: "center", marginRight: 8 },
  requestCountNumber: { fontFamily: "yakan", fontSize: 20, color: GREEN },
  requestCountLabel: { fontFamily: "yakan", fontSize: 9, color: "#68766F" },
  modalList: { paddingHorizontal: 15, paddingBottom: 100 },
  requestTitleRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 9,
  },
  requestTitle: { fontFamily: "yakan", fontSize: 15, color: "#26332C" },
  requestTitleCount: {
    fontFamily: "yakan",
    fontSize: 11,
    color: GREEN,
    backgroundColor: "#EAF7F0",
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
  },
  noRequests: { alignItems: "center", paddingTop: 45, paddingHorizontal: 30 },
  noRequestsTitle: {
    fontFamily: "yakan",
    fontSize: 15,
    color: "#47554E",
    marginTop: 12,
  },
  noRequestsText: {
    fontFamily: "yakan",
    fontSize: 11,
    color: "#89948E",
    textAlign: "center",
    lineHeight: 21,
    marginTop: 5,
  },
  completeBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#DDE7E1",
    padding: 11,
    gap: 8,
  },
  selectedWorkerInfo: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  selectedDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: GREEN,
    marginRight: 6,
  },
  selectedWorkerText: { fontFamily: "yakan", fontSize: 10, color: "#69766F" },
  completeButton: {
    height: 45,
    borderRadius: 12,
    backgroundColor: GREEN,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row-reverse",
    gap: 6,
  },
  completeButtonText: { fontFamily: "yakan", fontSize: 13, color: "#fff" },
  disabled: { opacity: 0.55 },
  completedNotice: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 52,
    backgroundColor: "#EAF7F0",
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  completedNoticeText: { fontFamily: "yakan", fontSize: 11, color: GREEN },
});
