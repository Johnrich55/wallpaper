import React from "react";
import {
  View,
  ImageBackground,
  Dimensions,
  StyleSheet,
  Image,
  Pressable,
} from "react-native";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import uuid from "react-native-uuid";
import { FontAwesome5 } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { shareAsync } from "expo-sharing";

export default function DetailImage({ route, navigation }) {
  const { item } = route.params;
  const fileName = `${uuid.v4()}.jpg`; // Ensure the file has a .jpg extension

  async function handleImage(uri) {
    try {
      // Request media library permissions
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access media library is required!');
        return;
      }

      
      const result = await FileSystem.downloadAsync(
        uri,
        FileSystem.documentDirectory + fileName
      );
      

    
      const asset = await MediaLibrary.createAssetAsync(result.uri);
      await MediaLibrary.createAlbumAsync('Pictures', asset, false);
      console.log("Image saved to gallery");

      
      await shareAsync(result.uri);
    } catch (error) {
      alert('the use didn\'t not give permissions' )
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      <ImageBackground source={{ uri: item }} style={styles.backgroundImage}>
        <View style={styles.left_arrow_container}>
          <Pressable onPress={() => navigation.goBack()}>
            <Image
              source={require("../../assets/left_arrow1.png")}
              style={styles.left_arrow}
            />
          </Pressable>
        </View>
        <View style={styles.bottom}>
          <Pressable onPress={() => handleImage(item)}>
            <View style={{ ...styles.left_arrow_container, marginLeft: 0 }}>
              <Image
                style={styles.left_arrow}
                source={require("../../assets/download.jpg")}
              />
            </View>
          </Pressable>
          <View style={styles.left_arrow_container}>
            <FontAwesome5 name="heart" size={35} color="black" />
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    justifyContent: "space-between",
  },
  left_arrow_container: {
    backgroundColor: "white",
    width: 50,
    overflow: "hidden",
    height: 50,
    marginLeft: 20,
    marginTop: 20,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  left_arrow: {
    width: 40,
    height: 40,
  },
  bottom: {
    marginBottom: 35,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 50,
  },
});
