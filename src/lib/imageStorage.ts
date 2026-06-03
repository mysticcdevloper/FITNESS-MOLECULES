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
