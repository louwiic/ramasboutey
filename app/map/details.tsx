import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function ObservationDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [observation, setObservation] = useState<{
    id: string | string[];
    title: string;
    date: string;
    description: string;
    latitude: number;
    longitude: number;
  } | null>(null);
  
  // Simuler le chargement des données d'observation
  useEffect(() => {
    // Ici, vous feriez normalement un appel API pour récupérer les détails
    // basés sur l'ID reçu en paramètre
    const mockObservation = {
      id: id,
      title: `Observation ${id}`,
      date: '15/06/2023',
      description: 'Description détaillée de cette observation...',
      latitude: 48.8566,
      longitude: 2.3522,
      // Autres détails...
    };
    
    setObservation(mockObservation);
  }, [id]);
  
  if (!observation) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Retour</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Chargement...</Text>
        </View>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{observation.title}</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Date</Text>
          <Text style={styles.infoValue}>{observation.date}</Text>
        </View>
        
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Coordonnées</Text>
          <Text style={styles.infoValue}>
            Lat: {observation.latitude}, Long: {observation.longitude}
          </Text>
        </View>
        
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Description</Text>
          <Text style={styles.infoValue}>{observation.description}</Text>
        </View>
        
        {/* Vous pouvez ajouter d'autres informations ici */}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F3E5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 50,
    backgroundColor: '#4AAFB9',
  },
  backButton: {
    marginRight: 16,
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  infoCard: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
  },
});
