import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  query, 
  where, 
  deleteDoc,
  serverTimestamp
} from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../firebase";
import { MembershipRegistration, PersonalTrainerBooking, ClassBooking, EnquirySubmission, AttendanceRecord, Video, Photograph } from "../types";

// --- SEAMLESS STATIC FALLBACK LAYER ---
let fallbackMode = false;
try {
  fallbackMode = localStorage.getItem('molecule_use_fallback') === 'true';
} catch {
  // Safe default for sandboxed / private environments
}

export function isFallbackActive(): boolean {
  return fallbackMode;
}

export function triggerLocalFallback() {
  if (!fallbackMode) {
    fallbackMode = true;
    try {
      localStorage.setItem('molecule_use_fallback', 'true');
    } catch {
      // ignore
    }
    window.dispatchEvent(new Event('molecule_fallback_changed'));
  }
}

export function disableLocalFallback() {
  fallbackMode = false;
  try {
    localStorage.removeItem('molecule_use_fallback');
  } catch {
    // ignore
  }
  window.dispatchEvent(new Event('molecule_fallback_changed'));
}

function getLocal<T>(key: string): T[] {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveLocal<T>(key: string, items: T[]) {
  try {
    localStorage.setItem(key, JSON.stringify(items));
  } catch (err) {
    console.error("Local storage sync error:", err);
  }
}

// Scoped to direct subcollections based on zero-trust schema

export async function saveRegistration(userId: string, reg: Omit<MembershipRegistration, 'id' | 'createdAt'>): Promise<MembershipRegistration> {
  const id = Math.random().toString(36).substring(2, 11);
  const createdAt = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const record: MembershipRegistration = {
    ...reg,
    id,
    userId,
    createdAt
  };

  if (isFallbackActive()) {
    const list = getLocal<MembershipRegistration>('molecule_registrations');
    list.unshift(record);
    saveLocal('molecule_registrations', list);
    return record;
  }

  const path = `registrations`;
  try {
    await setDoc(doc(db, path, id), record);
    return record;
  } catch (error) {
    console.warn("Firestore save failed, routing to local sandbox storage:", error);
    triggerLocalFallback();
    const list = getLocal<MembershipRegistration>('molecule_registrations');
    list.unshift(record);
    saveLocal('molecule_registrations', list);
    return record;
  }
}

export async function saveTrainerBooking(userId: string, booking: Omit<PersonalTrainerBooking, 'id' | 'createdAt'>): Promise<PersonalTrainerBooking> {
  const id = Math.random().toString(36).substring(2, 11);
  const createdAt = new Date().toLocaleDateString('en-IN');

  const record: PersonalTrainerBooking = {
    ...booking,
    id,
    userId,
    createdAt
  };

  if (isFallbackActive()) {
    const list = getLocal<PersonalTrainerBooking>('molecule_trainerBookings');
    list.unshift(record);
    saveLocal('molecule_trainerBookings', list);
    return record;
  }

  const path = `trainerBookings`;
  try {
    await setDoc(doc(db, path, id), record);
    return record;
  } catch (error) {
    console.warn("Firestore save failed, routing to local sandbox storage:", error);
    triggerLocalFallback();
    const list = getLocal<PersonalTrainerBooking>('molecule_trainerBookings');
    list.unshift(record);
    saveLocal('molecule_trainerBookings', list);
    return record;
  }
}

export async function saveClassBooking(userId: string, booking: Omit<ClassBooking, 'id' | 'createdAt'>): Promise<ClassBooking> {
  const id = Math.random().toString(36).substring(2, 11);
  const createdAt = new Date().toLocaleDateString('en-IN');

  const record: ClassBooking = {
    ...booking,
    id,
    userId,
    createdAt
  };

  if (isFallbackActive()) {
    const list = getLocal<ClassBooking>('molecule_classBookings');
    list.unshift(record);
    saveLocal('molecule_classBookings', list);
    return record;
  }

  const path = `classBookings`;
  try {
    await setDoc(doc(db, path, id), record);
    return record;
  } catch (error) {
    console.warn("Firestore save failed, routing to local sandbox storage:", error);
    triggerLocalFallback();
    const list = getLocal<ClassBooking>('molecule_classBookings');
    list.unshift(record);
    saveLocal('molecule_classBookings', list);
    return record;
  }
}

export async function saveEnquiry(userId: string, enq: Omit<EnquirySubmission, 'id' | 'createdAt'>): Promise<EnquirySubmission> {
  const id = Math.random().toString(36).substring(2, 11);
  const createdAt = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit'
  });

  const record: EnquirySubmission = {
    ...enq,
    id,
    userId,
    createdAt
  };

  if (isFallbackActive()) {
    const list = getLocal<EnquirySubmission>('molecule_enquiries');
    list.unshift(record);
    saveLocal('molecule_enquiries', list);
    return record;
  }

  const path = `enquiries`;
  try {
    await setDoc(doc(db, path, id), record);
    return record;
  } catch (error) {
    console.warn("Firestore save failed, routing to local sandbox storage:", error);
    triggerLocalFallback();
    const list = getLocal<EnquirySubmission>('molecule_enquiries');
    list.unshift(record);
    saveLocal('molecule_enquiries', list);
    return record;
  }
}

// Read Scoped Collections
export async function getUserRegistrations(userId: string): Promise<MembershipRegistration[]> {
  if (isFallbackActive()) {
    return getLocal<MembershipRegistration>('molecule_registrations').filter(r => r.userId === userId || r.email === userId);
  }
  const path = `registrations`;
  try {
    const q = query(collection(db, path), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const list: MembershipRegistration[] = [];
    querySnapshot.forEach((doc) => {
      list.push(doc.data() as MembershipRegistration);
    });
    return list;
  } catch (error) {
    console.warn("Firestore query failed, loading local fallback records:", error);
    triggerLocalFallback();
    return getLocal<MembershipRegistration>('molecule_registrations').filter(r => r.userId === userId || r.email === userId);
  }
}

export async function getUserTrainerBookings(userId: string): Promise<PersonalTrainerBooking[]> {
  if (isFallbackActive()) {
    return getLocal<PersonalTrainerBooking>('molecule_trainerBookings').filter(b => b.userId === userId || b.clientEmail === userId);
  }
  const path = `trainerBookings`;
  try {
    const q = query(collection(db, path), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const list: PersonalTrainerBooking[] = [];
    querySnapshot.forEach((doc) => {
      list.push(doc.data() as PersonalTrainerBooking);
    });
    return list;
  } catch (error) {
    console.warn("Firestore query failed, loading local fallback records:", error);
    triggerLocalFallback();
    return getLocal<PersonalTrainerBooking>('molecule_trainerBookings').filter(b => b.userId === userId || b.clientEmail === userId);
  }
}

export async function getUserClassBookings(userId: string): Promise<ClassBooking[]> {
  if (isFallbackActive()) {
    return getLocal<ClassBooking>('molecule_classBookings').filter(b => b.userId === userId || b.clientEmail === userId);
  }
  const path = `classBookings`;
  try {
    const q = query(collection(db, path), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const list: ClassBooking[] = [];
    querySnapshot.forEach((doc) => {
      list.push(doc.data() as ClassBooking);
    });
    return list;
  } catch (error) {
    console.warn("Firestore query failed, loading local fallback records:", error);
    triggerLocalFallback();
    return getLocal<ClassBooking>('molecule_classBookings').filter(b => b.userId === userId || b.clientEmail === userId);
  }
}

export async function getUserEnquiries(userId: string): Promise<EnquirySubmission[]> {
  if (isFallbackActive()) {
    return getLocal<EnquirySubmission>('molecule_enquiries').filter(e => e.userId === userId || e.email === userId);
  }
  const path = `enquiries`;
  try {
    const q = query(collection(db, path), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const list: EnquirySubmission[] = [];
    querySnapshot.forEach((doc) => {
      list.push(doc.data() as EnquirySubmission);
    });
    return list;
  } catch (error) {
    console.warn("Firestore query failed, loading local fallback records:", error);
    triggerLocalFallback();
    return getLocal<EnquirySubmission>('molecule_enquiries').filter(e => e.userId === userId || e.email === userId);
  }
}

// Cancellations
export async function deleteUserRegistration(id: string): Promise<void> {
  if (isFallbackActive()) {
    const list = getLocal<MembershipRegistration>('molecule_registrations');
    saveLocal('molecule_registrations', list.filter(item => item.id !== id));
    return;
  }
  const path = `registrations`;
  try {
    await deleteDoc(doc(db, path, id));
  } catch (error) {
    console.warn("Firestore delete failed, loading local fallback records:", error);
    triggerLocalFallback();
    const list = getLocal<MembershipRegistration>('molecule_registrations');
    saveLocal('molecule_registrations', list.filter(item => item.id !== id));
  }
}

export async function deleteUserTrainerBooking(id: string): Promise<void> {
  if (isFallbackActive()) {
    const list = getLocal<PersonalTrainerBooking>('molecule_trainerBookings');
    saveLocal('molecule_trainerBookings', list.filter(item => item.id !== id));
    return;
  }
  const path = `trainerBookings`;
  try {
    await deleteDoc(doc(db, path, id));
  } catch (error) {
    console.warn("Firestore delete failed, loading local fallback records:", error);
    triggerLocalFallback();
    const list = getLocal<PersonalTrainerBooking>('molecule_trainerBookings');
    saveLocal('molecule_trainerBookings', list.filter(item => item.id !== id));
  }
}

export async function deleteUserClassBooking(id: string): Promise<void> {
  if (isFallbackActive()) {
    const list = getLocal<ClassBooking>('molecule_classBookings');
    saveLocal('molecule_classBookings', list.filter(item => item.id !== id));
    return;
  }
  const path = `classBookings`;
  try {
    await deleteDoc(doc(db, path, id));
  } catch (error) {
    console.warn("Firestore delete failed, loading local fallback records:", error);
    triggerLocalFallback();
    const list = getLocal<ClassBooking>('molecule_classBookings');
    saveLocal('molecule_classBookings', list.filter(item => item.id !== id));
  }
}

export async function deleteUserEnquiry(id: string): Promise<void> {
  if (isFallbackActive()) {
    const list = getLocal<EnquirySubmission>('molecule_enquiries');
    saveLocal('molecule_enquiries', list.filter(item => item.id !== id));
    return;
  }
  const path = `enquiries`;
  try {
    await deleteDoc(doc(db, path, id));
  } catch (error) {
    console.warn("Firestore delete failed, loading local fallback records:", error);
    triggerLocalFallback();
    const list = getLocal<EnquirySubmission>('molecule_enquiries');
    saveLocal('molecule_enquiries', list.filter(item => item.id !== id));
  }
}

// --- ADMIN CONTROL FUNCTIONS ---

export async function getAllRegistrations(): Promise<MembershipRegistration[]> {
  if (isFallbackActive()) {
    return getLocal<MembershipRegistration>('molecule_registrations');
  }
  const path = `registrations`;
  try {
    const qSnapshot = await getDocs(collection(db, path));
    const list: MembershipRegistration[] = [];
    qSnapshot.forEach((doc) => {
      list.push(doc.data() as MembershipRegistration);
    });
    return list;
  } catch (error) {
    console.warn("Firestore admin query failed, loading local fallback records:", error);
    triggerLocalFallback();
    return getLocal<MembershipRegistration>('molecule_registrations');
  }
}

export async function getAllTrainerBookings(): Promise<PersonalTrainerBooking[]> {
  if (isFallbackActive()) {
    return getLocal<PersonalTrainerBooking>('molecule_trainerBookings');
  }
  const path = `trainerBookings`;
  try {
    const qSnapshot = await getDocs(collection(db, path));
    const list: PersonalTrainerBooking[] = [];
    qSnapshot.forEach((doc) => {
      list.push(doc.data() as PersonalTrainerBooking);
    });
    return list;
  } catch (error) {
    console.warn("Firestore admin query failed, loading local fallback records:", error);
    triggerLocalFallback();
    return getLocal<PersonalTrainerBooking>('molecule_trainerBookings');
  }
}

export async function getAllClassBookings(): Promise<ClassBooking[]> {
  if (isFallbackActive()) {
    return getLocal<ClassBooking>('molecule_classBookings');
  }
  const path = `classBookings`;
  try {
    const qSnapshot = await getDocs(collection(db, path));
    const list: ClassBooking[] = [];
    qSnapshot.forEach((doc) => {
      list.push(doc.data() as ClassBooking);
    });
    return list;
  } catch (error) {
    console.warn("Firestore admin query failed, loading local fallback records:", error);
    triggerLocalFallback();
    return getLocal<ClassBooking>('molecule_classBookings');
  }
}

export async function getAllEnquiries(): Promise<EnquirySubmission[]> {
  if (isFallbackActive()) {
    return getLocal<EnquirySubmission>('molecule_enquiries');
  }
  const path = `enquiries`;
  try {
    const qSnapshot = await getDocs(collection(db, path));
    const list: EnquirySubmission[] = [];
    qSnapshot.forEach((doc) => {
      list.push(doc.data() as EnquirySubmission);
    });
    return list;
  } catch (error) {
    console.warn("Firestore admin query failed, loading local fallback records:", error);
    triggerLocalFallback();
    return getLocal<EnquirySubmission>('molecule_enquiries');
  }
}

export async function saveAttendance(attendance: Omit<AttendanceRecord, 'id' | 'createdAt'>): Promise<AttendanceRecord> {
  const id = "att_" + Math.random().toString(36).substring(2, 11);
  const createdAt = new Date().toLocaleDateString('en-IN');

  const record: AttendanceRecord = {
    ...attendance,
    id,
    createdAt
  };

  if (isFallbackActive()) {
    const list = getLocal<AttendanceRecord>('molecule_attendance');
    list.unshift(record);
    saveLocal('molecule_attendance', list);
    return record;
  }

  const path = `attendance`;
  try {
    await setDoc(doc(db, path, id), record);
    return record;
  } catch (error) {
    console.warn("Firestore save attendance failed, routing to local sandbox storage:", error);
    triggerLocalFallback();
    const list = getLocal<AttendanceRecord>('molecule_attendance');
    list.unshift(record);
    saveLocal('molecule_attendance', list);
    return record;
  }
}

export async function getAllAttendance(): Promise<AttendanceRecord[]> {
  if (isFallbackActive()) {
    const list = getLocal<AttendanceRecord>('molecule_attendance');
    if (list.length === 0) {
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      const seed: AttendanceRecord[] = [
        {
          id: "att_1",
          clientName: "Ramesh Chandra",
          clientEmail: "ramesh@molecule.fit",
          clientPhone: "9876543210",
          date: today,
          status: "Present",
          checkInTime: "06:15 AM",
          notes: "Regular morning strength routine",
          createdAt: new Date().toLocaleDateString('en-IN')
        },
        {
          id: "att_2",
          clientName: "Vijay Kumar",
          clientEmail: "vijay@molecule.fit",
          clientPhone: "9988776655",
          date: today,
          status: "Late",
          checkInTime: "07:35 AM",
          notes: "Stuck in traffic, did high intensity cardio",
          createdAt: new Date().toLocaleDateString('en-IN')
        },
        {
          id: "att_3",
          clientName: "Neha Sharma",
          clientEmail: "neha.sharma@molecule.fit",
          clientPhone: "9123456789",
          date: yesterday,
          status: "Absent",
          notes: "Informed: family emergency",
          createdAt: new Date().toLocaleDateString('en-IN')
        }
      ];
      saveLocal('molecule_attendance', seed);
      return seed;
    }
    return list;
  }
  const path = `attendance`;
  try {
    const qSnapshot = await getDocs(collection(db, path));
    const list: AttendanceRecord[] = [];
    qSnapshot.forEach((doc) => {
      list.push(doc.data() as AttendanceRecord);
    });
    return list;
  } catch (error) {
    console.warn("Firestore query attendance failed, loading local fallback records:", error);
    triggerLocalFallback();
    return getLocal<AttendanceRecord>('molecule_attendance');
  }
}

export async function deleteAttendance(id: string): Promise<void> {
  if (isFallbackActive()) {
    const list = getLocal<AttendanceRecord>('molecule_attendance');
    saveLocal('molecule_attendance', list.filter(item => item.id !== id));
    return;
  }
  const path = `attendance`;
  try {
    await deleteDoc(doc(db, path, id));
  } catch (error) {
    console.warn("Firestore delete attendance failed, loading local fallback records:", error);
    triggerLocalFallback();
    const list = getLocal<AttendanceRecord>('molecule_attendance');
    saveLocal('molecule_attendance', list.filter(item => item.id !== id));
  }
}

export async function saveVideo(video: Omit<Video, 'id' | 'createdAt'>): Promise<Video> {
  const id = "vid_" + Math.random().toString(36).substring(2, 11);
  const createdAt = new Date().toLocaleDateString('en-IN');

  const record: Video = {
    ...video,
    id,
    createdAt
  };

  if (isFallbackActive()) {
    const list = getLocal<Video>('molecule_videos');
    list.unshift(record);
    saveLocal('molecule_videos', list);
    return record;
  }

  const path = `videos`;
  try {
    await setDoc(doc(db, path, id), record);
    return record;
  } catch (error) {
    console.warn("Firestore save video failed, routing to local sandbox storage:", error);
    triggerLocalFallback();
    const list = getLocal<Video>('molecule_videos');
    list.unshift(record);
    saveLocal('molecule_videos', list);
    return record;
  }
}

export async function getAllVideos(): Promise<Video[]> {
  const defaultSeeds: Video[] = [
    {
      id: "vid_1",
      uploaderName: "Ayush",
      title: "Biomechanical Squat Form Breakdown",
      description: "Detailed biomechanical walkthrough of standard squat alignment, loading the target quadriceps optimally while completely safeguarding joint integrity and postural health.",
      url: "https://www.youtube.com/embed/U5zrloYWp8g",
      createdAt: "01/06/2026"
    },
    {
      id: "vid_2",
      uploaderName: "Manu",
      title: "Perfecting Romanian Deadlifts (RDL)",
      description: "Demonstration of perfect hamstring and glute recruitment mechanics. Learn why the hip-hinge is elite for heavy loads and how Ayush and Manu setup bar paths.",
      url: "https://www.youtube.com/embed/Opz660XU048",
      createdAt: "02/06/2026"
    }
  ];

  let deletedIdsList: string[] = [];
  try {
    deletedIdsList = JSON.parse(localStorage.getItem('molecule_deleted_vids') || '[]');
  } catch {
    // Safe fallback
  }

  if (isFallbackActive()) {
    const list = getLocal<Video>('molecule_videos');
    const filteredList = list.filter(v => !deletedIdsList.includes(v.id));
    if (filteredList.length === 0 && list.length === 0) {
      const activeSeeds = defaultSeeds.filter(v => !deletedIdsList.includes(v.id));
      saveLocal('molecule_videos', activeSeeds);
      return activeSeeds;
    }
    return filteredList;
  }

  const path = `videos`;
  try {
    const qSnapshot = await getDocs(collection(db, path));
    const list: Video[] = [];
    qSnapshot.forEach((doc) => {
      const data = doc.data();
      list.push({
        id: data.id || doc.id,
        userId: data.userId || "",
        uploaderName: data.uploaderName || "",
        title: data.title || "",
        description: data.description || "",
        url: data.url || "",
        createdAt: data.createdAt || ""
      } as Video);
    });

    const filteredList = list.filter(v => v.id && !deletedIdsList.includes(v.id));

    // ALWAYS combine the fetched Firestore videos with the default seeds so they are always present!
    // This makes sure visitors ALWAYS see the YouTube videos as a baseline, even if the database is newly created or empty
    const combined = [...filteredList, ...defaultSeeds.filter(v => !deletedIdsList.includes(v.id))];
    
    // Filter for unique IDs
    return combined.filter((v, i, self) => self.findIndex(t => t.id === v.id) === i);
  } catch (error) {
    console.warn("Firestore query videos failed, loading static fallback:", error);
    triggerLocalFallback();
    const list = getLocal<Video>('molecule_videos');
    const filteredList = list.filter(v => !deletedIdsList.includes(v.id));
    if (filteredList.length === 0 && list.length === 0) {
      const activeSeeds = defaultSeeds.filter(v => !deletedIdsList.includes(v.id));
      saveLocal('molecule_videos', activeSeeds);
      return activeSeeds;
    }
    return filteredList;
  }
}

export async function deleteVideo(id: string): Promise<void> {
  let deletedIdsList: string[] = [];
  try {
    deletedIdsList = JSON.parse(localStorage.getItem('molecule_deleted_vids') || '[]');
  } catch {
    // Safe handle
  }
  if (!deletedIdsList.includes(id)) {
    deletedIdsList.push(id);
    try {
      localStorage.setItem('molecule_deleted_vids', JSON.stringify(deletedIdsList));
    } catch {
      // Safe handle
    }
  }

  // Synchronously filter out from local client cache so state reflects changes immediately
  const list = getLocal<Video>('molecule_videos');
  saveLocal('molecule_videos', list.filter(item => item.id !== id));

  if (isFallbackActive()) {
    return;
  }
  const path = `videos`;
  try {
    await deleteDoc(doc(db, path, id));
  } catch (error) {
    console.warn("Firestore delete video failed, but local copy was cleared:", error);
    triggerLocalFallback();
  }
}

// --- PHOTOGRAPH MANAGEMENT FUNCTIONS WITH FALLBACK ---

export async function savePhotograph(photo: Omit<Photograph, 'id' | 'createdAt'>): Promise<Photograph> {
  const id = "photo_" + Math.random().toString(36).substring(2, 11);
  const createdAt = new Date().toLocaleDateString('en-IN');

  const record: Photograph = {
    ...photo,
    id,
    createdAt
  };

  if (isFallbackActive()) {
    const list = getLocal<Photograph>('molecule_photographs');
    list.unshift(record);
    saveLocal('molecule_photographs', list);
    return record;
  }

  const path = `photographs`;
  try {
    await setDoc(doc(db, path, id), record);
    return record;
  } catch (error) {
    console.warn("Firestore save photograph failed, routing to local sandbox storage:", error);
    triggerLocalFallback();
    const list = getLocal<Photograph>('molecule_photographs');
    list.unshift(record);
    saveLocal('molecule_photographs', list);
    return record;
  }
}

export async function getAllPhotographs(): Promise<Photograph[]> {
  let deletedIdsList: string[] = [];
  try {
    deletedIdsList = JSON.parse(localStorage.getItem('molecule_deleted_photos') || '[]');
  } catch {
    // Safe fallback
  }

  if (isFallbackActive()) {
    const list = getLocal<Photograph>('molecule_photographs');
    return list.filter(p => !deletedIdsList.includes(p.id));
  }

  const path = `photographs`;
  try {
    const qSnapshot = await getDocs(collection(db, path));
    const list: Photograph[] = [];
    qSnapshot.forEach((doc) => {
      const data = doc.data();
      list.push({
        id: data.id,
        userId: data.userId || "",
        uploaderName: data.uploaderName || "",
        caption: data.caption || "",
        url: data.url || "",
        createdAt: data.createdAt || ""
      } as Photograph);
    });

    return list.filter(p => !deletedIdsList.includes(p.id));
  } catch (error) {
    console.warn("Firestore query photographs failed, loading local fallback:", error);
    triggerLocalFallback();
    const list = getLocal<Photograph>('molecule_photographs');
    return list.filter(p => !deletedIdsList.includes(p.id));
  }
}

export async function deletePhotograph(id: string): Promise<void> {
  let deletedIdsList: string[] = [];
  try {
    deletedIdsList = JSON.parse(localStorage.getItem('molecule_deleted_photos') || '[]');
  } catch {
    // Safe fallback
  }
  if (!deletedIdsList.includes(id)) {
    deletedIdsList.push(id);
    try {
      localStorage.setItem('molecule_deleted_photos', JSON.stringify(deletedIdsList));
    } catch {
      // Safe fallback
    }
  }

  // Synchronously filter out database/client local caches
  const list = getLocal<Photograph>('molecule_photographs');
  saveLocal('molecule_photographs', list.filter(item => item.id !== id));

  if (isFallbackActive()) {
    return;
  }
  const path = `photographs`;
  try {
    await deleteDoc(doc(db, path, id));
  } catch (error) {
    console.warn("Firestore delete photograph failed, but local copy was cleared:", error);
    triggerLocalFallback();
  }
}

