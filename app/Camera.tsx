import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Button,
  Dimensions,
  Image,
  ImageBackground,
  InputAccessoryView,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../lib/supabase";
import { Database } from "../types/supabase"; // adapte le chemin si besoin
import { useAuth } from "./context/AuthContext";
import BottomSheet from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  ArrowLeft,
  ArrowRight,
  Camera as CameraIcon,
} from "lucide-react-native";
import * as Location from "expo-location";

// Définition du type PostInsert
type PostInsert = Database["public"]["Tables"]["posts"]["Insert"];

// Type pour le formulaire (champs nécessaires pour le formulaire)
type PostForm = Pick<
  PostInsert,
  "title" | "description" | "city" | "latitude" | "longitude"
>;

const { height } = Dimensions.get("window");

export default function App() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [description, setDescription] = useState("");
  const { user, userLocation, updateLocation } = useAuth();
  const cameraRef = useRef(null);
  const inputAccessoryViewID = "uniqueID";
  const [formData, setFormData] = useState<PostForm>({
    title: "",
    description: null,
    city: null,
    latitude: null,
    longitude: null,
  });
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null,
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Ici vous pourriez charger une image de Pexels
    // Pour l'exemple, nous utiliserons une URL d'image statique
    // Dans une application réelle, vous devriez utiliser l'API Pexels
    setBackgroundImage(
      "https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg",
    );

    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      () => {
        Animated.spring(translateY, {
          toValue: -150, // Ajuste cette valeur pour contrôler la hauteur de montée
          useNativeDriver: true,
        }).start();
      },
    );

    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => {
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      },
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  useEffect(() => {
    (async () => {
      // Demander la permission
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission de localisation refusée");
        return;
      }

      try {
        // Obtenir la position actuelle
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        setLocation(location);
        console.log("Position obtenue:", location);

        // Si tu as besoin de la ville
        const [address] = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        if (address) {
          console.log("Ville:", address.city);
          // Mettre à jour l'état avec la ville si nécessaire
        }
      } catch (error) {
        console.error("Erreur de géolocalisation:", error);
        setErrorMsg("Impossible d'obtenir la position");
      }
    })();
  }, []);

  // Optionnel : mettre à jour la position au montage du composant
  useEffect(() => {
    updateLocation();
  }, []);

  // Log pour débugger
  useEffect(() => {
    console.log("Position actuelle:", userLocation);
  }, [userLocation]);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          Nous avons besoin de votre permission pour utiliser la caméra
        </Text>
        <Button onPress={requestPermission} title="Autoriser l'accès" />
      </View>
    );
  }

  async function takePicture() {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        setCapturedImage(photo.uri);
        setShowConfirmationModal(true);
      } catch (error) {
        console.error("Erreur lors de la prise de photo:", error);
      }
    }
  }

  // Fonction pour uploader la photo et créer le post
  async function createPostAvecPhoto(
    fileUri: string,
    postData: Omit<PostInsert, "photo_url">,
  ): Promise<void> {
    try {
      console.log("Début création post avec photo :", { fileUri, postData });

      const fileName = `${Date.now()}-${
        Math.random().toString(36).slice(2)
      }.jpg`;
      const file = {
        uri: fileUri,
        name: fileName,
        type: "image/jpeg",
      };
      console.log("Fichier préparé :", file);

      const { error: uploadError, data: uploadData } = await supabase.storage
        .from("posts") // changé de "articles" à "posts"
        .upload(fileName, file as any, {
          contentType: "image/jpeg",
          upsert: false,
        });

      if (uploadError) {
        console.error("Erreur upload :", uploadError);
        throw uploadError;
      }
      console.log("Upload réussi :", uploadData);

      const { data } = supabase.storage.from("posts").getPublicUrl(fileName);
      const photo_url = data.publicUrl;
      console.log("URL publique générée :", photo_url);

      const { error: insertError, data: insertData } = await supabase
        .from("posts") // changé de "articles" à "posts"
        .insert([{ ...postData, photo_url }]);

      if (insertError) {
        console.error("Erreur insertion :", insertError);
        throw insertError;
      }
      console.log("Post créé avec succès :", insertData);
    } catch (error) {
      console.error("Erreur globale :", error);
      throw error;
    }
  }

  async function handleSubmit() {
    try {
      // S'assurer d'avoir la dernière position
      await updateLocation();

      await createPostAvecPhoto(
        capturedImage,
        {
          ...formData,
          user_id: user?.id || null,
          created_at: new Date().toISOString(),
          status: "open",
          latitude: userLocation?.latitude || null,
          longitude: userLocation?.longitude || null,
          city: userLocation?.city || null,
        },
      );

      console.log("Post créé avec la position:", {
        latitude: userLocation?.latitude,
        longitude: userLocation?.longitude,
        city: userLocation?.city,
      });
    } catch (error) {
      console.error("Erreur lors de la création:", error);
    }
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Vue caméra fixe en haut */}
        <CameraView
          style={styles.camera}
          facing={facing}
          ref={cameraRef}
        >
          <View style={styles.cameraFrame}></View>
        </CameraView>

        {/* Partie scrollable */}
        <Animated.View
          style={[
            styles.bottomContainer,
            {
              transform: [{ translateY }],
            },
          ]}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            bounces={false}
            showsVerticalScrollIndicator={true}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
          >
            <View style={styles.bottomSection}>
              {/* Zone de la carte */}
              <View style={styles.mapContainer}>
                <Text style={styles.mapTitle}>
                  {userLocation?.city || "Localisation..."}
                </Text>
                <Text style={styles.mapSubtitle}>Mer</Text>
              </View>

              {/* Zone de saisie */}
              <TextInput
                placeholder="Description..."
                value={description}
                onChangeText={setDescription}
                multiline
                style={styles.input}
                inputAccessoryViewID={inputAccessoryViewID}
              />

              {/* Boutons de contrôle */}
              <View style={styles.buttonContainer}>
                <ArrowLeft size={32} color="#8B4513" style={styles.arrow} />
                <TouchableOpacity onPress={takePicture}>
                  <CameraIcon
                    size={40}
                    color="#000000"
                    strokeWidth={2}
                  />
                </TouchableOpacity>
                <ArrowRight size={32} color="#8B4513" style={styles.arrow} />
              </View>
            </View>
          </ScrollView>
        </Animated.View>
      </View>

      {Platform.OS === "ios" && (
        <InputAccessoryView nativeID={inputAccessoryViewID}>
          <View style={styles.accessoryContainer}>
            <TouchableOpacity
              onPress={() =>
                Keyboard.dismiss()}
            >
              <Text style={styles.doneButton}>Terminé</Text>
            </TouchableOpacity>
          </View>
        </InputAccessoryView>
      )}

      {/* Modal de confirmation */}
      <Modal
        visible={showConfirmationModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowConfirmationModal(false)}
            >
              <View style={styles.closeButtonCircle}>
                <Ionicons name="close" size={24} color="#000" />
              </View>
            </TouchableOpacity>

            <Image
              source={{ uri: capturedImage }}
              style={styles.previewImage}
            />

            <Text style={styles.confirmationText}>
              Votre cliché sera enregistré et vu par toutes la communauté
            </Text>

            <View style={styles.confirmationButtons}>
              <TouchableOpacity style={styles.refreshButton}>
                <View style={styles.refreshButtonCircle}>
                  <Ionicons name="refresh" size={24} color="#000" />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSubmit}
              >
                <Text style={styles.saveButtonText}>
                  Enregistrer ma trouvaille
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    height: height * 0.4,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.5,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  bottomSection: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: "100%",
  },
  mapContainer: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 15,
    minHeight: 100,
    maxHeight: 100,
    textAlignVertical: "top",
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: "auto",
  },
  arrow: {
    opacity: 0.8,
  },
  cameraFrame: {
    flex: 1,
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 20,
    margin: 20,
    position: "relative",
  },
  frameCorner: {
    position: "absolute",
    width: 30,
    height: 30,
    borderColor: "white",
    borderWidth: 3,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: -20,
    alignSelf: "center",
    zIndex: 10,
  },
  closeButtonCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5DEB3",
    justifyContent: "center",
    alignItems: "center",
  },
  previewImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginVertical: 15,
  },
  confirmationText: {
    textAlign: "center",
    fontSize: 16,
    marginBottom: 20,
    color: "#333",
  },
  confirmationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  refreshButton: {
    marginRight: 10,
  },
  refreshButtonCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5DEB3",
    justifyContent: "center",
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: "#F5DEB3",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    flex: 1,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#333",
    fontWeight: "bold",
  },
  mapTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#8B4513",
    marginBottom: 5,
  },
  mapSubtitle: {
    fontSize: 18,
    color: "#8B4513",
    marginBottom: 10,
  },
  handleIndicator: {
    backgroundColor: "#DDDDDD",
    width: 40,
  },
  bottomSheet: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  accessoryContainer: {
    backgroundColor: "#f8f8f8",
    padding: 8,
    flexDirection: "row",
    justifyContent: "flex-end",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#b4b4b4",
  },
  doneButton: {
    color: "#007AFF",
    fontSize: 17,
    fontWeight: "600",
    paddingHorizontal: 16,
  },
});
