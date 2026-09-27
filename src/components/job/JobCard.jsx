import { Ionicons } from '@expo/vector-icons';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../../constants/colors';

export default function JobCard({ category, jobTitle, address, date, salary, completed = false, onPress }) {
  return (
    <TouchableOpacity activeOpacity={0.86} onPress={onPress} style={[styles.container, completed && styles.completed]}>
      <View style={styles.imageContainer}>
        <Image source={require('../../../assets/images/Sayed Rafiullah.jpg')} style={styles.image} />
      </View>
      <View style={styles.info}>
        <View style={styles.topRow}>
          <View style={styles.badge}><Text style={styles.badgeText}>{completed ? 'ختم شده' : category}</Text></View>
          <Text style={[styles.title, completed && styles.strike]} numberOfLines={1}>{jobTitle}</Text>
        </View>
        <View style={styles.meta}><Ionicons name="location-outline" size={14} color="#84908A" /><Text style={[styles.metaText, completed && styles.strike]} numberOfLines={1}>{address}</Text></View>
        <View style={styles.meta}><Ionicons name="calendar-outline" size={14} color="#84908A" /><Text style={[styles.metaText, completed && styles.strike]}>{date}</Text></View>
      </View>
      <View style={styles.price}><Text style={[styles.priceText, completed && styles.strike]}>{salary}</Text><Text style={styles.currency}>افغانی</Text></View>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  container: { minHeight: 112, padding: 10, borderWidth: 1, borderColor: '#E4ECE7', borderRadius: 18, flexDirection: 'row-reverse', alignItems: 'center', backgroundColor: '#FFF', marginBottom: 10 },
  completed: { backgroundColor: '#F7F9F8', opacity: 0.82 },
  imageContainer: { width: 72, height: 84, borderRadius: 14, overflow: 'hidden', marginLeft: 10, backgroundColor: '#EDF4F0' },
  image: { width: '100%', height: '100%' },
  info: { flex: 1, minWidth: 0, alignItems: 'flex-end' },
  topRow: { width: '100%', flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', gap: 6 },
  badge: { backgroundColor: '#EAF7F0', paddingHorizontal: 7, paddingVertical: 4, borderRadius: 7, maxWidth: 70 },
  badgeText: { color: COLORS.primaryDark, fontFamily: 'yakan', fontSize: 8 },
  title: { flex: 1, textAlign: 'right', fontFamily: 'yakan', fontSize: 13, color: '#202A24', fontWeight: '600' },
  meta: { width: '100%', flexDirection: 'row-reverse', alignItems: 'center', gap: 4, marginTop: 6 },
  metaText: { flex: 1, textAlign: 'right', fontFamily: 'yakan', fontSize: 9, color: '#7A857F' },
  price: { width: 60, alignItems: 'center', marginRight: 5 },
  priceText: { fontFamily: 'yakan', color: COLORS.primaryDark, fontSize: 12, fontWeight: '700' },
  currency: { fontFamily: 'yakan', color: '#8B958F', fontSize: 8, marginTop: 3 },
  strike: { textDecorationLine: 'line-through', color: '#9AA39E' },
});
