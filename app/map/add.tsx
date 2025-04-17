import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

export default function AddObservationScreen() {
  const router = useRouter();
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [bottleCount, setBottleCount] = useState('');
  
  const handleSubmit = () => {
    // Logique pour enregistrer l'observation
    console.log({ location, description, bottleCount });
    
    // Retour à l'écran de la carte
    router.back();
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.label}>Photo</Text>
        <TouchableOpacity style={styles.photoPlaceholder}>
          <Text style={styles.photoPlaceholderText}>Appuyez pour prendre une photo</Text>
        </TouchableOpacity>
        
        <Text style={styles.label}>Lieu</Text>
        <TextInput
          style={styles.input}
          value={location}
          onChangeText={setLocation}
          placeholder="Entrez le nom du lieu"
        />
        
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Décrivez l'endroit où vous avez trouvé les bouteilles"
          multiline
          numberOfLines={4}
        />
        
        <Text style={styles.label}>Nombre de bouteilles</Text>
        <TextInput
          style={styles.input}
          value={bottleCount}
          onChangeText={setBottleCount}
          placeholder="Combien de bouteilles avez-vous trouvé?"
          keyboardType="numeric"
        />
        
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Enregistrer l'observation</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F3E5',
  },
  formContainer: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  photoPlaceholder: {
    height: 200,
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  photoPlaceholderText: {
    color: '#666',
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#4AAFB9',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 40,
  },
  submitButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});