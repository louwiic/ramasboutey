import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabase";

type AuthContextType = {
    user: User | null;
    session: Session | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    signUp: (email: string, password: string) => Promise<void>;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Vérifier si l'utilisateur est déjà connecté
        supabase.auth.getSession().then(({ data: { session } }) => {
            console.log("État initial de la session:", session);
            setSession(session);
            setUser(session?.user ?? null);
            setIsAuthenticated(!!session);
            setIsLoading(false);
        });

        // Écouter les changements d'authentification
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                console.log("Changement d'état d'authentification:", _event);
                console.log("Nouvelle session:", session);
                setSession(session);
                setUser(session?.user ?? null);
                setIsAuthenticated(!!session);
                setIsLoading(false);
            },
        );

        return () => subscription.unsubscribe();
    }, []);

    const signUp = async (email: string, password: string) => {
        console.log("Tentative d'inscription avec:", email);
        const { error, data } = await supabase.auth.signUp({ email, password });
        console.log(
            "Résultat de l'inscription:",
            error ? "Erreur" : "Succès",
            data,
        );
        if (error) throw error;
    };

    const signIn = async (email: string, password: string) => {
        console.log("Tentative de connexion avec:", email);
        const { error, data } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        console.log(
            "Résultat de la connexion:",
            error ? "Erreur" : "Succès",
            data,
        );
        if (error) throw error;
    };

    const signOut = async () => {
        console.log("Tentative de déconnexion");
        const { error } = await supabase.auth.signOut();
        console.log("Résultat de la déconnexion:", error ? "Erreur" : "Succès");
        if (error) throw error;
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                session,
                isLoading,
                isAuthenticated,
                signUp,
                signIn,
                signOut,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error(
            "useAuth doit être utilisé à l'intérieur d'un AuthProvider",
        );
    }
    return context;
};

export default AuthProvider;
