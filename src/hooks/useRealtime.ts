import { useEffect, useState } from 'react';
import { collection, query, onSnapshot, QueryConstraint } from 'firebase/firestore';
import { db } from '@/firebase/config';

export const useRealtimeCollection = <T>(
    collectionName: string,
    constraints: QueryConstraint[] = []
) => {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        // Ensure we are in a browser environment or handle appropriately
        if (!db) return;

        try {
            const q = query(collection(db, collectionName), ...constraints);

            const unsubscribe = onSnapshot(
                q,
                (snapshot) => {
                    const items = snapshot.docs.map(doc => {
                        const data = doc.data();
                        return {
                            id: doc.id,
                            ...data,
                            // Handle Timestamp conversion safely
                            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
                            updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
                        };
                    }) as T[];

                    setData(items);
                    setLoading(false);
                },
                (err) => {
                    console.error("Realtime sync error:", err);
                    setError(err);
                    setLoading(false);
                }
            );

            return () => unsubscribe();
        } catch (err) {
            console.error("Setup error:", err);
            setError(err as Error);
            setLoading(false);
        }
    }, [collectionName]); // Constraints should be memoized by caller or ignored in dependency array to prevent loops if not memoized

    return { data, loading, error };
};
