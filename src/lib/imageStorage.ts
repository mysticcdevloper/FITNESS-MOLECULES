/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

const DB_NAME = "molecule_image_media_db";
const DB_VERSION = 1;
const STORE_NAME = "image_blobs";

export function initImageDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Stores a locally selected image File object in IndexedDB.
 * Returns a custom protocol url string for instant rendering previews.
 */
export async function storeLocalImageBlob(id: string, file: File): Promise<string> {
  const db = await initImageDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const putRequest = store.put(file, id);
    putRequest.onsuccess = () => {
      resolve(`indexeddb-img://${id}`);
    };
    putRequest.onerror = () => reject(putRequest.error);
  });
}

/**
 * Retrieves a locally stored image file from IndexedDB as a File object.
 */
export async function getLocalImageBlob(id: string): Promise<File | null> {
  try {
    const db = await initImageDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const getRequest = store.get(id);
      getRequest.onsuccess = () => resolve(getRequest.result || null);
      getRequest.onerror = () => reject(getRequest.error);
    });
  } catch (err) {
    console.error("IndexedDB image get failure:", err);
    return null;
  }
}

/**
 * Removes a locally stored image file from IndexedDB.
 */
export async function deleteLocalImageBlob(id: string): Promise<void> {
  try {
    const db = await initImageDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const deleteRequest = store.delete(id);
      deleteRequest.onsuccess = () => resolve();
      deleteRequest.onerror = () => reject(deleteRequest.error);
    });
  } catch (err) {
    console.error("Failed to delete local image blob:", err);
  }
}

/**
 * Resizes and compresses an image file to a base64 string.
 * This makes the image lightweight and portable to be stored directly in Firestore database,
 * making it visible across all devices.
 */
export function compressAndConvertToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        // Define maximum dimensions (e.g. 250x250 for a profile thumbnail)
        const MAX_WIDTH = 250;
        const MAX_HEIGHT = 250;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          // If 2d canvas is not supported, fall back to the original loaded base64 representation
          resolve(event.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        // Compress as JPEG with 0.7 quality to keep size tiny (usually 5KB - 15KB)
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        resolve(dataUrl);
      };
      img.onerror = (err) => {
        reject(err);
      };
    };
    reader.onerror = (err) => {
      reject(err);
    };
  });
}

