import { db } from "@/lib/firebase";
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, onSnapshot, query, where, orderBy } from "firebase/firestore";
import { useState, useEffect } from "react";

export function useFirestore() {
    const addDocument = async (collectionName: string, data: any) => {
        return await addDoc(collection(db, collectionName), {
            ...data,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
    };

    const updateDocument = async (collectionName: string, id: string, data: any) => {
        return await updateDoc(doc(db, collectionName, id), {
            ...data,
            updatedAt: serverTimestamp(),
        });
    };

    const deleteDocument = async (collectionName: string, id: string) => {
        return await deleteDoc(doc(db, collectionName, id));
    };

    return { addDocument, updateDocument, deleteDocument };
}

export function useRealtimeCollection(collectionName: string, constraints: any[] = []) {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, collectionName), ...constraints);
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setData(items);
            setLoading(false);
        });
        return () => unsubscribe();
    }, [collectionName, JSON.stringify(constraints)]);

    return { data, loading };
}
