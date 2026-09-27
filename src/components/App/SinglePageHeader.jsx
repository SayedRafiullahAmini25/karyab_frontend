import { Ionicons } from "@expo/vector-icons";
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function SinglePageHeader({ headerTitle, navigation }) {
  return (
    <>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()}>
          <Ionicons name="arrow-back" size={25} color="#222" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{headerTitle}</Text>
{/* 
        <View style={styles.headerActions}>
          <TouchableOpacity>
            <Ionicons name="share-social-outline" size={23} color="#333" />
          </TouchableOpacity>

          <TouchableOpacity>
            <Ionicons name="bookmark-outline" size={23} color="#333" />
          </TouchableOpacity>
        </View> */}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 62,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerTitle: {
    fontSize: 19,
    fontWeight: "7600",
    color: "#222",
    fontFamily: "yakan",
    alignSelf : 'center'
  },

  headerActions: {
    flexDirection: "row",
    gap: 17,
    
  },
});
