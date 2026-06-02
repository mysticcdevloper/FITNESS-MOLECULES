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
import { MembershipRegistration, PersonalTrainerBooking, ClassBooking, EnquirySubmission } from "../types";

// --- SEAMLESS STATIC FALLBACK LAYER ---
let fallbackMode = localStorage.getItem('molecule_use_fallback') === 'true';

export function isFallbackActive(): boolean {
  return fallbackMode;
}

export function triggerLocalFallback() {
  if (!fallbackMode) {
    fallbackMode = true;
    localStorage.setItem('molecule_use_fallback', 'true');
    window.dispatchEvent(new Event('molecule_fallback_changed'));
  }
}

export function disableLocalFallback() {
  fallbackMode = false;
  localStorage.removeItem('molecule_use_fallback');
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

