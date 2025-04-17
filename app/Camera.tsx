import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useEffect, useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, ImageBackground, TextInput, Modal, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function App() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [description, setDescription] = useState('');
  const cameraRef = useRef(null);

  useEffect(() => {
    // Ici vous pourriez charger une image de Pexels
    // Pour l'exemple, nous utiliserons une URL d'image statique
    // Dans une application réelle, vous devriez utiliser l'API Pexels
    setBackgroundImage('https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg');
  }, []);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Nous avons besoin de votre permission pour utiliser la caméra</Text>
        <Button onPress={requestPermission} title="Autoriser l'accès" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  async function takePicture() {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        setCapturedImage(photo.uri);
        setShowConfirmationModal(true);
      } catch (error) {
        console.error('Erreur lors de la prise de photo:', error);
      }
    }
  }

  function handleSavePost() {
    // Logique pour enregistrer le post
    console.log('Post enregistré avec description:', description);
    setShowConfirmationModal(false);
    setCapturedImage(null);
    setDescription('');
  }

  return (
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
            />
          </View>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cameraButton} onPress={toggleCameraFacing}>
              <Ionicons name="camera-reverse" size={30} color="#333" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
              <Ionicons name="camera" size={30} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>

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
                onPress={handleSavePost}
              >
                <Text style={styles.saveButtonText}>Enregistrer ma trouvaille</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
    height: '50%', // Prend la moitié supérieure de l'écran
  },
  cameraFrame: {
    flex: 1,
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 20,
    margin: 20,
    position: 'relative',
  },
  frameCorner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: 'white',
    borderWidth: 3,
  },
  mapContainer: {
    height: '50%', // Prend la moitié inférieure de l'écran
    backgroundColor: '#F5E6CA',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 15,
    alignItems: 'center',
  },
  mapTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 5,
  },
  mapSubtitle: {
    fontSize: 18,
    color: '#8B4513',
    marginBottom: 10,
  },
  inputContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 10,
    width: '90%',
    marginVertical: 15,
  },
  input: {
    height: 60,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginTop: 10,
  },
  cameraButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F5DEB3',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#8B4513',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 6,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: -20,
    alignSelf: 'center',
    zIndex: 10,
  },
  closeButtonCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5DEB3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginVertical: 15,
  },
  confirmationText: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 20,
    color: '#333',
  },
  confirmationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  refreshButton: {
    marginRight: 10,
  },
  refreshButtonCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5DEB3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#F5DEB3',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    flex: 1,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#333',
    fontWeight: 'bold',
  },
});
