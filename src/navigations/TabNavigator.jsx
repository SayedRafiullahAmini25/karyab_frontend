import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../constants/colors';
import HomeScreen from '../screens/HomeScreen';
import WorkersSearchScreen from '../screens/WorkersSearchScreen';
import AddWorkScreen from '../screens/AddWorkSreen';
import JobListScreen from '../screens/JobListScreen';
import MyProfileScreen from '../screens/MyProfileScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primaryDark,
        tabBarInactiveTintColor: '#117942',
        tabBarLabelStyle: styles.label,
        tabBarStyle: [styles.tabBar, { paddingBottom: 7 + insets.bottom, height: 68 + insets.bottom }],
        tabBarItemStyle: styles.item,
        tabBarHideOnKeyboard: true,
        tabBarIcon: ({ color, focused }) => {
          const icons = {
            home: ['home-outline', 'home'],
            workersSearch: ['magnify', 'text-box-search'],
            addWork: ['plus-circle-outline', 'plus-circle'],
            jobList: ['briefcase-outline', 'briefcase'],
            profile: ['account-outline', 'account'],
          };
          const [outline, filled] = icons[route.name];
          return (
            <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
              <MaterialCommunityIcons name={focused ? filled : outline} size={30} color={color} />
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="home" component={HomeScreen} options={{ title: 'خانه' }} />
      <Tab.Screen name="workersSearch" component={WorkersSearchScreen} options={{ title: 'جستجو' }} />
      <Tab.Screen name="addWork" component={AddWorkScreen} options={{ title: 'ثبت کار'}} />
      <Tab.Screen name="jobList" component={JobListScreen} options={{ title: 'کارها' }} />
      <Tab.Screen name="profile" component={MyProfileScreen} options={{ title: 'پروفایل' }} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 0,
    paddingTop: 7,
    paddingBottom: 7,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E8EFEB',
    elevation: 12,
  },
  item: { paddingHorizontal: 2 },
  label: { fontFamily: 'yakan', fontSize: 12, marginTop: 0 },
  iconWrap: { width: 42, height: 30, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  iconWrapActive: { backgroundColor: '#EAF7F0' },
});
