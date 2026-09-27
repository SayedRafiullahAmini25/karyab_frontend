import React, { useCallback, useState } from 'react'
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/fa'
import { apiPath } from '../configs/conf'
import { COLORS } from '../constants/colors'
import { useNotifications } from '../contexts/NotificationContext'

dayjs.extend(relativeTime)
dayjs.locale('fa')

const ICONS = {
  NEW_JOB: ['briefcase-plus-outline', COLORS.primaryDark],
  NEW_APPLICATION: ['account-arrow-left-outline', '#3B82F6'],
  APPLICATION_ACCEPTED: ['check-decagram-outline', '#12B76A'],
  APPLICATION_REJECTED: ['close-circle-outline', '#F04438'],
  JOB_COMPLETED: ['check-circle-outline', '#7A5AF8'],
}

export default function NotificationsScreen() {
  const navigation = useNavigation()
  const { markAsRead, markAllAsRead, refreshUnreadCount } = useNotifications()
  const [items, setItems] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const fetchPage = useCallback(async (targetPage = 1, append = false) => {
    try {
      if (append) setLoadingMore(true)
      else if (!refreshing) setLoading(true)
      const token = await AsyncStorage.getItem('token')
      const res = await axios.get(`${apiPath}/api/v1/notification/list?page=${targetPage}&limit=10`, {
        headers: { token }
      })
      if (res.data?.success) {
        const next = res.data.data || []
        setItems(prev => append ? [...prev, ...next] : next)
        setPage(targetPage)
        setHasMore(Boolean(res.data.pagination?.hasMore))
      }
    } catch (err) {
      console.log('fetch notifications:', err?.response?.data || err.message)
    } finally {
      setLoading(false)
      setLoadingMore(false)
      setRefreshing(false)
    }
  }, [])

  useFocusEffect(useCallback(() => {
    fetchPage(1, false)
    refreshUnreadCount()
  }, [fetchPage, refreshUnreadCount]))

  const openNotification = async (item) => {
    if (!item.isRead) {
      await markAsRead(item._id)
      setItems(prev => prev.map(n => n._id === item._id ? { ...n, isRead: true } : n))
    }

    // if (item.type === 'NEW_JOB' && item.jobId) {
    //   navigation.navigate('jobDetails', { job: [item.jobId] })
    // } else if (item.jobId) {
    //   navigation.navigate('jobDetails', { job: [item.jobId] })
    // }
  }

  const icon = (type) => {
    const [name, color] = ICONS[type] || ['bell-outline', COLORS.primaryDark]
    return <MaterialCommunityIcons name={name} size={23} color={color} />
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <Ionicons name="arrow-back" size={22} color="#202A24" />
        </TouchableOpacity>
        <Text style={styles.title}>اعلان‌ها</Text>
        <TouchableOpacity onPress={async () => { await markAllAsRead(); setItems(prev => prev.map(n => ({ ...n, isRead: true }))) }} style={styles.readButton}>
          <Text style={styles.readText}>خواندن همه</Text>
        </TouchableOpacity>
      </View>

      {loading ? <ActivityIndicator style={{ marginTop: 40 }} color={COLORS.primaryDark} size="large" /> : (
        <FlatList
          data={items}
          keyExtractor={item => item._id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.list, !items.length && styles.emptyList]}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchPage(1, false) }} />}
          onEndReached={() => { if (hasMore && !loadingMore) fetchPage(page + 1, true) }}
          onEndReachedThreshold={0.25}
          ListEmptyComponent={<Text style={styles.emptyText}>اعلانی برای نمایش وجود ندارد</Text>}
          ListFooterComponent={loadingMore ? <ActivityIndicator style={{ marginVertical: 15 }} color={COLORS.primaryDark} /> : null}
          renderItem={({ item }) => (
            <TouchableOpacity activeOpacity={0.82} onPress={() => openNotification(item)} style={[styles.card, !item.isRead && styles.unreadCard]}>
              <View style={[styles.iconBox, !item.isRead && styles.unreadIcon]}>{icon(item.type)}</View>
              <View style={styles.content}>
                <View style={styles.titleRow}>
                  <Text style={[styles.itemTitle, !item.isRead && styles.unreadTitle]}>{item.title}</Text>
                  {!item.isRead && <View style={styles.dot} />}
                </View>
                <Text style={styles.message}>{item.message}</Text>
                <Text style={styles.time}>{dayjs(item.createdAt).fromNow()}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { height: 62, paddingHorizontal: 17, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#EEF2F0' },
  headerButton: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F7F9F8' },
  title: { fontFamily: 'yakan', fontSize: 18, color: '#202A24' },
  readButton: { padding: 7 },
  readText: { fontFamily: 'yakan', fontSize: 10, color: COLORS.primaryDark },
  list: { padding: 16, paddingBottom: 110 },
  emptyList: { flexGrow: 1, justifyContent: 'center' },
  emptyText: { fontFamily: 'yakan', color: '#98A2B3', textAlign: 'center', fontSize: 13 },
  card: { minHeight: 84, padding: 12, marginBottom: 9, borderRadius: 16, borderWidth: 1, borderColor: '#E8EFEB', backgroundColor: '#fff', flexDirection: 'row-reverse', alignItems: 'center' },
  unreadCard: { backgroundColor: '#F6FCF8', borderColor: '#D7EBDD' },
  iconBox: { width: 46, height: 46, borderRadius: 14, backgroundColor: '#F3F6F4', alignItems: 'center', justifyContent: 'center', marginLeft: 11 },
  unreadIcon: { backgroundColor: '#E7F7ED' },
  content: { flex: 1, alignItems: 'flex-end' },
  titleRow: { width: '100%', flexDirection: 'row-reverse', alignItems: 'center', gap: 6 },
  itemTitle: { fontFamily: 'yakan', fontSize: 13, color: '#344054', textAlign: 'right' },
  unreadTitle: { color: '#17202A', fontWeight: '700' },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: COLORS.primaryDark },
  message: { width: '100%', fontFamily: 'yakan', fontSize: 10, color: '#667085', lineHeight: 19, textAlign: 'right', marginTop: 2 },
  time: { width: '100%', fontFamily: 'yakan', fontSize: 9, color: '#98A2B3', textAlign: 'right', marginTop: 5 },
})
