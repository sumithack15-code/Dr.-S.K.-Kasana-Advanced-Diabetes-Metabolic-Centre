export interface ClinicSettings {
  clinicName: string;
  address: string;
  phone: string;
  whatsappNumber: string;
  rating: number;
  reviewCount: number;
  consultationDuration: number;
  workingDays: number[];
  morningStart: string;
  morningEnd: string;
  eveningStart: string;
  eveningEnd: string;
  holidays: string[];
  blockedDates: string[];
  blockedSlots: { date: string; timeSlot: string }[];
  doctorName: string;
  doctorSpecializationPlaceholder: string;
  doctorQualificationPlaceholder: string;
  doctorRegistrationPlaceholder: string;
}

export interface Appointment {
  id: string;
  reference: string;
  patientName: string;
  mobile: string;
  email?: string;
  age?: number;
  gender?: string;
  consultationType: 'In-Person Clinic Visit' | 'Video / Tele-Consultation';
  visitType: 'First-Time Visit' | 'Follow-Up Visit';
  primaryConcern: string;
  notes?: string;
  date: string; // YYYY-MM-DD
  timeSlot: string;
  status: 'CONFIRMED' | 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED';
  createdAt: string;
  internalNotes?: string;
  cancellationReason?: string;
}

export interface SlotAvailability {
  timeSlot: string;
  isAvailable: boolean;
  status: 'AVAILABLE' | 'BOOKED' | 'BLOCKED';
}

export interface DayAvailabilityResponse {
  success: boolean;
  date: string;
  isClosed: boolean;
  reason?: string;
  totalSlots?: number;
  availableSlotsCount?: number;
  slots: SlotAvailability[];
}

export interface ServiceItem {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  focusAreas: string[];
  icon: string;
  idealFor: string;
}

export interface EducationalArticle {
  id: string;
  slug: string;
  title: string;
  category: string;
  readTime: string;
  summary: string;
  content: string[];
  keyTakeaways: string[];
  reviewedBy: string;
}
