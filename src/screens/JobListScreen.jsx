import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAppContext } from "../contexts/AppContext";
import jobsCategory from "../staticData/jobs";
import { titleTextStyles } from "../constants/styles";
import { COLORS } from "../constants/colors";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { apiPath, jobCoverImageURL } from "../configs/conf";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import "dayjs/locale/fa"

const GREEN = COLORS.primaryDark;
const LIGHT_GREEN = "#EAF7F0";

export default function JobListScreen() {
  const [selectedCategory, setSelectedCategory] = useState("همه");
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false)
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const navigation = useNavigation();

  dayjs.extend(relativeTime)
  dayjs.locale("fa")

  const fetchJobs = useCallback(async (targetPage = 1, append = false) => {
    try {
      if (append) setLoadingMore(true); else setIsLoading(true);
      const query = new URLSearchParams({ page: String(targetPage), limit: '10' });
      if (search.trim()) query.append('search', search.trim());
      if (selectedCategory !== 'همه') query.append('category', selectedCategory);
      const res = await axios.get(`${apiPath}/api/v1/job/list?${query.toString()}`);
      if (res.data?.success) {
        const next = res.data.data || [];
        setJobs(prev => append ? [...prev, ...next] : next);
        setPage(targetPage);
        setHasMore(Boolean(res.data.pagination?.hasMore));
      } else if (!append) setJobs([]);
    } catch (err) {
      console.log('fetchJobs:', err?.response?.data || err.message);
      if (!append) setJobs([]);
    } finally {
      setIsLoading(false); setLoadingMore(false); setRefreshing(false);
    }
  }, [search, selectedCategory]);

  useEffect(() => {
    const timer = setTimeout(() => fetchJobs(1, false), 300);
    return () => clearTimeout(timer);
  }, [fetchJobs]);

  const renderJob = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[styles.jobCard, item.status === "completed" && styles.completedCard]}
      onPress={() =>
        navigation?.navigate("jobDetails", {
          job: jobs.filter((j) => j._id === item._id),
        })
      }
    >
      {/* تصویر */}
      <Image
        source={{uri : `${jobCoverImageURL}/${item?.coverImage}`}}
        style={styles.jobImage}
      />

      {/* اطلاعات */}
      <View style={styles.jobInfo}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>

        <Text style={[styles.jobTitle, item.status === "completed" && styles.strike]} numberOfLines={1}>
          {item.title}
        </Text>

        <View style={styles.infoRow}>
          <MaterialCommunityIcons
            name="map-marker-outline"
            size={16}
            color="#777"
          />

          <Text style={[styles.grayText, item.status === "completed" && styles.strike]}>{item.location}</Text>
        </View>

        <View style={styles.infoRow}>
          <MaterialCommunityIcons
            name="calendar-outline"
            size={16}
            color="#777"
          />

          <Text style={[styles.grayText, item.status === "completed" && styles.strike]}>منتشر شده: {dayjs(item.createdAt).fromNow()}</Text>
        </View>
      </View>

      {/* قیمت */}
      <View style={styles.priceContainer}>
        <Text style={[styles.price, item.status === "completed" && styles.strike]}>{item.salary}</Text>

        <Text style={styles.currency}>افغانی</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>لیست کارها</Text>

 
      </View>

      {/* Search + Filter */}
      <View style={styles.searchRow}>
        <TouchableOpacity style={styles.filterButton}>
          <MaterialCommunityIcons
            name="filter-variant"
            size={21}
            color={GREEN}
          />

          <Text style={styles.filterText}>فیلتر</Text>
        </TouchableOpacity>

        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={21} color="#777" />

          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="جستجو در کارها ... (مکان یا شغل)"
            placeholderTextColor="#aaa"
            style={styles.searchInput}
            textAlign="right"
          />
        </View>
      </View>

      {/* Categories */}
      <FlatList
        horizontal
        inverted
        showsHorizontalScrollIndicator={false}
        data={jobsCategory}
        keyExtractor={(item) => item.title}
        contentContainerStyle={styles.categories}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setSelectedCategory(item.title)}
            style={[
              styles.categoryButton,
              selectedCategory === item.title && styles.categoryButtonActive,
            ]}
          >
            {item.title === "همه" && (
              <MaterialCommunityIcons
                name="view-grid-outline"
                size={18}
                color={selectedCategory === item.title ? "#fff" : "#555"}
              />
            )}

            <Text
              style={[
                styles.categoryButtonText,
                selectedCategory === item.title &&
                  styles.categoryButtonTextActive,
              ]}
            >
              {item.title}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Jobs */}
      {isLoading ? (
        <ActivityIndicator size="large" color={COLORS.primaryDark} />
      ) : (
        <FlatList
          data={jobs}
          keyExtractor={(item) => item._id}
          renderItem={renderJob}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.jobsList}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                fetchJobs(1, false);
              }}
            />
          }
          onEndReached={() => { if (hasMore && !loadingMore) fetchJobs(page + 1, true); }}
          onEndReachedThreshold={0.25}
          ListFooterComponent={loadingMore ? <ActivityIndicator style={{ marginVertical: 16 }} color={COLORS.primaryDark} /> : null}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  header: {
    height: 65,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },

  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 22,
    color: "#3f3f3fda",
    marginLeft: 25,
    fontFamily: titleTextStyles.fontFamily,
  },

  searchRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 12,
  },

  searchBox: {
    flex: 1,
    height: 50,
    backgroundColor: "#FAFCFB",
    borderWidth: 1,
    borderColor: "#E1EAE5",
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 13,
  },

  searchInput: {
    flex: 1,
    fontSize: 13,
    color: "#333",
    marginLeft: 8,
    fontFamily: "yakan",
  },

  filterButton: {
    width: 78,
    height: 50,
    borderWidth: 1,
    borderColor: "#D7E9DE",
    borderRadius: 14,
    backgroundColor: "#F0FAF4",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },

  filterText: {
    color: GREEN,
    fontSize: 13,
    fontWeight: "600",
    fontFamily: "yakan",
  },

  categories: {
    paddingHorizontal: 16,
    gap: 8,
    paddingBottom: 10,
  },

  categoryButton: {
    height: 40,
    paddingHorizontal: 17,
    borderRadius: 12,
    backgroundColor: "#F8FAF9",
    borderWidth: 1,
    borderColor: "#E8EFEB",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  categoryButtonActive: {
    backgroundColor: GREEN,
  },

  categoryButtonText: {
    fontSize: 12,
    color: "#555",
    fontFamily: "yakan",
  },

  categoryButtonTextActive: {
    color: "#fff",
    fontWeight: "600",
    fontFamily: "yakan",
  },

  jobsList: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },

  jobCard: {
    minHeight: 118,
    backgroundColor: "#fff",
    borderRadius: 18,
    marginVertical: 6,
    padding: 10,
    flexDirection: "row-reverse",
    borderWidth: 1,
    borderColor: "#E4ECE7",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },

  completedCard: { backgroundColor: "#F7F9F8", opacity: 0.82 },

  strike: { textDecorationLine: "line-through", color: "#9AA39E" },

  jobImage: {
    width: 82,
    height: 82,
    borderRadius: 12,
    marginLeft: 10,
  },

  jobInfo: {
    flex: 1,
    alignItems: "flex-end",
    paddingTop: 2,
  },

  categoryBadge: {
    backgroundColor: "#F0FAF4",
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 7,
    marginBottom: 5,
  },

  categoryText: {
    color: GREEN,
    fontSize: 10,
    fontFamily: "yakan",
  },

  jobTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#222",
    marginBottom: 7,
    fontFamily : 'yakan'
  },

  infoRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 4,
    marginBottom: 5,
  },

  grayText: {
    color: "#777",
    fontSize: 10,
    fontFamily: "yakan",
  },

  priceContainer: {
    width: 62,
    alignItems: "flex-start",
    justifyContent: "center",
    paddingVertical: 7,
    gap : 5
  },

  price: {
    color: GREEN,
    fontSize: 13,
    fontWeight: "700",
    fontFamily: "yakan",
  },

  currency: {
    fontSize: 10,
    color: "#777",
    fontFamily: "yakan",
  },

  bookmark: {
    padding: 3,
  },

  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 78,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    flexDirection: "row-reverse",
    justifyContent: "space-around",
    alignItems: "center",
  },

  bottomItem: {
    alignItems: "center",
    justifyContent: "center",
    width: 55,
  },

  bottomText: {
    fontSize: 9,
    color: "#555",
    marginTop: 3,
    fontFamily: "yakan",
  },

  bottomTextActive: {
    color: GREEN,
    fontWeight: "600",
    fontFamily: "yakan",
  },

  addButton: {
    width: 48,
    height: 48,
    borderRadius: 17,
    backgroundColor: GREEN,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -25,
    shadowColor: GREEN,
    shadowOpacity: 0.25,
    shadowRadius: 7,
    elevation: 5,
  },
});
