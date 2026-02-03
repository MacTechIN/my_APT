import { app } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL, getStorage } from "firebase/storage";
import imageCompression from 'browser-image-compression';

export function useStorage() {
    const uploadImage = async (path: string, file: File) => {
        // Image Compression
        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1024,
            useWebWorker: true,
        };
        const compressedFile = await imageCompression(file, options);

        // storage is only initialized here to avoid SSR import issues
        const storage = getStorage(app);
        const storageRef = ref(storage, `${path}/${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(storageRef, compressedFile);
        return await getDownloadURL(snapshot.ref);
    };

    return { uploadImage };
}
