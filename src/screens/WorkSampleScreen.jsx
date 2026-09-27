import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../constants/colors";
import { containerStyle } from "../constants/styles";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";
import welcomeImage from "../../assets/images/welcomeImage.png";
import { useWorker } from "../contexts/WorkerInfoContext";

export default function PersonalInformationScreen() {
  const insets = useSafeAreaInsets();

  const {images, setImages} = useWorker()

  //remove image from list
  const imageRemove = (index) => {
    setImages((prevVal) => prevVal.filter((_, i) => i !== index));
  };

  // image picking from user
  const pickImages = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      allowsMultipleSelection: true,
      selectionLimit: 4,
      shouldDownloadFromNetwork: true,
    });

    if (!result.canceled) {
      const selectedUris = result.assets.map((asset) => asset.uri);

      if (images && images.length === 4) {
        Toast.show({
          text2: "نمیتوانید بیشتر از 4 عکس آپلود کنید",
          text2Style: { fontFamily: "yakan", fontSize: 16, textAlign: "right" },
          visibilityTime: 4000,
          autoHide: true,
          type: "info",
          position: "bottom",
        });
        return;
      }

      setImages((prevVal) => {
        return [...prevVal, ...selectedUris];
      });
    }
  };

  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backBtn}
      >
        <AntDesign name="left" size={22} />
      </TouchableOpacity>

      <TouchableOpacity onPress={pickImages} style={styles.upoadImageBtn}>
        <MaterialIcons
          name="add-a-photo"
          size={30}
          color={COLORS.textSecondary}
        />
        <Text style={styles.uplaodBtnText}>افزودن عکس (حد اکثر 4 عکس)</Text>
      </TouchableOpacity>

      <View style={styles.imagesContainer}>
        {images.length > 0 &&
          images.map((image, index) => (
            <TouchableOpacity
              onPress={() => navigation.navigate("showImage", image)}
              key={index}
              style={styles.imageContainer}
            >
              <TouchableOpacity
                style={styles.removeBadge}
                onPress={() => imageRemove(index)}
              >
                <MaterialIcons
                  name="close"
                  size={20}
                  color={COLORS.textSecondary}
                />
              </TouchableOpacity>
              <Image source={{ uri: image }} style={styles.selectedImage} />
            </TouchableOpacity>
          ))}
      </View>

      <TouchableOpacity
        onPress={() => {
          if (images.length === 0) {
            Toast.show({
              type: "error",
              // text1 : 'خطا',
              text2: "لطفا خد اقل یک عکس اضافه کنید",
              position: "bottom",
              visibilityTime: 4000,
              autoHide: true,
              // text1Style : {fontFamily : 'yakan', fontSize : 18},
              text2Style: {
                fontFamily: "yakan",
                fontSize: 18,
                textAlign: "right",
              },
            });
          } else {
            navigation.navigate("confirmAndRegister");
          }
        }}
        style={[styles.btn1, { bottom: insets.bottom + 20 }]}
      >
        <Text style={styles.btn1Text}>ادامه</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: containerStyle.paddingHorizontal,
    paddingVertical: containerStyle.paddingVertical,
    backgroundColor: COLORS.background,
    alignItems: "center",
  },

  backBtn: {
    position: "absolute",
    left: 17,
    top: 40,
  },
  btn1: {
    width: "100%",
    height: 50,
    borderRadius: 8,
    backgroundColor: COLORS.primaryDark,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 70,
  },
  btn1Text: {
    fontFamily: "yakan",
    color: COLORS.btnText,
    fontWeight: "600",
    fontSize: 16,
  },
  upoadImageBtn: {
    width: "100%",
    height: 150,
    borderWidth: 1.4,
    borderStyle: "dotted",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
    marginTop: 80,
    borderRadius: 10,
  },
  uplaodBtnText: {
    fontFamily: "yakan",
    fontSize: 15,
    color: COLORS.textSecondary,
  },
  imagesContainer: {
    width: "100%",
    height: "auto",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    flexDirection: "row",
    marginTop: 12,
  },
  imageContainer: {
    width: "48%",
    height: 200,
    borderWidth: 1.4,
    borderStyle: "dotted",
    borderColor: "rgba(153, 148, 148, 0.81)",
    borderRadius: 12,
  },
  selectedImage: {
    width: "100%",
    height: "100%",
    resizeMode: "center",
  },
  removeBadge: {
    position: "absolute",
    right: 5,
    top: 5,
    zIndex: 10,
  },
});
