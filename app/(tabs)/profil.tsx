import React from "react";
import { Text, View } from "react-native";
import { useAuth } from "../context/AuthContext";

export default function Profil() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Utilisateur non connecté</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>Profil</Text>
      <Text>Email : {user.email}</Text>
      <Text>ID : {user.id}</Text>
      {/* Ajoute d'autres infos si besoin */}
    </View>
  );
}
