import { Redirect, useRootNavigationState, useSegments } from "expo-router";
import { useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";

// Définir les routes publiques qui ne nécessitent pas d'authentification
const publicRoutes = ["/auth/login", "/auth/register"];

export default function AuthMiddleware() {
    const { user, isLoading } = useAuth();
    const segments = useSegments();
    const navigationState = useRootNavigationState();

    useEffect(() => {
        if (!navigationState?.key || isLoading) return;

        const inAuthGroup = segments[0] === "auth";
        const currentRoute = "/" + segments.join("/");
        const isPublicRoute = publicRoutes.includes(currentRoute);

        if (!user && !isPublicRoute) {
            // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
            // et que la route n'est pas publique
            return <Redirect href="/auth/login" />;
        } else if (user && inAuthGroup) {
            // Rediriger vers la page d'accueil si l'utilisateur est connecté
            // et qu'il essaie d'accéder à une page d'authentification
            return <Redirect href="/" />;
        }
    }, [user, segments, navigationState?.key, isLoading]);

    return null;
}
