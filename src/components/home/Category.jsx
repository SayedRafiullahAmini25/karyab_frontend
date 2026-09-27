import { MaterialIcons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import jobsCategory from '../../staticData/jobs';
import { COLORS } from '../../constants/colors';

export default function Category() {
  return (
    <View style={styles.container}>
      <View style={styles.headingRow}><Text style={styles.text}>دسته‌بندی خدمات</Text><Text style={styles.hint}>محبوب‌ترین‌ها</Text></View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryContainer}>
        {jobsCategory.map((job, index) => (
          <TouchableOpacity activeOpacity={0.78} style={styles.category} key={index}>
            <View style={[styles.iconBox, { backgroundColor: job.color ? `${job.color}18` : '#EAF7F0' }]}>
              <MaterialIcons name={job.icon} size={23} color={job.color || COLORS.primaryDark} />
            </View>
            <Text numberOfLines={1} style={styles.categoryText}>{job.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { gap: 10, width: '100%', marginTop: 4 },
  headingRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' },
  text: { fontSize: 14, fontFamily: 'yakan', color: '#202A24' },
  hint: { fontSize: 9, fontFamily: 'yakan', color: '#9AA59F' },
  categoryContainer: { flexDirection: 'row', gap: 9, paddingVertical: 2, paddingHorizontal: 1 },
  category: { width: 74, height: 82, borderRadius: 16, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E7EEE9', alignItems: 'center', justifyContent: 'center', gap: 7 },
  iconBox: { width: 40, height: 40, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  categoryText: { fontFamily: 'yakan', fontSize: 10, color: '#445049', maxWidth: 65, textAlign: 'center' },
});
