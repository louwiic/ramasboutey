import { Stack } from 'expo-router';
import React from 'react';

export default function MapLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          headerShown: false,
        }} 
      /> 
      <Stack.Screen 
        name="details" 
        options={{ 
          title: "Détails de l'observation",
          headerStyle: {
            backgroundColor: '#4AAFB9',
          },
          headerTintColor: '#fff',
        }} 
      />
      <Stack.Screen 
        name="add" 
        options={{ 
          title: "Ajouter une observation",
          headerStyle: {
            backgroundColor: '#4AAFB9',
          },
          headerTintColor: '#fff',
        }} 
      />
    </Stack>
  );
}