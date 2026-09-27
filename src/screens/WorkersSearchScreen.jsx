import React, { useCallback, useEffect, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  StatusBar,
} from "react-native";
import {SafeAreaView} from 'react-native-safe-area-context'
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAppContext } from "../contexts/AppContext";
import { apiPath } from "../configs/conf";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../constants/colors";
import axios from "axios";

const GREEN = COLORS.primaryDark;

export default function WorkersSearchScreen() {

  const [search, setSearch] = useState(""); 
  const navigation = useNavigation()
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const fetchWorkers = useCallback(async (targetPage = 1, append = false) => {
    try {
      if (append) setLoadingMore(true); else setLoading(true);
      const params = new URLSearchParams({ page: String(targetPage), limit: '10' });
      if (search.trim()) params.append('search', search.trim());
      const res = await axios.get(`${apiPath}/api/v1/worker/list?${params.toString()}`);
      if (res.data?.success) {
        const next = res.data.data || [];
        setWorkers(prev => append ? [...prev, ...next] : next);
        setPage(targetPage);
        setHasMore(Boolean(res.data.pagination?.hasMore));
      } else if (!append) setWorkers([]);
    } catch (err) {
      console.log('fetchWorkers:', err?.response?.data || err.message);
      if (!append) setWorkers([]);
    } finally {
      setLoading(false); setLoadingMore(false);
    }
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(() => fetchWorkers(1, false), 300);
    return () => clearTimeout(timer);
  }, [fetchWorkers]);

  const filteredWorkers = workers;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation?.goBack()}
        >
          <Ionicons
            name="arrow-back"
            size={23}
            color="#222"
          />
        </TouchableOpacity>

        <Text style={styles.title}>
          نتایج جستجو ({filteredWorkers.length})
        </Text>

        <TouchableOpacity>
          <MaterialCommunityIcons
            name="filter-variant"
            size={23}
            color="#555"
          />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchBox}>
        <Ionicons
          name="search-outline"
          size={20}
          color="#777"
        />

        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="جستجو برای کارگر... (اسم یا شغل)"
          placeholderTextColor="#aaa"
          textAlign="right"
          style={styles.searchInput}
        />
      </View>

      {/* Workers List */}
      <FlatList
        data={filteredWorkers}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        onEndReached={() => { if (hasMore && !loadingMore) fetchWorkers(page + 1, true); }}
        onEndReachedThreshold={0.25}
        ListFooterComponent={loadingMore ? <Text style={{ textAlign: 'center', fontFamily: 'yakan', color: GREEN, padding: 12 }}>در حال دریافت...</Text> : null}
        ListEmptyComponent={!loading ? <Text style={{ textAlign: 'center', fontFamily: 'yakan', color: '#98A2B3', marginTop: 40 }}>کارگری پیدا نشد</Text> : null}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.workerCard}
            onPress={() =>
              navigation?.navigate(
                "workerProflile",
                {
                  workerId: item._id,
                }
              )
            }
          >


            <Image
              source={{ uri: item?.profileImage}}
              style={styles.avatar}
            />

            <View style={styles.workerInfo}>
              <Text style={styles.workerName}>
                {item.name}
              </Text>

              <Text style={styles.workerJob}>
                {item.job}
              </Text>

              <View style={styles.locationRow}>
                <MaterialCommunityIcons
                  name="map-marker-outline"
                  size={14}
                  color="#777"
                />

                <Text style={styles.location}>
                  {item.province} , {item.district}
                </Text>
              </View>

              <View style={styles.ratingRow}>
                <Ionicons
                  name="star"
                  size={13}
                  color="#F4B400"
                />

                <Text style={styles.rating}>
                  {item.rate}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  header: {
    height: 60,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  title: {
    fontFamily: "yakan",
    fontSize: 15,
    fontWeight: "600",
    color: "#222",
  },

  searchBox: {
    marginHorizontal: 17,
    height: 46,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 11,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    marginBottom: 10,
  },

  searchInput: {
    flex: 1,
    fontFamily: "yakan",
    fontSize: 11,
    marginRight: 8,
    color: "#333",
  },

  list: {
    paddingHorizontal: 17,
    paddingBottom: 100,
  },

  workerCard: {
    minHeight: 94,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 14,
    marginVertical: 5,
    padding: 10,
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: "#fff",
  },

  avatar: {
    width: 57,
    height: 57,
    borderRadius: 29,
    marginLeft: 12,
  },

  workerInfo: {
    flex: 1,
    alignItems: "flex-end",
  },

  workerName: {
    fontFamily: "yakan",
    fontSize: 13,
    fontWeight: "600",
    color: "#222",
  },

  workerJob: {
    fontFamily: "yakan",
    fontSize: 10,
    color: "#555",
    marginTop: 2,
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginTop: 4,
  },

  location: {
    fontFamily: "yakan",
    fontSize: 9,
    color: "#777",
  },

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginTop: 3,
  },

  rating: {
    fontFamily: "yakan",
    fontSize: 9,
    color: "#555",
  },

  heart: {
    padding: 5,
    alignSelf: "flex-start",
  },
});