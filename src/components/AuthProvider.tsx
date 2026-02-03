"use client";

import { useEffect } from "react";
import { app } from "@/lib/firebase";
import { useAuthStore } from "@/store/useStore";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const { setUser, setIsLoading } = useAuthStore();

    useEffect(() => {
        // Dynamic import to avoid SSR/Webpack issues with undici
        const initAuth = async () => {
            try {
                const { getAuth, onAuthStateChanged, signInAnonymously } = await import("firebase/auth");
                const auth = getAuth(app);

                const unsubscribe = onAuthStateChanged(auth, async (user) => {
                    if (user) {
                        setUser({
                            uid: user.uid,
                            email: user.email,
                            displayName: user.displayName || (user.isAnonymous ? "익명 주민" : ""),
                            photoURL: user.photoURL,
                        });
                    } else {
                        try {
                            await signInAnonymously(auth);
                        } catch (err) {
                            console.error("Auto anonymous auth failed:", err);
                            setUser(null);
                        }
                    }
                    setIsLoading(false);
                });

                return unsubscribe;
            } catch (err) {
                console.error("Auth initialization failed:", err);
                setIsLoading(false);
                return () => { };
            }
        };

        let unsub: () => void = () => { };
        initAuth().then(u => {
            if (u) unsub = u;
        });

        return () => unsub();
    }, [setUser, setIsLoading]);

    return <>{children}</>;
}
