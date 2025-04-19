import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import TakePicture from "@/components/TakePicture";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  const handleOpenMap = () => {
    router.push("/map"); // Ceci naviguera vers app/map/index.tsx
  };

  const handleOpenCamera = () => {
    console.log("Open Camera");
    router.push("/Camera");
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>La mi rod</Text>
        <View style={styles.locationTabs}>
          <TouchableOpacity style={styles.activeLocationTab}>
            <Text style={styles.activeLocationText}>A côté mwin</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.locationTab}>
            <Text style={styles.locationText}>Saint-Pierre</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.locationTab}>
            <Text style={styles.locationText}>S...</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Banner */}
      <View style={styles.mainBanner}>
        {/* TakePicture Component */}
        <View style={{ flex: 1 }}>
          <Text style={styles.bannerTitle}>
            La chasse aux bouteilles est ouverte !
          </Text>
          <TakePicture onPressCamera={handleOpenCamera} />
          <Text style={styles.cameraHint}>
            Péz si l'appareil photo pou prend un cliché !
          </Text>
        </View>
      </View>

      <View style={{ width: "100%", height: 200, paddingHorizontal: 20 }}>
        <Image
          source={require("../../assets/images/banner.webp")}
        />
      </View>

      {/* Map Banner */}
      <TouchableOpacity style={styles.mapBanner} onPress={handleOpenMap}>
        <View style={styles.mapBannerContent}>
          <View style={styles.mapImage} />
          {
            /* <Image
            source={require('@/assets/images/map-icon.png')}
            style={styles.mapImage}
            resizeMode="contain"
          /> */
          }
          <View style={styles.mapTextContainer}>
            <Text style={styles.mapBannerTitle}>Voir la carte</Text>
            <Text style={styles.mapBannerSubtitle}>
              Afficher tout les zones d'observations relevés sur la carte
            </Text>
          </View>
          <View style={styles.arrowContainer}>
            <Text style={styles.arrowIcon}>→</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Illustration Section */}
      <View style={styles.illustrationContainer}>
        <View style={styles.illustration} />
      </View>

      {/* Call to Action */}
      <View style={styles.ctaContainer}>
        <Text style={styles.ctaText}>
          Aide ton gramoun préféré à ramass bonne bouteil partou !
        </Text>
      </View>

      {/* Recent Findings Section */}
      <View style={styles.recentFindings}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Dernières trouvaille</Text>
          <TouchableOpacity>
            <Text style={styles.seeMoreText}>Voir plus</Text>
          </TouchableOpacity>
        </View>

        {/* Findings Grid */}
        <View style={styles.findingsGrid}>
          {/* Finding Card 1 */}
          <View style={styles.findingCard}>
            <View style={styles.userInfo}>
              <View style={styles.userAvatar} />
              <Text style={styles.userName}>Mark h.</Text>
              <Text style={styles.likeCount}>♥ 29</Text>
            </View>
            <View style={styles.findingImage} />
            <Text style={styles.locationName}>Saint-Pierre</Text>
            <Text style={styles.locationDetails}>
              En face du patio à côté du terrai de beach volley ..
            </Text>
            <TouchableOpacity style={styles.viewButton}>
              <Text style={styles.viewButtonText}>Voir</Text>
            </TouchableOpacity>
          </View>

          {/* Finding Card 2 */}
          <View style={styles.findingCard}>
            <View style={styles.userInfo}>
              <View style={styles.userAvatar} />
              <Text style={styles.userName}>Mark h.</Text>
              <Text style={styles.likeCount}>♥ 29</Text>
            </View>
            <View style={styles.findingImage} />
            <Text style={styles.locationName}>Saint-Pierre</Text>
            <Text style={styles.locationDetails}>
              En face du patio à côté du terrai de beach volley ..
            </Text>
            <TouchableOpacity style={styles.viewButton}>
              <Text style={styles.viewButtonText}>Voir</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F3E5", // Couleur de fond beige clair
  },
  header: {
    padding: 16,
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
  },
  locationTabs: {
    flexDirection: "row",
    marginTop: 8,
  },
  locationTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: "#F0F0F0",
  },
  activeLocationTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: "#4AAFB9", // Couleur turquoise
  },
  locationText: {
    color: "#000",
  },
  activeLocationText: {
    color: "#FFF",
  },
  mainBanner: {
    alignItems: "center",
    padding: 16,
  },
  bannerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    position: "absolute",
    top: 0,
    alignSelf: "center",
  },
  treasureMapCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#F8D48A", // Couleur sable
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    marginVertical: 20,
  },
  navArrowLeft: {
    position: "absolute",
    left: 10,
    backgroundColor: "#8B4513", // Couleur marron
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  navArrowRight: {
    position: "absolute",
    right: 10,
    backgroundColor: "#8B4513", // Couleur marron
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  arrowText: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  cameraButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#5A3921", // Couleur marron foncé
    justifyContent: "center",
    alignItems: "center",
  },
  cameraIcon: {
    fontSize: 30,
    color: "#FFF",
  },
  cameraHint: {
    color: "#4AAFB9", // Couleur turquoise
    marginTop: 10,
    fontSize: 16,
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
  },
  illustrationContainer: {
    padding: 16,
  },
  illustration: {
    height: 200,
    backgroundColor: "#6B8E23", // Couleur olive pour placeholder
    borderRadius: 12,
  },
  ctaContainer: {
    padding: 16,
  },
  ctaText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  recentFindings: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "500",
  },
  seeMoreText: {
    color: "#4AAFB9", // Couleur turquoise
    fontWeight: "500",
  },
  findingsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  findingCard: {
    width: "48%",
    backgroundColor: "#FFF",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  userAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#A0A0A0", // Gris pour placeholder
    marginRight: 8,
  },
  userName: {
    flex: 1,
    fontSize: 14,
  },
  likeCount: {
    fontSize: 14,
  },
  findingImage: {
    height: 100,
    backgroundColor: "#D3D3D3", // Gris clair pour placeholder
  },
  locationName: {
    fontSize: 16,
    fontWeight: "bold",
    padding: 8,
    paddingBottom: 4,
  },
  locationDetails: {
    fontSize: 14,
    padding: 8,
    paddingTop: 0,
    color: "#666",
  },
  viewButton: {
    backgroundColor: "#4AAFB9", // Couleur turquoise
    margin: 8,
    padding: 8,
    borderRadius: 20,
    alignItems: "center",
  },
  viewButtonText: {
    color: "#FFF",
    fontWeight: "500",
  },
  mapBanner: {
    backgroundColor: "#FFF8DC", // Couleur beige clair
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  mapBannerContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  mapImage: {
    width: 80,
    height: 80,
    marginRight: 12,
  },
  mapTextContainer: {
    flex: 1,
  },
  mapBannerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  mapBannerSubtitle: {
    fontSize: 14,
    color: "#666",
    lineHeight: 18,
  },
  arrowContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  arrowIcon: {
    color: "#FFF",
    fontSize: 18,
  },
});
