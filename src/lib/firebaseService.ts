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

  const path = `registrations`;
  try {
    await setDoc(doc(db, path, id), record);
    return record;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${path}/${id}`);
    throw error;
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

  const path = `trainerBookings`;
  try {
    await setDoc(doc(db, path, id), record);
    return record;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${path}/${id}`);
    throw error;
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

  const path = `classBookings`;
  try {
    await setDoc(doc(db, path, id), record);
    return record;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${path}/${id}`);
    throw error;
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

  const path = `enquiries`;
  try {
    await setDoc(doc(db, path, id), record);
    return record;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${path}/${id}`);
    throw error;
  }
}

// Read Scoped Collections
export async function getUserRegistrations(userId: string): Promise<MembershipRegistration[]> {
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
    handleFirestoreError(error, OperationType.LIST, path);
    throw error;
  }
}

export async function getUserTrainerBookings(userId: string): Promise<PersonalTrainerBooking[]> {
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
    handleFirestoreError(error, OperationType.LIST, path);
    throw error;
  }
}

export async function getUserClassBookings(userId: string): Promise<ClassBooking[]> {
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
    handleFirestoreError(error, OperationType.LIST, path);
    throw error;
  }
}

export async function getUserEnquiries(userId: string): Promise<EnquirySubmission[]> {
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
    handleFirestoreError(error, OperationType.LIST, path);
    throw error;
  }
}

// Cancellations
export async function deleteUserRegistration(id: string): Promise<void> {
  const path = `registrations`;
  try {
    await deleteDoc(doc(db, path, id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${path}/${id}`);
    throw error;
  }
}

export async function deleteUserTrainerBooking(id: string): Promise<void> {
  const path = `trainerBookings`;
  try {
    await deleteDoc(doc(db, path, id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${path}/${id}`);
    throw error;
  }
}

export async function deleteUserClassBooking(id: string): Promise<void> {
  const path = `classBookings`;
  try {
    await deleteDoc(doc(db, path, id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${path}/${id}`);
    throw error;
  }
}

export async function deleteUserEnquiry(id: string): Promise<void> {
  const path = `enquiries`;
  try {
    await deleteDoc(doc(db, path, id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${path}/${id}`);
    throw error;
  }
}
