import { createContext, useCallback, useContext, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { apiPath } from '../configs/conf'

const NotificationContext = createContext(null)

export function NotificationProvider({ children }) {
  const [unreadCount, setUnreadCount] = useState(0)

  const authConfig = async () => {
    const token = await AsyncStorage.getItem('token')
    return token ? { headers: { token } } : {}
  }

  const refreshUnreadCount = useCallback(async () => {
    try {
      const config = await authConfig()
      const res = await axios.get(`${apiPath}/api/v1/notification/unread-count`, config)
      if (res.data?.success) setUnreadCount(Number(res.data.count || 0))
    } catch (err) {
      console.log('refreshUnreadCount:', err?.response?.data || err.message)
    }
  }, [])

  const markAsRead = useCallback(async (id) => {
    try {
      const config = await authConfig()
      const res = await axios.patch(`${apiPath}/api/v1/notification/${id}/read`, {}, config)
      if (res.data?.success) setUnreadCount(prev => Math.max(0, prev - 1))
      return res.data
    } catch (err) {
      console.log('markAsRead:', err?.response?.data || err.message)
      return null
    }
  }, [])

  const markAllAsRead = useCallback(async () => {
    try {
      const config = await authConfig()
      const res = await axios.patch(`${apiPath}/api/v1/notification/read-all`, {}, config)
      if (res.data?.success) setUnreadCount(0)
      return res.data
    } catch (err) {
      console.log('markAllAsRead:', err?.response?.data || err.message)
      return null
    }
  }, [])

  return (
    <NotificationContext.Provider value={{ unreadCount, setUnreadCount, refreshUnreadCount, markAsRead, markAllAsRead }}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => useContext(NotificationContext)
