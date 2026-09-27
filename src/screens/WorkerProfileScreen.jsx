import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
  Linking
} from "react-native";

import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context'
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import {apiPath, profileImageURL} from '../configs/conf'
import axios from 'axios'
import { useAppContext } from "../contexts/AppContext";
import AsyncStorage from '@react-native-async-storage/async-storage'

const GREEN = "#008F4C";
const LIGHT_GREEN = "#EAF7F0";
const BORDER = "#E8E8E8";

export default function WorkerProfileScreen() {

  const insets = useSafeAreaInsets()
  const navigation = useNavigation()
  const {params : {workerId}} = useRoute()
  const {workers} = useAppContext()
  const [worker, setWorker] = useState(workers?.filter(worker => worker._id === workerId)[0])

  const skills = JSON.parse(worker?.skills)

  const callNumber = (phone) => {
    Linking.openURL(`tel:${phone}`)
  }
  const openWhatsapp = (phone) => {
    const number = phone.replace(/^0/, "93")
    Linking.openURL(`https://wa.me/${number}`)
  }
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* Cover */}
        <View style={styles.coverContainer}>
          <Image
            source={require('../../assets/images/loginBackround.png')}
            style={styles.cover}
          />

          <View style={styles.coverOverlay} />

          {/* Back */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation?.goBack()}
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color="#3d3b3b"
            />
          </TouchableOpacity>
        </View>

        {/* Profile */}
        <View style={styles.profileInfo}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{ uri: worker?.profileImage}}
              style={styles.avatar}
            />
          </View>

          <View style={styles.nameRow}>
            <Text style={styles.name}>
              {worker.name}
            </Text>

            <MaterialCommunityIcons
              name="check-decagram"
              size={19}
              color={GREEN}
            />
          </View>

          <Text style={styles.job}>
            {worker.job}
          </Text>

          <View style={styles.ratingRow}>
            <Text style={styles.rating}>
              {worker.rate}
            </Text>

            <Ionicons
              name="star"
              size={16}
              color="#F4B400"
            />


            <Text style={styles.location}>
              {worker.province} {worker.district}
            </Text>
          </View>
        </View>

        {/* About */}
        <SectionTitle title="درباره من" />

        <Text style={styles.about}>
          {worker.about}
        </Text>

        {/* Skills */}
        <SectionTitle title="مهارت ها" />

        <View style={styles.skillsContainer}>
          {skills.map((skill, index) => (
            <View
              key={index}
              style={styles.skillBadge}
            >
              <Text style={styles.skillText}>
                {skill}
              </Text>
            </View>
          ))}
        </View>

        {/* Samples */}
        <View style={styles.samplesHeader}>
          <SectionTitle title="نمونه کارها" />

        </View>

        <View style={styles.samplesRow}>
          {worker.gallery.map((image, index) => (
            <TouchableOpacity
              onPress={()=> {
                const imageSrc = image
                navigation.navigate('showImage', imageSrc)
              }}
              key={index}
              style={styles.sampleWrapper}
            >
              <Image
                source={{uri : image }}
                style={styles.sample}
              />
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

     {/* Bottom Buttons */}
      <View style={[styles.bottom, { paddingBottom: 12 + insets.bottom }]}>
        <TouchableOpacity
          onPress={()=> callNumber(worker.phone)}
          style={styles.messageButton}
        >
          <Ionicons
            name="call-outline"
            size={18}
            color={GREEN}
          />

          <Text style={styles.messageText}>
            تماس
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.hireButton}
          onPress={()=> openWhatsapp(worker.phone)}
        >
          <Text style={styles.hireText}>
            واتسپ
          </Text>

          <Ionicons
            name="logo-whatsapp"
            size={18}
            color="#fff"
          />
        </TouchableOpacity>
      </View>
  
    </SafeAreaView>
  );
}

function SectionTitle({ title }) {
  return (
    <View style={styles.sectionTitle}>
      <View style={styles.greenLine} />

      <Text style={styles.sectionText}>
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  scroll: {
    paddingBottom: 20,
  },

  coverContainer: {
    height: 220,
    position: "relative",
  },

  cover: {
    width: "100%",
    height: "100%",
  },

  coverOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.15)",
  },

  backButton: {
    position: "absolute",
    top: 18,
    left: 18,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
    justifyContent: "center",
  },

  topActions: {
    position: "absolute",
    top: 18,
    right: 18,
    flexDirection: "row",
    gap: 8,
  },

  circleButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },

  profileInfo: {
    alignItems: "center",
    marginTop: -52,
    paddingHorizontal: 20,
  },

  avatarWrapper: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: "#fff",
    padding: 4,
  },

  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 46,
  },

  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 8,
  },

  name: {
    fontFamily: "yakan",
    fontSize: 19,
    fontWeight: "600",
    color: "#222",
  },

  job: {
    fontFamily: "yakan",
    color: "#777",
    fontSize: 12,
    marginTop: 2,
  },

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 8,
  },

  rating: {
    fontFamily: "yakan",
    fontSize: 12,
    color: "#333",
  },

  reviews: {
    fontFamily: "yakan",
    fontSize: 11,
    color: "#777",
  },

  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#aaa",
    marginHorizontal: 4,
  },

  location: {
    fontFamily: "yakan",
    color: "#777",
    fontSize: 10,
  },

  sectionTitle: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 7,
    marginTop: 23,
    marginHorizontal: 18,
    marginBottom: 9,
  },

  greenLine: {
    width: 4,
    height: 19,
    borderRadius: 3,
    backgroundColor: GREEN,
  },

  sectionText: {
    fontFamily: "yakan",
    fontSize: 14,
    fontWeight: "600",
    color: "#222",
  },

  about: {
    fontFamily: "yakan",
    fontSize: 11,
    lineHeight: 23,
    color: "#666",
    textAlign: "right",
    marginHorizontal: 18,
  },

  skillsContainer: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: 7,
    marginHorizontal: 18,
  },

  skillBadge: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 9,
    backgroundColor: LIGHT_GREEN,
  },

  skillText: {
    fontFamily: "yakan",
    color: GREEN,
    fontSize: 10,
  },

  samplesHeader: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginRight: 18,
  },

  seeAll: {
    fontFamily: "yakan",
    fontSize: 10,
    color: GREEN,
    marginRight: 18,
  },

  samplesRow: {
    flexDirection: "row-reverse",
    flexWrap : 'wrap',
    gap: 20,
    paddingHorizontal: 18,
  },

  sampleWrapper: {
    // flex: 1,
    width : 170,
    height: 85,
    borderRadius: 10,
    overflow: "hidden",
  },

  sample: {
    width: "100%",
    height: "100%",
  },

  bottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: BORDER,
    padding: 12,
    flexDirection: "row",
    gap: 10,
  },

  messageButton: {
    flex: 1,
    height: 47,
    borderWidth: 1,
    borderColor: GREEN,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 7,
  },

  messageText: {
    fontFamily: "yakan",
    color: GREEN,
    fontSize: 13,
    fontWeight: "600",
  },

  hireButton: {
    flex: 1,
    height: 47,
    backgroundColor: GREEN,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 7,
  },

  hireText: {
    fontFamily: "yakan",
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
});