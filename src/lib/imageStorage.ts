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
 * Compresses any image file client-side and converts it to a standard, lightweight Base64 JPEG data URL.
 * Under 1MB makes it safely storable in Google Firestore so it uploads globally to everyone on the internet.
 */
export function compressAndConvertToBase64(file: File, maxDimension: number = 1000, quality: number = 0.75): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Downscale proportional to maxDimension
          if (width > height) {
            if (width > maxDimension) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            }
          } else {
            if (height > maxDimension) {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error("Could not acquire 2D canvas context for image scaling."));
            return;
          }

          // Render scaled image to canvas
          ctx.drawImage(img, 0, 0, width, height);
          
          // Export as compressed jpeg quality data URL
          const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedBase64);
        } catch (err) {
          reject(err);
        }
      };
      
      img.onerror = () => {
        reject(new Error("Unable to parse selected image file. Please check format."));
      };
      
      if (e.target?.result) {
        img.src = e.target.result as string;
      } else {
        reject(new Error("Failed to read image source."));
      }
    };
    
    reader.onerror = () => {
      reject(new Error("Failed reading the local photograph."));
    };
    
    reader.readAsDataURL(file);
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
