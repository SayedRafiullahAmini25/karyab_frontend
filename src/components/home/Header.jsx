import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../../constants/colors';
import { useNotifications } from '../../contexts/NotificationContext';
import { useLocation } from '../../contexts/LocationsContext';

export default function Header() {
  const navigation = useNavigation();
  const { unreadCount } = useNotifications();
  const {location, loading} = useLocation()

  return (
    <View style={styles.container}>
      <TouchableOpacity activeOpacity={0.75} style={styles.locationContainer}>
        <View style={styles.locationIcon}><Ionicons name="location" size={16} color={COLORS.primaryDark} /></View>
        <View>
          <Text style={styles.small}>موقعیت فعلی</Text>
          <Text style={styles.location}>{loading ? 'در حال دریافت مکان' : location && location?.province}</Text>
        </View>
      </TouchableOpacity>
      <Text style={styles.title}>کاریاب</Text>
      <TouchableOpacity style={styles.bellButton} activeOpacity={0.8} onPress={() => navigation.navigate('notifications')}>
        <Ionicons name="notifications-outline" size={21} color={COLORS.primaryDark} />
        {unreadCount > 0 && <View style={styles.badge}><Text style={styles.badgeText}>{unreadCount > 99 ? '99+' : unreadCount}</Text></View>}
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  title: { fontFamily: 'yakan', fontSize: 26, color: COLORS.primaryDark },
  locationContainer: { flexDirection: 'row-reverse', alignItems: 'center', gap: 7 },
  locationIcon: { width: 34, height: 34, borderRadius: 11, backgroundColor: '#EAF7F0', alignItems: 'center', justifyContent: 'center' },
  small: { fontFamily: 'yakan', color: '#9AA59F', fontSize: 8, textAlign: 'right' },
  location: { fontFamily: 'yakan', color: '#26312B', fontSize: 12, textAlign: 'right', marginTop: 1 },
  bellButton: { width: 38, height: 38, borderRadius: 12, backgroundColor: '#EAF7F0', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  badge: { position: 'absolute', top: -3, right: -3, minWidth: 17, height: 17, paddingHorizontal: 3, borderRadius: 9, backgroundColor: '#F04438', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff' },
  badgeText: { fontFamily: 'yakan', color: '#fff', fontSize: 7, fontWeight: '700' },
});
