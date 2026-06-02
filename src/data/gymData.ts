/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Trainer, GymClass, MembershipPlan, TransformationStory, Testimonial, WorkoutProgram } from '../types';
import galleryImg1 from '../assets/images/regenerated_image_1780331545800.jpg';
import galleryImg2 from '../assets/images/regenerated_image_1780331550279.jpg';
import galleryImg3 from '../assets/images/regenerated_image_1780331548236.jpg';
import galleryImg4 from '../assets/images/regenerated_image_1780331543674.jpg';
import galleryImgNew0 from '../assets/images/regenerated_image_1780414719576.jpg';
import galleryImgNew5 from '../assets/images/regenerated_image_1780414717917.jpg';

export const GYM_LOCATION = {
  address: "New Arya Nagar, Patel Nagar 3, Patel Nagar, Ghaziabad, Uttar Pradesh 201001",
  plusCode: "MCGG+Q3G",
  whatsappNumber: "919910812507", // Editable virtual number for click-to-chat
  phone: "+919910812507",
  email: "aayush.fitnessmolecules@gmail.com",
  workingHours: [
    { days: "Mon - Sat", hours: "05:00 AM - 10:00 PM" },
    { days: "Sunday", hours: "Closed" }
  ]
};

export const TRAINERS: Trainer[] = [
  {
    id: "t1",
    name: "Dr. Kabir Malhotra",
    role: "Elite Head Trainer & Physiotherapist",
    photo: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=600&q=80",
    experience: "12+ Years",
    rating: 4.9,
    specializations: ["Kinesiology", "Injury Rehabilitation", "Hypertrophy", "Posture Correction"],
    biography: "Holding a doctorate in physical therapy, Dr. Kabir combines science-backed training protocols with clinical biomechanics to maximize muscle gain safely.",
    schedule: ["06:00 AM", "08:00 AM", "10:00 AM", "04:00 PM", "06:00 PM"]
  },
  {
    id: "t3",
    name: "Ananya Sen",
    role: "Advanced Yoga & Pilates Instructor",
    photo: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80",
    experience: "7 Years",
    rating: 4.9,
    specializations: ["Ashtanga Yoga", "Mobility Drills", "Core Stability", "Meditation & Mindfulness"],
    biography: "Ananya trained in Rishikesh and has spent years crafting customized mobility programs that improve joint longevity, cognitive clarity, and athletic performance.",
    schedule: ["06:00 AM", "08:00 AM", "10:45 AM", "04:30 PM", "06:00 PM"]
  },
  {
    id: "t4",
    name: "Vikram Rathore",
    role: "Athletic Conditioning & Boxing Coach",
    photo: "https://images.unsplash.com/photo-1548690312-e3b507d8c110?auto=format&fit=crop&w=600&q=80",
    experience: "10 Years",
    rating: 4.8,
    specializations: ["Cardio Kickboxing", "Agility Drills", "Fat Oxidation", "HIIT Training"],
    biography: "Vikram is a former state boxing gold-medalist who translates competitive boxing training into fierce, high-energy fat-loss workouts.",
    schedule: ["05:00 AM", "07:00 AM", "09:00 AM", "03:00 PM", "05:00 PM", "07:00 PM"]
  }
];

export const CLASSES: GymClass[] = [
  {
    id: "c1",
    name: "Hypertrophy & Strength",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
    category: "Strength",
    duration: "60 mins",
    level: "Intermediate",
    description: "Scientifically structured progressive overload sessions targeting compound and isolation movements for maximum athletic hypertrophy and bone density.",
    scheduleTimes: ["Mon/Wed/Fri - 06:00 AM", "Mon/Wed/Fri - 05:00 PM", "Mon/Wed/Fri - 07:00 PM"],
    trainers: [TRAINERS[0]] // Dr. Kabir Malhotra
  },
  {
    id: "c2",
    name: "Tactical CrossFit & Conditioning",
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
    category: "Functional",
    duration: "45 mins",
    level: "Advanced",
    description: "High-intensity metabolic conditioning (MetCon) utilizing kettlebells, plyometric boxes, ropes, and rowers for elite cardiovascular endurance.",
    scheduleTimes: ["Tue/Thu/Sat - 07:00 AM", "Tue/Thu/Sat - 06:00 PM"],
    trainers: [TRAINERS[2]] // Vikram Rathore
  },
  {
    id: "c3",
    name: "Zen Flow Yoga & Breath Therapy",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80",
    category: "Flexibility",
    duration: "60 mins",
    level: "All Levels",
    description: "Uniting physical postures (Asanas) with controlled breathwork (Pranayama) to accelerate recovery, release muscle tension, and lower cortisol levels.",
    scheduleTimes: ["Mon/Wed/Fri - 08:00 AM", "Tue/Thu - 04:30 PM"],
    trainers: [TRAINERS[1], TRAINERS[0]] // Ananya Sen, Dr. Kabir Malhotra (injury prevention element)
  },
  {
    id: "c4",
    name: "Cardiac Oxygen Boxing",
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
    category: "Cardio",
    duration: "50 mins",
    level: "Beginner",
    description: "A fast-paced shadowboxing and heavy-bag workout incorporating agile floor work to shred calorie reservoirs and improve focus, coordination, and reflex times.",
    scheduleTimes: ["Tue/Thu/Sat - 05:00 PM", "Mon/Wed/Fri - 09:00 AM"],
    trainers: [TRAINERS[2]] // Vikram Rathore
  }
];

export const PLANS: MembershipPlan[] = [
  {
    id: "p1",
    name: "Atomic Monthly",
    duration: "1 Month",
    price: "₹1,499",
    originalPrice: "₹2,499",
    features: [
      "Full access to the main gym floor",
      "Complimentary standard posture analysis",
      "Access to all strength and cardio sections",
      "Locker & shower room facilities",
      "Wi-Fi & hydration bar access"
    ],
    popular: false
  },
  {
    id: "p2",
    name: "Molecular Trimestral",
    duration: "3 Months",
    price: "₹3,499",
    originalPrice: "₹6,499",
    features: [
      "Full gym and cardio floor access",
      "1 Personal coaching consultation & orientation",
      "Monthly body composition (InBody) analysis",
      "Access to high-intensity CrossFit zones",
      "Standard diet template from our nutrition experts",
      "Locker, shower & steam amenities"
    ],
    popular: false,
    badge: "Most Standard"
  },
  {
    id: "p3",
    name: "Synthesis Semi-Annual",
    duration: "6 Months",
    price: "₹5,999",
    originalPrice: "₹11,999",
    features: [
      "All features of 3-month membership",
      "3 Personal training 1-on-1 sessions",
      "Fully customized biological diet plans",
      "Unlimited group gym classes admission",
      "Complimentary customized Molecule Gym shaker",
      "Priority trainer assistance",
      "1 Friend pass voucher per month"
    ],
    popular: true,
    badge: "Best Value"
  },
  {
    id: "p4",
    name: "Quantum Annual",
    duration: "1 Year",
    price: "₹9,499",
    originalPrice: "₹24,999",
    features: [
      "Full access for 12 months with 30-day freeze option",
      "12 Personalized body assessment reviews",
      "6 VIP 1-on-1 Private training sessions",
      "Direct WhatsApp access to clinical nutritionist",
      "Custom fitness molecule athlete gym t-shirt",
      "Unlimited access to specialized wellness events",
      "2 Friend passes per month"
    ],
    popular: false,
    badge: "Super Saver"
  }
];

export const TRANSFORMATION_STORIES: TransformationStory[] = [
  {
    id: "story1",
    name: "Anuj Sharma",
    age: 29,
    beforeWeight: "102 kg",
    afterWeight: "78 kg",
    duration: "6 Months",
    photoBefore: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=400&q=80",
    photoAfter: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=400&q=80",
    testimonial: "The precise scientific guidance by Dr. Kabir on joint loads made my heavy fat-loss safe. Fitness Molecule didn't just help me drop weight; it fixed my lower-back pain completely.",
    goal: "Fat Loss & Spine Decompression"
  },
  {
    id: "story2",
    name: "Meera Chaudhary",
    age: 26,
    beforeWeight: "46 kg",
    afterWeight: "54 kg",
    duration: "4 Months",
    photoBefore: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=400&q=80",
    photoAfter: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=400&q=80",
    testimonial: "Struggling with high metabolism, I couldn't put on muscle. Dr. Kabir's clinical biomechanics strategy and nutritional programming helped me build muscle and feel incredibly energetic.",
    goal: "Lean Muscle Hypertrophy"
  },
  {
    id: "story3",
    name: "Kartik Goel",
    age: 34,
    beforeWeight: "88 kg",
    afterWeight: "79 kg",
    duration: "3 Months",
    photoBefore: "https://images.unsplash.com/photo-1583454122781-8cf8f5af9d2b?auto=format&fit=crop&w=400&q=80",
    photoAfter: "https://images.unsplash.com/photo-1507398941214-572c25f4b1dc?auto=format&fit=crop&w=400&q=80",
    testimonial: "I had a busy IT desk-job with dreadful posture. The group sessions and core focus helped me lose the belly, regain shoulder orientation, and built high athletic posture.",
    goal: "Functional Posture & Visceral Fat Burn"
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "test1",
    name: "Rishi Chawla",
    role: "Local Business Owner",
    quote: "Hands down the most scientific gym in Ghaziabad. The equipment is premium, the trainers are highly trained doctors and certified athletes, and the hygiene is pristine.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: "test2",
    name: "Sneha Tyagi",
    role: "Software engineer",
    quote: "I love the booking feature. It is super convenient to schedule class slots on their app interface! The trainers genuinely focus on form, and they don't focus buy costly supplements.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: "test3",
    name: "Amir Khan",
    role: "Competitive Runner",
    quote: "The combination of Vikram's conditioning guidance and structured diets boosted my running speed. The facility is well-ventilated and positive. Truly unmatched energy!",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
  }
];

export const WORKOUT_PROGRAMS: WorkoutProgram[] = [
  {
    id: "prog1",
    title: "V11: Hypertrophy Split",
    description: "Designed for rapid lean mass gaining. Focused on compound pushing, pulling, and leg loaded isolation sessions with calculated density.",
    level: "Intermediate",
    days: 4,
    image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=600&q=80",
    focusedMuscle: "Full Body / Peak Power"
  },
  {
    id: "prog2",
    title: "C07: Oxygen-Torch Agility",
    description: "Athletic body weight calisthenics coupled with active rest timers. Excellent for body decomposition, boosting VO2 max, and rapid calorie burn.",
    level: "All Levels",
    days: 5,
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80",
    focusedMuscle: "Cardiovascular Core"
  },
  {
    id: "prog3",
    title: "M03: Joint Longevity & Posture",
    description: "Focuses on muscular balances, spine decompression, rotator cuff activation, glute drive, and restoring natural anatomical movement patterns.",
    level: "Beginner",
    days: 3,
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80",
    focusedMuscle: "Mobility & Structural Alignment"
  }
];

export const GALLERY_IMGS = [
  {
    url: galleryImgNew0,
    caption: "Premium Heavy Loading Zone"
  },
  {
    url: galleryImg1,
    caption: "Functional CrossFit Training Turf"
  },
  {
    url: galleryImg2,
    caption: "Cardio Rowing and Treadmill Deck"
  },
  {
    url: galleryImg3,
    caption: "Dynamic Boxing & Bag Station"
  },
  {
    url: galleryImg4,
    caption: "Pristine Dressing and Shower Suites"
  },
  {
    url: galleryImgNew5,
    caption: "Zen Stretching Yoga Area"
  }
];
