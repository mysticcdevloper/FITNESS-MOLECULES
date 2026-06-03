/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

const DB_NAME = "molecule_video_media_db";
const DB_VERSION = 1;
const STORE_NAME = "video_blobs";

export function initVideoDB(): Promise<IDBDatabase> {
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
 * Stores a locally selected video File object in IndexedDB.
 * Returns a base64 encoded data string or the object URL reference for instant previews.
 */
export async function storeLocalVideoBlob(id: string, file: File): Promise<string> {
  const db = await initVideoDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const putRequest = store.put(file, id);
    putRequest.onsuccess = () => {
      resolve(`indexeddb://${id}`);
    };
    putRequest.onerror = () => reject(putRequest.error);
  });
}

/**
 * Retrieves a locally stored video file from IndexedDB as a File object.
 */
export async function getLocalVideoBlob(id: string): Promise<File | null> {
  try {
    const db = await initVideoDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const getRequest = store.get(id);
      getRequest.onsuccess = () => resolve(getRequest.result || null);
      getRequest.onerror = () => reject(getRequest.error);
    });
  } catch (err) {
    console.error("IndexedDB get failure:", err);
    return null;
  }
}

/**
 * Removes a locally stored video file from IndexedDB.
 */
export async function deleteLocalVideoBlob(id: string): Promise<void> {
  try {
    const db = await initVideoDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const deleteRequest = store.delete(id);
      deleteRequest.onsuccess = () => resolve();
      deleteRequest.onerror = () => reject(deleteRequest.error);
    });
  } catch (err) {
    console.error("Failed to delete local video blob:", err);
  }
}
