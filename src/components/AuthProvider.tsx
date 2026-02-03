"use client";

import { useEffect } from "react";
import { auth, initAnonymousAuth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useAuthStore } from "@/store/useStore";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const { setUser, setIsLoading } = useAuthStore();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser({
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName || (user.isAnonymous ? "익명 주민" : ""),
                    photoURL: user.photoURL,
                });
            } else {
                // Automatically sign in anonymously for easy access as per v2.1 spec
                try {
                    await initAnonymousAuth();
                } catch (err) {
                    console.error("Auto anonymous auth failed:", err);
                    setUser(null);
                }
            }
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [setUser, setIsLoading]);

    return <>{children}</>;
}
