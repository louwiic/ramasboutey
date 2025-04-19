import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { useEffect, useRef, useState } from "react";
import {
  Button,
  Image,
  ImageBackground,
  InputAccessoryView,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
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

// Définition du type PostInsert
type PostInsert = Database["public"]["Tables"]["posts"]["Insert"];

// Type pour le formulaire (champs nécessaires pour le formulaire)
type PostForm = Pick<
  PostInsert,
  "title" | "description" | "city" | "latitude" | "longitude"
>;

export default function App() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [description, setDescription] = useState("");
  const { user } = useAuth();
  const cameraRef = useRef(null);
  const inputAccessoryViewID = "uniqueID";
  const [formData, setFormData] = useState<PostForm>({
    title: "",
    description: null,
    city: null,
    latitude: null,
    longitude: null,
  });

  useEffect(() => {
    // Ici vous pourriez charger une image de Pexels
    // Pour l'exemple, nous utiliserons une URL d'image statique
    // Dans une application réelle, vous devriez utiliser l'API Pexels
    setBackgroundImage(
      "https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg",
    );
  }, []);

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

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
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
      console.log("Données du formulaire:", formData);

      await createPostAvecPhoto(
        capturedImage,
        {
          ...formData,
          user_id: user?.id || null, // depuis useAuth()
          created_at: new Date().toISOString(),
          status: "open",
        },
      );

      console.log("Post créé avec succès");
    } catch (error) {
      console.error("Erreur lors de la création:", error);
    }
  }

  // Composant pour le bouton Terminé
  const KeyboardAccessory = () => {
    if (Platform.OS === "ios") {
      return (
        <InputAccessoryView nativeID={inputAccessoryViewID}>
          <View
            style={{
              backgroundColor: "#f1f1f1",
              padding: 8,
              flexDirection: "row",
              justifyContent: "flex-end",
            }}
          >
            <TouchableOpacity onPress={() => Keyboard.dismiss()}>
              <Text
                style={{
                  color: "#007AFF",
                  fontSize: 16,
                  paddingHorizontal: 16,
                }}
              >
                Terminé
              </Text>
            </TouchableOpacity>
          </View>
        </InputAccessoryView>
      );
    }
    return null;
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <ImageBackground
          source={{ uri: backgroundImage }}
          style={styles.backgroundImage}
        >
          <CameraView
            style={styles.camera}
            facing={facing}
            ref={cameraRef}
            enableShutterSound={false}
          >
            <View style={styles.cameraFrame}>
              <View style={styles.frameCorner} />
              <View style={styles.frameCorner} />
              <View style={styles.frameCorner} />
              <View style={styles.frameCorner} />
            </View>
          </CameraView>

          <View style={styles.mapContainer}>
            <Text style={styles.mapTitle}>Côte Est</Text>
            <Text style={styles.mapSubtitle}>Mer</Text>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Décris amwin l'endroit pour aide amwin trouve facilement lo bonne boutey"
                placeholderTextColor="#888"
                multiline
                value={description}
                onChangeText={setDescription}
                inputAccessoryViewID={inputAccessoryViewID}
              />
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.cameraButton}
                onPress={toggleCameraFacing}
              >
                <Ionicons name="camera-reverse" size={30} color="#333" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.captureButton}
                onPress={takePicture}
              >
                <Ionicons name="camera" size={30} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>

        <KeyboardAccessory />

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
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
    height: "50%", // Prend la moitié supérieure de l'écran
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
  mapContainer: {
    height: "50%", // Prend la moitié inférieure de l'écran
    backgroundColor: "#F5E6CA",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 15,
    alignItems: "center",
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
  inputContainer: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 10,
    width: "90%",
    marginVertical: 15,
  },
  input: {
    height: 60,
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
    marginTop: 10,
  },
  cameraButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#F5DEB3",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#8B4513",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 6,
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
});
