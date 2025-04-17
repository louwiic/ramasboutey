import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

const TakePicture = ({ onPressCamera }: { onPressCamera: () => void }) => {
  return (
    <View style={styles.treasureMapCircle}>
      {/* Navigation Arrows */}
      <TouchableOpacity style={styles.navArrowLeft}>
        <Text style={styles.arrowText}>←</Text>
      </TouchableOpacity>
      
      {/* Camera Button */}
      <TouchableOpacity style={styles.cameraButton} onPress={onPressCamera}>
        <Text style={styles.cameraIcon}>📷</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.navArrowRight}>
        <Text style={styles.arrowText}>→</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  treasureMapCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#F8D48A', // Couleur sable
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginVertical: 20,
  },
  navArrowLeft: {
    position: 'absolute',
    left: 10,
    backgroundColor: '#8B4513', // Couleur marron
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navArrowRight: {
    position: 'absolute',
    right: 10,
    backgroundColor: '#8B4513', // Couleur marron
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  cameraButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#5A3921', // Couleur marron foncé
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIcon: {
    fontSize: 30,
    color: '#FFF',
  },
});

export default TakePicture;
