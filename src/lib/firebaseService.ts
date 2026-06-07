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
import { MembershipRegistration, PersonalTrainerBooking, ClassBooking, EnquirySubmission, AttendanceRecord, Video, Photograph, Review } from "../types";

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
      id: "vid_3",
      uploaderName: "Co-Founders",
      title: "FITNESS MOLECULES GYM OVERVIEW",
      description: "A comprehensive physical walkthrough demonstrating our state-of-the-art training zones, premium high-load machines, and vibrant athlete workout energy.",
      url: "https://www.youtube.com/embed/LK97h_8ILP8",
      createdAt: "04/06/2026"
    },
    {
      id: "vid_4",
      uploaderName: "Aaru",
      title: "Gym Floor Core Exercises",
      description: "A selection of highly effective core training stability and strength movements demonstrated right on our gym training floor.",
      url: "https://www.youtube.com/embed/HTyZODkhdAM",
      createdAt: "04/06/2026"
    },
    {
      id: "vid_5",
      uploaderName: "Aaru",
      title: "EXERCISE OVERVIEW BY AARU",
      description: "Step-by-step guidance on execution, standard posture adjustment, and peak contraction mechanics for superior strength results.",
      url: "https://www.youtube.com/embed/IqFnJSPX5Dc",
      createdAt: "04/06/2026"
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
    // Filter out old legacy seeded videos if they are cached in user localStorage to prevent obsolete items
    const userOnlyList = list.filter(v => !v.id.startsWith('vid_'));
    const filteredList = userOnlyList.filter(v => !deletedIdsList.includes(v.id));
    const combined = [...filteredList, ...defaultSeeds.filter(v => !deletedIdsList.includes(v.id))];
    return combined.filter((v, i, self) => self.findIndex(t => t.id === v.id) === i);
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
    const userOnlyList = list.filter(v => !v.id.startsWith('vid_'));
    const filteredList = userOnlyList.filter(v => !deletedIdsList.includes(v.id));
    const combined = [...filteredList, ...defaultSeeds.filter(v => !deletedIdsList.includes(v.id))];
    return combined.filter((v, i, self) => self.findIndex(t => t.id === v.id) === i);
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

// --- REVIEW PERSISTENCE FUNCTIONS ---

export async function getAllReviews(): Promise<Review[]> {
  const defaultSeeds: Review[] = [
    {
      id: "rev_seed1",
      name: "Rishi Chawla",
      role: "Local Business Owner",
      quote: "Hands down the most scientific gym in Ghaziabad. The equipment is premium, the trainers are highly trained doctors and certified athletes, and the hygiene is pristine.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      isGoogle: true,
      createdAt: "15/05/2026"
    },
    {
      id: "rev_seed2",
      name: "Sneha Tyagi",
      role: "Software Engineer",
      quote: "I love the booking feature. It is super convenient to schedule class slots on their app interface! The trainers genuinely focus on form, and they don't force buy costly supplements.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
      isGoogle: true,
      createdAt: "22/05/2026"
    },
    {
      id: "rev_seed3",
      name: "Amir Khan",
      role: "Competitive Runner",
      quote: "The combination of personalized conditioning guidance and structured diets boosted my running speed. The facility is well-ventilated and positive. Truly unmatched energy!",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      isGoogle: true,
      createdAt: "01/06/2026"
    },
    {
      id: "rev_seed4",
      name: "Rupesh Kumar",
      role: "Fitness Enthusiast",
      quote: "Amazing gym with certified trainers. Ayush Pal provided me with custom diet plans that helped me gain strength and lean muscle within weeks. Best premium scientific layout!",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
      isGoogle: true,
      createdAt: "03/06/2026"
    },
    {
      id: "rev_seed5",
      name: "Varun Sharma",
      role: "Athlete / Bodybuilder",
      quote: "Perfect biomechanical machines. Clean space, highly professional team, and high density dumbbells with Watson premium gears. Highly recommended for serious athletes!",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
      isGoogle: true,
      createdAt: "05/06/2026"
    }
  ];

  let deletedIdsList: string[] = [];
  try {
    deletedIdsList = JSON.parse(localStorage.getItem('molecule_deleted_reviews') || '[]');
  } catch {
    // ignore
  }

  if (isFallbackActive()) {
    const list = getLocal<Review>('molecule_reviews');
    const userOnlyList = list.filter(r => !r.id.startsWith('rev_seed'));
    const filteredList = userOnlyList.filter(r => !deletedIdsList.includes(r.id));
    const combined = [...filteredList, ...defaultSeeds.filter(r => !deletedIdsList.includes(r.id))];
    return combined;
  }

  const path = `reviews`;
  try {
    const qSnapshot = await getDocs(collection(db, path));
    const list: Review[] = [];
    qSnapshot.forEach((doc) => {
      const data = doc.data();
      list.push({
        id: data.id || doc.id,
        userId: data.userId || "",
        name: data.name || "",
        role: data.role || "",
        quote: data.quote || "",
        rating: Number(data.rating || 5),
        avatar: data.avatar || "",
        createdAt: data.createdAt || "",
        isGoogle: data.isGoogle || false
      } as Review);
    });
    const filteredList = list.filter(r => !deletedIdsList.includes(r.id));
    const combined = [...filteredList, ...defaultSeeds.filter(r => !deletedIdsList.includes(r.id))];
    return combined.filter((v, i, self) => self.findIndex(t => t.id === v.id) === i);
  } catch (error) {
    console.warn("Firestore query reviews failed, loading fallback configuration:", error);
    triggerLocalFallback();
    const list = getLocal<Review>('molecule_reviews');
    const userOnlyList = list.filter(r => !r.id.startsWith('rev_seed'));
    const filteredList = userOnlyList.filter(r => !deletedIdsList.includes(r.id));
    const combined = [...filteredList, ...defaultSeeds.filter(r => !deletedIdsList.includes(r.id))];
    return combined;
  }
}

export async function saveReview(review: Omit<Review, 'id' | 'createdAt'>): Promise<Review> {
  const id = "rev_" + Math.random().toString(36).substring(2, 11);
  const createdAt = new Date().toLocaleDateString('en-IN');

  const record: Review = {
    ...review,
    id,
    createdAt
  };

  if (isFallbackActive()) {
    const list = getLocal<Review>('molecule_reviews');
    list.unshift(record);
    saveLocal('molecule_reviews', list);
    return record;
  }

  const path = `reviews`;
  try {
    await setDoc(doc(db, path, id), record);
    return record;
  } catch (error) {
    console.warn("Firestore save review failed, routing to local sandbox storage:", error);
    triggerLocalFallback();
    const list = getLocal<Review>('molecule_reviews');
    list.unshift(record);
    saveLocal('molecule_reviews', list);
    return record;
  }
}

export async function deleteReview(id: string): Promise<void> {
  let deletedIdsList: string[] = [];
  try {
    deletedIdsList = JSON.parse(localStorage.getItem('molecule_deleted_reviews') || '[]');
  } catch {
    // Safe fallback
  }
  if (!deletedIdsList.includes(id)) {
    deletedIdsList.push(id);
    try {
      localStorage.setItem('molecule_deleted_reviews', JSON.stringify(deletedIdsList));
    } catch {
      // Safe fallback
    }
  }

  const list = getLocal<Review>('molecule_reviews');
  saveLocal('molecule_reviews', list.filter(item => item.id !== id));

  if (isFallbackActive()) {
    return;
  }
  const path = `reviews`;
  try {
    await deleteDoc(doc(db, path, id));
  } catch (error) {
    console.warn("Firestore delete review failed, but local copy was cleared:", error);
    triggerLocalFallback();
  }
}

// --- CLOUD FIRESTORE MASTER SEEDING FUNCTION ---
export async function seedLiveFirestoreData(): Promise<{ success: boolean; seededCounts: Record<string, number> }> {
  const seededCounts: Record<string, number> = {
    reviews: 0,
    videos: 0,
    attendance: 0,
    registrations: 0,
    trainerBookings: 0,
    enquiries: 0
  };

  // Seed Reviews
  const reviewsToSeed = [
    {
      id: "rev_seed1",
      userId: "system_seed",
      name: "Rishi Chawla",
      role: "Local Business Owner",
      quote: "Hands down the most scientific gym in Ghaziabad. The equipment is premium, the trainers are highly trained doctors and certified athletes, and the hygiene is pristine.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      isGoogle: true,
      createdAt: "15/05/2026"
    },
    {
      id: "rev_seed2",
      userId: "system_seed",
      name: "Sneha Tyagi",
      role: "Software Engineer",
      quote: "I love the booking feature. It is super convenient to schedule class slots on their app interface! The trainers genuinely focus on form, and they don't force buy costly supplements.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
      isGoogle: true,
      createdAt: "22/05/2026"
    },
    {
      id: "rev_seed3",
      userId: "system_seed",
      name: "Amir Khan",
      role: "Competitive Runner",
      quote: "The combination of personalized conditioning guidance and structured diets boosted my running speed. The facility is well-ventilated and positive. Truly unmatched energy!",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      isGoogle: true,
      createdAt: "01/06/2026"
    },
    {
      id: "rev_seed4",
      userId: "system_seed",
      name: "Rupesh Kumar",
      role: "Fitness Enthusiast",
      quote: "Amazing gym with certified trainers. Ayush Pal provided me with custom diet plans that helped me gain strength and lean muscle within weeks. Best premium scientific layout!",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
      isGoogle: true,
      createdAt: "03/06/2026"
    },
    {
      id: "rev_seed5",
      userId: "system_seed",
      name: "Varun Sharma",
      role: "Athlete / Bodybuilder",
      quote: "Perfect biomechanical machines. Clean space, highly professional team, and high density dumbbells with Watson premium gears. Highly recommended for serious athletes!",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
      isGoogle: true,
      createdAt: "05/06/2026"
    }
  ];

  for (const r of reviewsToSeed) {
    await setDoc(doc(db, "reviews", r.id), r);
    seededCounts.reviews++;
  }

  // Seed Videos
  const videosToSeed = [
    {
      id: "vid_3",
      userId: "system_seed",
      uploaderName: "Co-Founders",
      title: "FITNESS MOLECULES GYM OVERVIEW",
      description: "A comprehensive physical walkthrough demonstrating our state-of-the-art training zones, premium high-load machines, and vibrant athlete workout energy.",
      url: "https://www.youtube.com/embed/LK97h_8ILP8",
      createdAt: "04/06/2026"
    },
    {
      id: "vid_4",
      userId: "system_seed",
      uploaderName: "Aaru",
      title: "Gym Floor Core Exercises",
      description: "A selection of highly effective core training stability and strength movements demonstrated right on our gym training floor.",
      url: "https://www.youtube.com/embed/HTyZODkhdAM",
      createdAt: "04/06/2026"
    },
    {
      id: "vid_5",
      userId: "system_seed",
      uploaderName: "Aaru",
      title: "EXERCISE OVERVIEW BY AARU",
      description: "Step-by-step guidance on execution, standard posture adjustment, and peak contraction mechanics for superior strength results.",
      url: "https://www.youtube.com/embed/IqFnJSPX5Dc",
      createdAt: "04/06/2026"
    }
  ];

  for (const v of videosToSeed) {
    await setDoc(doc(db, "videos", v.id), v);
    seededCounts.videos++;
  }

  // Seed Attendance
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  const attendanceToSeed = [
    {
      id: "att_1",
      clientName: "Ramesh Chandra",
      clientEmail: "ramesh@molecule.fit",
      clientPhone: "9876543210",
      date: today,
      status: "Present",
      checkInTime: "06:15 AM",
      notes: "Regular morning strength routine",
      createdAt: new Date().toLocaleDateString("en-IN")
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
      createdAt: new Date().toLocaleDateString("en-IN")
    },
    {
      id: "att_3",
      clientName: "Neha Sharma",
      clientEmail: "neha.sharma@molecule.fit",
      clientPhone: "9123456789",
      date: yesterday,
      status: "Absent",
      notes: "Informed: family emergency",
      createdAt: new Date().toLocaleDateString("en-IN")
    }
  ];

  for (const a of attendanceToSeed) {
    await setDoc(doc(db, "attendance", a.id), a);
    seededCounts.attendance++;
  }

  // Seed a sample Registration
  const sampleReg = {
    id: "reg_default_demo_1",
    userId: "admin_seed",
    planId: "p2",
    planName: "Platinum Club Elite Membership",
    planDuration: "12 Months",
    planPrice: "₹18,000",
    fullName: "Rupesh Kumar",
    email: "itsofficialrupeshcsa@gmail.com",
    phone: "9876543210",
    startDate: today,
    paymentMethod: "gpay",
    createdAt: new Date().toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    })
  };
  await setDoc(doc(db, "registrations", sampleReg.id), sampleReg);
  seededCounts.registrations++;

  // Seed sample Trainer Booking
  const sampleTrainer = {
    id: "tb_default_demo_1",
    userId: "admin_seed",
    trainerId: "t1",
    trainerName: "Dr. Ayush Pal",
    clientName: "Varun Sharma",
    clientEmail: "varun@athlete.fit",
    clientPhone: "9112233445",
    bookingDate: today,
    bookingTime: "08:00 AM",
    notes: "Postural assessment and biomechanics alignment orientation",
    createdAt: new Date().toLocaleDateString("en-IN")
  };
  await setDoc(doc(db, "trainerBookings", sampleTrainer.id), sampleTrainer);
  seededCounts.trainerBookings++;

  // Seed sample Enquiry
  const sampleEnquiry = {
    id: "enq_default_demo_1",
    userId: "admin_seed",
    clientName: "Amit Ghaziabad",
    clientPhone: "9000011111",
    clientEmail: "amit@gmail.com",
    age: 29,
    fitnessGoal: "Muscle Gain",
    message: "Hi, I am looking to join the elite Watson dumbbells training zone. What are the timings?",
    createdAt: new Date().toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit"
    })
  };
  await setDoc(doc(db, "enquiries", sampleEnquiry.id), sampleEnquiry);
  seededCounts.enquiries++;

  return { success: true, seededCounts };
}

