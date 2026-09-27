import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { containerStyle } from "../constants/styles";
import {Ionicons} from "@expo/vector-icons";
import { apiPath } from "../configs/conf";

export default function ShowImageScreen() {
  const { params: image } = useRoute();

  const navigation = useNavigation()

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backBtn}
      >
        <Ionicons name="arrow-back" size={24} />
      </TouchableOpacity>

        <Image source={{ uri: image}} style={styles.image} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // paddingHorizontal : containerStyle.paddingHorizontal,
    // paddingVertical : containerStyle.paddingVertical
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode : 'center'
  },
  backBtn: {
    position: "absolute",
    left: 17,
    top: 40,
    zIndex : 10
  },
});
