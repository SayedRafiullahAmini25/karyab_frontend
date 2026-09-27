import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
  Linking,
  ActivityIndicator

} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../constants/colors";
import { useNavigation, useRoute } from "@react-navigation/native";
import SinglePageHeader from "../components/App/SinglePageHeader";
import { apiPath, jobCoverImageURL, profileImageURL } from "../configs/conf";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { changeRoleToPersion } from "../utils";
import { useAuth } from "../contexts/AuthContext";
import Toast from "react-native-toast-message";
const GREEN = COLORS.primaryDark;
const LIGHT_GREEN = "#EAF7F0";
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import "dayjs/locale/fa"


export default function JobDetailsScreen() {
  const { params } = useRoute();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [applications, setApplications] = useState([]);
  const job = params?.job[0];
  const [isLoading, setIsLoading] = useState(false)

    dayjs.extend(relativeTime)
    dayjs.locale("fa")

  const { token } = useAuth();

  const phoneCall = (phone) => {
    Linking.openURL(`tel:${phone}`)
  }

  const openWhatsapp = (phone) => {
    const number = phone.replace(/^0/ , '93')
    Linking.openURL(`https://wa.me/${number}`)
  }


  const employer = job?.createdBy;

  const getApplications = async () => {
    try {
      const res = await axios.get(
        `${apiPath}/api/v1/job/${job?._id}/applications`,
      );
      if (!res.data.success) return setApplications(res.data.data);
      setApplications(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getApplications();
  }, []);

  const mappedApplications = applications.slice(0, 5)

  const applyForJob = async () => {
    setIsLoading(true)
    try {
      const res = await axios.post(
        `${apiPath}/api/v1/application/create`,
        { jobId: job?._id },
        {
          headers: { token: token },
        },
      );
      if (!res.data.success)
        Toast.show({
          type: "error",
          text2: res.data.message,
          position: "bottom",
          visibilityTime: 4000,
          autoHide: true,
          text2Style: { fontFamily: "yakan", fontSize: 18, textAlign: "right" },
        });

      Toast.show({
        type: "success",
        text2: res.data.message,
        position: "bottom",
        visibilityTime: 4000,
        autoHide: true,
        text2Style: { fontFamily: "yakan", fontSize: 18, textAlign: "right" },
      });
      setIsLoading(false)
      getApplications();
    } catch (err) {
      setIsLoading(false)
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <SinglePageHeader navigation={navigation} headerTitle="جزییات کار" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Job Header */}
        <View style={styles.jobHeader}>
          <View style={styles.titleSection}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{job.category}</Text>
            </View>

            <Text style={styles.title}>{job.title}</Text>

            <View style={styles.locationRow}>
              <MaterialCommunityIcons
                name="map-marker-outline"
                size={17}
                color="#777"
              />

              <Text style={styles.location}>{job.location}</Text>
            </View>

            <View style={styles.dateRow}>
              <MaterialCommunityIcons
                name="calendar-outline"
                size={17}
                color="#777"
              />

              <Text style={styles.location}>تاریخ انتشار: {dayjs(job?.createdAt).fromNow()}</Text>
            </View>
          </View>

          <Image
            source={{
              uri: `${jobCoverImageURL}/${job.coverImage}`,
            }}
            style={styles.mainImage}
          />
        </View>

        {/* Information Box */}
        <View style={styles.infoBox}>
          <InfoRow
            icon="cash-multiple"
            title="بودجه"
            value={`${job.salary} افغانی`}
          />

          <InfoRow icon="clock-outline" title="نوع همکاری" value="تمام وقت" />

        </View>

        {/* Description */}
        <SectionTitle title="توضیحات کار" />

        <Text style={styles.description}>{job.description}</Text>

        {/* Employer */}
        <SectionTitle title="اطلاعات کارفرما" />

        <View style={styles.employerCard}>
          <View style={styles.employerTop}>
            <Image
              source={{
                uri: employer.profileImage,
              }}
              style={styles.avatar}
            />

            <View style={styles.employerInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.employerName}>{employer.name}</Text>

                <MaterialCommunityIcons
                  name="check-decagram"
                  size={18}
                  color={GREEN}
                />
              </View>

              <Text style={styles.employerRole}>
                {changeRoleToPersion(employer.role)}
              </Text>

              <Text style={styles.memberText}>عضو از {dayjs(employer?.createdAt).fromNow()}</Text>
            </View>
          </View>

          {/* Contact buttons */}
          <View style={styles.contactRow}>
            <TouchableOpacity onPress={() => phoneCall(employer.phone)} style={styles.contactButton}>
              <Text style={styles.contactText}>تماس</Text>

              <Ionicons name="call-outline" size={19} color={GREEN} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.contactButton} onPress={()=> openWhatsapp(employer.phone)}>
              <Text style={styles.contactText}>واتساپ</Text>

              <Ionicons name="logo-whatsapp" size={19} color={GREEN} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Requests */}
        <View style={styles.requestHeader}>
        {
            applications.length > 0 && <TouchableOpacity onPress={()=> navigation.navigate('requests', {applications, job})}>
              <Text style={styles.seeAll}>مشاهده همه</Text>
            </TouchableOpacity>
        }

          <Text style={styles.requestTitle}>
            درخواست ها ({applications?.length})
          </Text>
        </View>

        <View style={styles.requestCard}>
          <View style={styles.avatarStack}>
            {mappedApplications?.map((application, index) => {
              return (
                <RequestAvatar
                  key={index}
                  img={application?.worker?.profileImage}
                />
              );
            })}
            {applications.length > 5 && (
              <View style={styles.moreAvatar}>
                <Text style={styles.moreText}>+{applications.length - 5}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Bottom button space */}
        <View style={{ height: 85 }} />
      </ScrollView>

      {/* Bottom Apply Button */}
      <View style={[styles.bottomContainer, { paddingBottom: 15 + insets.bottom }]}>
        <TouchableOpacity onPress={applyForJob} style={styles.applyButton}>
          <Text style={styles.applyText}>{isLoading ? <ActivityIndicator color="white" size="small" /> : "درخواست دادن برای این کار"}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

/* -------------------------------- */

function InfoRow({ icon, title, value }) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIcon}>
        <MaterialCommunityIcons name={icon} size={21} color="#555" />
      </View>

      <View style={styles.infoText}>
        <Text style={styles.infoTitle}>{title}</Text>

        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

/* -------------------------------- */

function SectionTitle({ title }) {
  return (
    <View style={styles.sectionTitleContainer}>
      <View style={styles.greenLine} />

      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

/* -------------------------------- */

function RequestAvatar({ img }) {
  return (
    <Image
      source={{
        uri: img,
      }}
      style={styles.requestAvatar}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 5,
  },

  /* Job header */

  jobHeader: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    marginTop: 8,
  },

  titleSection: {
    flex: 1,
    paddingLeft: 13,
    alignItems: "flex-end",
  },

  badge: {
    backgroundColor: LIGHT_GREEN,
    borderRadius: 7,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignSelf: "flex-end",
    marginBottom: 8,
  },

  badgeText: {
    color: GREEN,
    fontSize: 11,
    fontWeight: "600",
    fontFamily: "yakan",
  },

  title: {
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "yakan",
    color: "#222",
    textAlign: "right",
    marginBottom: 10,
  },

  locationRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 4,
    marginBottom: 7,
  },

  dateRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 4,
  },

  location: {
    color: "#777",
    fontSize: 10,
    fontFamily: "yakan",
  },

  mainImage: {
    width: 155,
    height: 155,
    borderRadius: 15,
  },

  /* Information */

  infoBox: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 15,
    marginTop: 20,
    overflow: "hidden",
  },

  infoRow: {
    minHeight: 54,
    flexDirection: "row-reverse",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingHorizontal: 13,
  },

  infoIcon: {
    width: 32,
    alignItems: "center",
  },

  infoText: {
    flex: 1,
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
  },

  infoTitle: {
    color: "#777",
    fontSize: 12,
    fontFamily: "yakan",
  },

  infoValue: {
    color: "#333",
    fontSize: 12,
    fontWeight: "500",
    fontFamily: "yakan",
  },

  /* Sections */

  sectionTitleContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginTop: 22,
    marginBottom: 10,
    gap: 7,
  },

  greenLine: {
    width: 4,
    height: 20,
    borderRadius: 3,
    backgroundColor: GREEN,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#222",
    fontFamily: "yakan",
  },

  description: {
    color: "#666",
    fontSize: 12,
    lineHeight: 24,
    textAlign: "right",
    fontFamily: "yakan",
  },

  /* Employer */

  employerCard: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 15,
    padding: 12,
  },

  employerTop: {
    flexDirection: "row-reverse",
    alignItems: "center",
  },

  avatar: {
    width: 55,
    height: 55,
    borderRadius: 28,
    backgroundColor: "#eee",
  },

  employerInfo: {
    flex: 1,
    alignItems: "flex-end",
    marginRight: 10,
  },

  nameRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 5,
  },

  employerName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#222",
    fontFamily: "yakan",
  },

  employerRole: {
    color: "#777",
    fontSize: 10,
    marginTop: 3,
    fontFamily: "yakan",
  },

  memberText: {
    color: "#777",
    fontSize: 9,
    marginTop: 3,
    fontFamily: "yakan",
  },

  contactRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },

  contactButton: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: GREEN,
    borderRadius: 10,
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  contactText: {
    color: GREEN,
    fontSize: 12,
    fontWeight: "600",
    fontFamily: "yakan",
  },

  /* Requests */

  requestHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },

  requestTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#222",
    fontFamily: "yakan",
  },

  seeAll: {
    fontSize: 11,
    color: "#555",
    fontFamily: "yakan",
  },

  requestCard: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 15,
    padding: 13,
    marginTop: 10,
  },

  avatarStack: {
    flexDirection: "row-reverse",
    alignItems: "center",
  },

  requestAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2,
    borderColor: "#fff",
    marginLeft: -5,
  },

  moreAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: -5,
    borderWidth: 2,
    borderColor: "#fff",
  },

  moreText: {
    color: "#555",
    fontSize: 11,
    fontFamily: "yakan",
  },

  /* Bottom */

  bottomContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },

  applyButton: {
    height: 48,
    borderRadius: 12,
    backgroundColor: GREEN,
    justifyContent: "center",
    alignItems: "center",
  },

  applyText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "yakan",
  },
});
