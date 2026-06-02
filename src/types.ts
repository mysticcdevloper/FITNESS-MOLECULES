/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Trainer {
  id: string;
  name: string;
  role: string;
  photo: string;
  experience: string;
  rating: number;
  specializations: string[];
  biography: string;
  schedule: string[]; // e.g., ["08:00 AM", "11:00 AM", "04:00 PM", "06:00 PM"]
}

export interface GymClass {
  id: string;
  name: string;
  image: string;
  category: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  description: string;
  scheduleTimes: string[]; // e.g., ["Mon/Wed/Fri - 07:00 AM", "Tue/Thu - 06:00 PM"]
  trainers: Trainer[]; // Multiple trainers per class
}

export interface MembershipPlan {
  id: string;
  name: string;
  duration: string;
  price: string;
  originalPrice?: string;
  features: string[];
  popular: boolean;
  badge?: string;
}

export interface TransformationStory {
  id: string;
  name: string;
  age: number;
  beforeWeight: string;
  afterWeight: string;
  duration: string;
  photoBefore: string;
  photoAfter: string;
  testimonial: string;
  goal: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
  avatar: string;
}

export interface WorkoutProgram {
  id: string;
  title: string;
  description: string;
  level: string;
  days: number;
  image: string;
  focusedMuscle: string;
}

export interface EnquirySubmission {
  id: string;
  userId?: string;
  name: string;
  phone: string;
  email: string;
  age: number;
  fitnessGoal: string;
  message: string;
  createdAt: string;
}

export interface MembershipRegistration {
  id: string;
  userId?: string;
  planId: string;
  planName: string;
  planDuration: string;
  planPrice: string;
  fullName: string;
  email: string;
  phone: string;
  startDate: string;
  paymentMethod: string;
  createdAt: string;
}

export interface PersonalTrainerBooking {
  id: string;
  userId?: string;
  trainerId: string;
  trainerName: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  bookingDate: string;
  bookingTime: string;
  notes?: string;
  createdAt: string;
}

export interface ClassBooking {
  id: string;
  userId?: string;
  classId: string;
  className: string;
  trainerName: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  sessionTime: string; // Day and time chosen
  createdAt: string;
}

export interface AttendanceRecord {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  date: string; // YYYY-MM-DD
  status: 'Present' | 'Absent' | 'Late';
  checkInTime?: string;
  notes?: string;
  createdAt: string;
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const clean = email.trim().toLowerCase();
  return (
    clean === "aayush.fitnessmolecules@gmail.com" ||
    clean === "aayush.fitnessmolecule@gmail.com" ||
    clean === "itsofficialrupeshcsa@gmail.com"
  );
}
