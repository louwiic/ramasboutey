import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import MapView, { Marker, PROVIDER_GOOGLE, PROVIDER_DEFAULT } from 'react-native-maps';
import LeafletMap from '@/components/LeafletMap';


interface MapProps {
  initialRegion: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  markers?: Array<{
    id: string;
    coordinate: {
      latitude: number;
      longitude: number;
    };
    title?: string;
    description?: string;
  }>;
  onMarkerPress?: (markerId: string) => void;
}

const PlatformMap: React.FC<MapProps> = ({ initialRegion, markers = [], onMarkerPress }) => {
  // Utiliser le provider par défaut (Apple Maps sur iOS)
  // Sur Android, on peut utiliser PROVIDER_DEFAULT pour éviter les coûts Google Maps
  const provider = Platform.OS === 'ios' ? PROVIDER_DEFAULT : PROVIDER_DEFAULT;
  
  return (
    <MapView
      provider={provider}
      initialRegion={initialRegion}
      style={styles.map}
    >
      {markers.map(marker => (
        <Marker
          key={marker.id}
          coordinate={marker.coordinate}
          title={marker.title || ''}
          description={marker.description || ''}
          onPress={() => onMarkerPress && onMarkerPress(marker.id)}
        />
      ))}
    </MapView>
  );
};

// Ajout d'une interface pour le type de marqueur pour plus de clarté
interface MarkerData {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  description?: string; // Ajout d'une description optionnelle
}

export default function MapScreen() {
  const router = useRouter();
  // État pour suivre le marqueur sélectionné
  const [selectedMarker, setSelectedMarker] = useState<MarkerData | null>(null);
  
  // Pas besoin de l'état region ici si LeafletMap gère son propre état interne via WebView
  // const [region, setRegion] = useState({ ... }); 

  const handleGoToDetails = (id: string) => { // Spécifier le type de id
    router.push(`/map/details?id=${id}`);
  };
  
  const handleAddObservation = () => {
    router.push('/map/add');
  };
  
  // Correspond à ce que le script Leaflet dans LeafletMap attend
  const initialRegion = {
    latitude: -21.3399, // Latitude de Saint-Pierre (identique au marqueur)
    longitude: 55.4781, // Longitude de Saint-Pierre (identique au marqueur)
    zoom: 14 // Niveau de zoom plus élevé pour se rapprocher (ajustez si nécessaire)
  };

  // Correspond à ce que le script Leaflet dans LeafletMap attend
  const markers: MarkerData[] = [ // Utilisation de l'interface MarkerData
    {
      id: 'st-pierre', // Un ID unique pour le marqueur
      latitude: -21.3399, // Latitude de Saint-Pierre
      longitude: 55.4781, // Longitude de Saint-Pierre
      title: 'Saint-Pierre', // Titre affiché dans la popup
      description: 'Observation principale à St-Pierre.', // Description pour la carte de détails
    },
    // Ajoutez d'autres marqueurs ici si nécessaire
    // { id: 'autre-ville', latitude: ..., longitude: ..., title: '...', description: '...' }
  ];

  // Gère le clic sur un marqueur venant de la WebView
  const handleMarkerPress = (markerId: string) => {
    console.log(`Marqueur pressé: ${markerId}`);
    // Trouver le marqueur correspondant dans notre liste
    const marker = markers.find(m => m.id === markerId);
    if (marker) {
      setSelectedMarker(marker); // Mettre à jour l'état avec le marqueur sélectionné
    } else {
      setSelectedMarker(null); // Réinitialiser si l'ID n'est pas trouvé (sécurité)
    }
    // Ne pas naviguer immédiatement, afficher la carte à la place
    // handleGoToDetails(markerId);
  };

  // Fonction pour fermer la carte de détails
  const handleCloseDetailsCard = () => {
    setSelectedMarker(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Carte des observations</Text>
      </View>
      
      <View style={styles.mapContainer}>
        <LeafletMap
          initialRegion={initialRegion}
          markers={markers}
          onMarkerPress={handleMarkerPress} // Assurez-vous que cette prop est bien gérée dans LeafletMap
        />
        
        {/* Bouton pour ajouter une observation */}
        <TouchableOpacity onPress={handleAddObservation} style={styles.addButton}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>

        {/* Carte de détails du marqueur (affichée conditionnellement) */}
        {selectedMarker && (
          <View style={styles.detailsCard}>
            <View style={styles.detailsHeader}>
              <Text style={styles.detailsTitle}>{selectedMarker.title}</Text>
              <TouchableOpacity onPress={handleCloseDetailsCard} style={styles.closeButton}>
                 <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.detailsDescription}>
              {selectedMarker.description || 'Aucune description disponible.'}
            </Text>
            {/* Vous pouvez ajouter plus d'infos ou un bouton ici */}
             <TouchableOpacity
               style={styles.detailsButton}
               onPress={() => handleGoToDetails(selectedMarker.id)}
             >
               <Text style={styles.detailsButtonText}>Voir les détails</Text>
             </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Ajout d'un fond pour éviter les transparences potentielles
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? 25 : 40, // Ajustement pour status bar Android/iOS
    paddingBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    zIndex: 10, // S'assurer que l'en-tête est au-dessus de la carte si nécessaire
  },
  backButton: {
    padding: 10,
    marginRight: 10, // Espace entre bouton retour et titre
  },
  backButtonText: {
    fontSize: 18, // Légèrement plus grand
    color: '#007AFF',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    // Ajustement pour mieux centrer (peut nécessiter des ajustements fins)
    // marginRight: 50, // Peut-être plus nécessaire si le bouton a une marge
  },
  mapContainer: {
    flex: 1, // Prend tout l'espace restant
    position: 'relative', // Nécessaire pour positionner les éléments enfants absolument
  },
  addButton: {
    position: 'absolute',
    bottom: 30, // Remonter si la carte de détails est affichée
    right: 30,
    backgroundColor: '#007AFF',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    zIndex: 5, // S'assurer qu'il est au-dessus de la carte mais potentiellement sous la carte de détails si elle est grande
  },
  addButtonText: {
    color: '#fff',
    fontSize: 30,
    lineHeight: 30,
  },
  // Nouveaux styles pour la carte de détails
  detailsCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 15,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    elevation: 10, // Ombre Android
    shadowColor: '#000', // Ombre iOS
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 20, // S'assurer qu'elle est au-dessus des autres éléments
  },
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5, // Zone de clic plus grande
  },
  closeButtonText: {
    fontSize: 18,
    color: '#888', // Couleur discrète
  },
  detailsDescription: {
    fontSize: 14,
    color: '#333',
    marginBottom: 15, // Espace avant le bouton
  },
  detailsButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  detailsButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});