import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
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

        const storageRef = ref(storage, `${path}/${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(storageRef, compressedFile);
        return await getDownloadURL(snapshot.ref);
    };

    return { uploadImage };
}
