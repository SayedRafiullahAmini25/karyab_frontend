import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/home/Header";
import { containerStyle } from "../constants/styles";
import SearchInput from "../components/home/SearchInput";
import Category from "../components/home/Category";
import WorkerCard from "../components/home/WorkerCard";
import { useAppContext } from "../contexts/AppContext";
import { COLORS } from "../constants/colors";
import { useAuth } from "../contexts/AuthContext";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useNotifications } from "../contexts/NotificationContext";
import TypingBox from "../components/home/TypingBox";
import { userInternetChecker } from "../contexts/InternetChecker";

export default function HomeScreen() {
  const { getListOfWorkers, isLoading, topWorkers } = useAppContext();
  const [refreshing, setRefreshing] = useState(false);
  const { hasInternet } = userInternetChecker();
  const SCREEN_HIEGHT = Dimensions.get('window').height

  useEffect(() => {
    getListOfWorkers();
  }, []);

  const navigation = useNavigation();
  const { refreshUnreadCount } = useNotifications();

  useFocusEffect(
    useCallback(() => {
      refreshUnreadCount();
    }, [refreshUnreadCount]),
  );
  if (!hasInternet) {
    alert("لطفا انترنت خود را وصل کنید");
    return <ActivityIndicator style={{alignContent : 'center', marginTop : SCREEN_HIEGHT / 2}} size="large" color={COLORS.primaryDark} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <TypingBox onPress={() => navigation.navigate("workersSearch")} />
      <Category />

      <View style={{ gap: 7, marginTop: 20, flex: 1 }}>
        <View
          style={{
            flexDirection: "row-reverse",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ fontFamily: "yakan", fontSize: 14, color: "#202A24" }}>
            کارگران برتر
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("workersSearch")}
          >
            <Text style={{ fontFamily: "yakan", fontSize: 14 }}>
              مشاهده همه
            </Text>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <ActivityIndicator size="large" color={COLORS.primaryDark} />
        ) : (
          <FlatList
            keyExtractor={(item) => item._id}
            data={topWorkers}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={async () => {
                  setRefreshing(true);
                  await getListOfWorkers();
                  setRefreshing(false);
                }}
              />
            }
            contentContainerStyle={{ paddingBottom: 0, paddingTop: 12 }}
            renderItem={({ item }) => (
              <WorkerCard navigation={navigation} item={item} />
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: containerStyle.paddingVertical,
    paddingHorizontal: containerStyle.paddingHorizontal,
    flex: 1,
  },
});
