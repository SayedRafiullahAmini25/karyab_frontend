import { Ionicons , MaterialCommunityIcons} from "@expo/vector-icons";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../../constants/colors";
import { apiPath, profileImageURL } from "../../configs/conf";

const GREEN = COLORS.primaryDark;

export default function RequestCard({ item, navigation }) {
  return (
    <View style={styles.card}>
      {/* Top */}
      <View style={styles.cardTop}>
   

        <View style={styles.userSection}>
          <Image
            source={{ uri: item?.profileImage}}
            style={styles.avatar}
          />

          <View style={styles.userInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>
                {item?.name}
              </Text>

              <MaterialCommunityIcons
                name="check-decagram"
                size={16}
                color={GREEN}
              />
            </View>

            <Text style={styles.job}>
              {item?.job}
            </Text>
          </View>
        </View>
      </View>

      {/* Info */}
      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Ionicons
            name="star"
            size={15}
            color="#F4B400"
          />

          <Text style={styles.rating}>
            {item?.rate}
          </Text>


        </View>

        <View style={styles.infoItem}>
          <Ionicons
            name="location-outline"
            size={15}
            color="#777"
          />

          <Text style={styles.infoText}>
            {item?.province} {item?.district}
          </Text>
        </View>

        <View style={styles.infoItem}>
          <Ionicons
            name="briefcase-outline"
            size={15}
            color="#777"
          />

          <Text style={styles.infoText}>
            {item?.expereinceYear} سال
          </Text>
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.buttons}>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() =>
            navigation?.navigate("workerProflile", {
              workerId: item?._id,
            })
          }
        >
          <Ionicons
            name="person-outline"
            size={16}
            color={GREEN}
          />

          <Text style={styles.profileButtonText}>
            مشاهده پروفایل
          </Text>
        </TouchableOpacity>

        {/* <TouchableOpacity
          style={styles.selectButton}
          onPress={() => {}}
        >
          <Ionicons
            name="checkmark-circle-outline"
            size={17}
            color="#fff"
          />

          <Text style={styles.selectButtonText}>
            انتخاب کارگر
          </Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
    // Card

  card: {
    borderWidth: 1,
    borderColor: "#E9E9E9",
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
    
  },

  cardTop: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
  },

  userSection: {
    flexDirection: "row-reverse",
    alignItems: "center",
  },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginLeft: 10,
  },

  userInfo: {
    alignItems: "flex-end",
  },

  nameRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 4,
  },

  name: {
    fontFamily: "yakan",
    fontSize: 12,
    fontWeight: "600",
    color: "#222",
  },

  job: {
    fontFamily: "yakan",
    fontSize: 9,
    color: "#777",
    marginTop: 4,
  },

  status: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: "#EAF7F0",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 7,
  },

  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: GREEN,
    marginLeft: 5,
  },

  statusText: {
    fontFamily: "yakan",
    fontSize: 7,
    color: GREEN,
  },

  // Info

  infoContainer: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F1F1F1",
    flexDirection: "row-reverse",
    justifyContent: "space-between",
  },

  infoItem: {
    flexDirection: "row-reverse",
    alignItems: "center",
  },

  rating: {
    fontFamily: "yakan",
    fontSize: 9,
    color: "#555",
    marginRight: 3,
  },

  reviews: {
    fontFamily: "yakan",
    fontSize: 8,
    color: "#999",
    marginRight: 2,
  },

  infoText: {
    fontFamily: "yakan",
    fontSize: 8,
    color: "#777",
    marginRight: 4,
  },

  // Buttons

  buttons: {
    flexDirection: "row-reverse",
    gap: 8,
    marginTop: 13,
  },

  profileButton: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: GREEN,
    borderRadius: 8,
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },

  profileButtonText: {
    fontFamily: "yakan",
    fontSize: 9,
    color: GREEN,
  },

  selectButton: {
    flex: 1,
    height: 40,
    backgroundColor: GREEN,
    borderRadius: 8,
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },

  selectButtonText: {
    fontFamily: "yakan",
    fontSize: 9,
    color: "#fff",
    fontWeight: "700",
  },
})