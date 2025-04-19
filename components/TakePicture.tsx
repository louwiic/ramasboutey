import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ArrowLeft, ArrowRight } from "lucide-react-native";

const captureButton = require("../assets/images/btn/photo_btn.png");

const TakePicture = ({ onPressCamera }: { onPressCamera: () => void }) => {
  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.arrowLeft}>
          <ArrowLeft size={32} color="#8B4513" style={styles.arrow} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cameraButtonWrapper}
          onPress={onPressCamera}
        >
          <Image
            source={captureButton}
            style={styles.cameraIcon}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.arrowRight}>
          <ArrowRight size={32} color="#8B4513" style={styles.arrow} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 40, // espace sur les côtés
  },
  cameraButtonWrapper: {
    padding: 15,
    elevation: 3, // ombre pour Android
    shadowColor: "#000", // ombre pour iOS
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cameraIcon: {
    resizeMode: "contain",
  },
  arrow: {
    opacity: 0.8,
  },
});

export default TakePicture;
