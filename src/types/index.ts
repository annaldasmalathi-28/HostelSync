export type UserRole = 'student' | 'admin' | 'technician';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  avatarUrl?: string;
  studentId?: string; // Roll number e.g. CS2024-042
  roomNumber?: string;
  blockName?: string;
  bedId?: string;
  trade?: ComplaintCategory; // For technician
}

export interface HostelBlock {
  id: string;
  name: string;
  code: string;
  gender: 'Boys' | 'Girls' | 'Co-ed';
  totalFloors: number;
  totalRooms: number;
  description: string;
  wardenName: string;
  wardenPhone: string;
}

export type RoomType = 'single_ac' | 'double_ac' | 'double_non_ac' | 'triple_non_ac';

export interface Room {
  id: string;
  blockId: string;
  blockName: string;
  roomNumber: string;
  floor: number;
  roomType: RoomType;
  totalBeds: number;
  availableBeds: number;
  rentPerTerm: number;
  amenities: string[];
}

export type BedStatus = 'available' | 'reserved' | 'occupied' | 'maintenance';

export interface Bed {
  id: string;
  roomId: string;
  blockName: string;
  roomNumber: string;
  bedNumber: string; // e.g. A-204-1
  status: BedStatus;
  currentStudentId?: string;
  currentStudentName?: string;
  currentStudentRoll?: string;
  requestedStudentId?: string;
  requestedStudentName?: string;
  requestedStudentRoll?: string;
  requestedAt?: string;
}

export interface BedBookingRequest {
  id: string;
  studentId: string;
  studentName: string;
  studentRoll: string;
  bedId: string;
  roomId: string;
  blockName: string;
  roomNumber: string;
  bedNumber: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  requestedAt: string;
  reviewedAt?: string;
  reviewNote?: string;
}

export type MealType = 'breakfast' | 'lunch' | 'snacks' | 'dinner';

export interface CanteenSlot {
  id: string;
  mealType: MealType;
  title: string;
  startTime: string;
  endTime: string;
  capacity: number;
  bookedCount: number;
  date: string; // YYYY-MM-DD
  menuDescription: string;
  priceEstimate?: string;
}

export interface CanteenBooking {
  id: string;
  studentId: string;
  studentName: string;
  studentRoll: string;
  slotId: string;
  date: string;
  mealType: MealType;
  timeWindow: string;
  tokenNumber: string;
  status: 'confirmed' | 'redeemed' | 'cancelled';
  bookedAt: string;
}

export type ComplaintCategory =
  | 'plumbing'
  | 'electrical'
  | 'cleaning'
  | 'wifi'
  | 'furniture'
  | 'appliance'
  | 'other';

export type ComplaintPriority = 'low' | 'medium' | 'high' | 'emergency';

export type ComplaintStatus = 'submitted' | 'assigned' | 'in_progress' | 'resolved';

export interface ComplaintTimelineStep {
  step: ComplaintStatus;
  timestamp: string;
  actor: string;
  note?: string;
}

export interface Complaint {
  id: string;
  complaintNumber: string; // e.g. CMP-2026-104
  studentId: string;
  studentName: string;
  studentRoll: string;
  blockName: string;
  roomNumber: string;
  category: ComplaintCategory;
  priority: ComplaintPriority;
  title: string;
  description: string;
  photoUrl?: string;
  status: ComplaintStatus;
  assignedTechnicianId?: string;
  assignedTechnicianName?: string;
  technicianPhone?: string;
  technicianNotes?: string;
  resolutionDetails?: string;
  submittedAt: string;
  resolvedAt?: string;
  rating?: number;
  timeline: ComplaintTimelineStep[];
}

export interface GymSession {
  id: string;
  slotTime: string;
  trainerName: string;
  capacity: number;
  bookedCount: number;
  focusArea: string;
}

export interface GymBooking {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  slotTime: string;
  status: 'confirmed' | 'cancelled';
  bookedAt: string;
}

export interface FeeReceipt {
  id: string;
  studentId: string;
  studentRoll: string;
  transactionRef: string;
  paymentMode: 'upi' | 'neft' | 'netbanking' | 'card' | 'challan';
  amountPaid: number;
  receiptFileUrl: string;
  uploadedAt: string;
  status: 'pending' | 'verified' | 'rejected';
  verifiedBy?: string;
  verifiedAt?: string;
  adminRemarks?: string;
}

export interface FeeRecord {
  id: string;
  studentId: string;
  studentName: string;
  studentRoll: string;
  academicTerm: string;
  totalAmount: number;
  paidAmount: number;
  dueDate: string;
  status: 'paid' | 'pending_verification' | 'unpaid' | 'overdue' | 'partial';
  breakdown: {
    roomRent: number;
    messAdvance: number;
    cautionDeposit: number;
    maintenance: number;
  };
  receipts: FeeReceipt[];
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: 'urgent' | 'important' | 'general';
  category: 'hostel' | 'mess' | 'maintenance' | 'sports';
  createdAt: string;
  authorName: string;
  authorRole: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  read: boolean;
  createdAt: string;
  linkModule?: string;
}

export interface TechnicianProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  trade: ComplaintCategory;
  activeComplaintsCount: number;
  resolvedComplaintsCount: number;
  status: 'available' | 'busy' | 'off_duty';
}

export interface ActivityLog {
  id: string;
  actorName: string;
  actorRole: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface HealthAdviceResponse {
  summary: string;
  possibleCauses: string[];
  selfCareSteps: string[];
  redFlagWarning: string[];
  urgencyLevel: 'low' | 'moderate' | 'high' | 'emergency';
  dispensaryRecommendation: string;
  emergencyContacts: {
    name: string;
    phone: string;
    location: string;
  }[];
}
