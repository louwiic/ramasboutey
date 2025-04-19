import { Redirect, useRootNavigationState, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";

// Définir les routes protégées qui nécessitent une authentification
const protectedRoutes = ["/map", "/Camera"];

export default function AuthMiddleware() {
    const { user, isLoading } = useAuth();
    const segments = useSegments();
    const navigationState = useRootNavigationState();
    const [redirectTo, setRedirectTo] = useState<string | null>(null);

    useEffect(() => {
        if (!navigationState?.key || isLoading) return;

        const inAuthGroup = segments[0] === "auth";
        const currentRoute = "/" + segments.join("/");
        const isProtectedRoute = protectedRoutes.includes(currentRoute);

        if (!user && isProtectedRoute) {
            // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté et que la route est protégée
            setRedirectTo("/auth/login");
        } else if (user && inAuthGroup) {
            // Rediriger vers la page d'accueil si l'utilisateur est connecté
            // et qu'il essaie d'accéder à une page d'authentification
            setRedirectTo("/");
        } else {
            setRedirectTo(null);
        }
    }, [user, segments, navigationState?.key, isLoading]);

    // Effectuer la redirection en dehors du useEffect
    if (redirectTo) {
        return <Redirect href={redirectTo} />;
    }

    return null;
}
