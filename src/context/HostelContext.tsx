import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  HostelBlock,
  Room,
  Bed,
  BedBookingRequest,
  CanteenSlot,
  CanteenBooking,
  Complaint,
  ComplaintCategory,
  ComplaintPriority,
  GymSession,
  GymBooking,
  FeeRecord,
  FeeReceipt,
  Announcement,
  NotificationItem,
  TechnicianProfile,
  ActivityLog,
} from '../types';
import {
  INITIAL_BLOCKS,
  INITIAL_ROOMS,
  INITIAL_BEDS,
  INITIAL_CANTEEN_SLOTS,
  INITIAL_COMPLAINTS,
  INITIAL_GYM_SESSIONS,
  INITIAL_FEE_RECORDS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_ACTIVITY_LOGS,
  INITIAL_NOTIFICATIONS,
  INITIAL_TECHNICIANS,
} from '../data/mockInitialData';

interface HostelContextType {
  blocks: HostelBlock[];
  rooms: Room[];
  beds: Bed[];
  bedRequests: BedBookingRequest[];
  canteenSlots: CanteenSlot[];
  canteenBookings: CanteenBooking[];
  complaints: Complaint[];
  gymSessions: GymSession[];
  gymBookings: GymBooking[];
  feeRecords: FeeRecord[];
  announcements: Announcement[];
  notifications: NotificationItem[];
  technicians: TechnicianProfile[];
  activityLogs: ActivityLog[];
  // Actions
  requestBedBooking: (studentId: string, studentName: string, studentRoll: string, bedId: string) => Promise<void>;
  approveBedRequest: (requestId: string, reviewNote?: string) => Promise<void>;
  rejectBedRequest: (requestId: string, reviewNote?: string) => Promise<void>;
  bookCanteenSlot: (studentId: string, studentName: string, studentRoll: string, slotId: string, date: string) => Promise<CanteenBooking>;
  cancelCanteenBooking: (bookingId: string) => Promise<void>;
  updateCanteenMenu: (slotId: string, newMenu: string, newCapacity: number) => void;
  submitComplaint: (data: {
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
  }) => Promise<Complaint>;
  assignComplaint: (complaintId: string, technicianId: string) => Promise<void>;
  updateComplaintProgress: (complaintId: string, progressNote: string) => Promise<void>;
  resolveComplaint: (complaintId: string, resolutionDetails: string) => Promise<void>;
  rateComplaint: (complaintId: string, rating: number) => void;
  bookGymSession: (studentId: string, studentName: string, slotTime: string, date: string) => Promise<GymBooking>;
  cancelGymBooking: (bookingId: string) => Promise<void>;
  uploadFeeReceipt: (studentId: string, studentRoll: string, data: Omit<FeeReceipt, 'id' | 'uploadedAt' | 'status'>) => Promise<void>;
  verifyFeeReceipt: (recordId: string, receiptId: string, approved: boolean, remarks: string, verifiedBy: string) => Promise<void>;
  createAnnouncement: (data: Omit<Announcement, 'id' | 'createdAt'>) => void;
  markNotificationRead: (notifId: string) => void;
  markAllNotificationsRead: (userId: string) => void;
  resetAllData: () => void;
}

const HostelContext = createContext<HostelContextType | undefined>(undefined);

const STORAGE_PREFIX = 'hostelsync_data_v2_';

function loadOrInit<T>(key: string, initial: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn(`Error loading key ${key}:`, e);
  }
  return initial;
}

export const HostelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [blocks] = useState<HostelBlock[]>(() => loadOrInit('blocks', INITIAL_BLOCKS));
  const [rooms, setRooms] = useState<Room[]>(() => loadOrInit('rooms', INITIAL_ROOMS));
  const [beds, setBeds] = useState<Bed[]>(() => loadOrInit('beds', INITIAL_BEDS));
  const [bedRequests, setBedRequests] = useState<BedBookingRequest[]>(() =>
    loadOrInit('bed_requests', [
      {
        id: 'req-init-1',
        studentId: 'usr-student-3',
        studentName: 'Vikram Singh',
        studentRoll: 'ME2025-009',
        bedId: 'bed-a-205-1',
        roomId: 'rm-a-205',
        blockName: 'Block A (Einstein Boys)',
        roomNumber: 'A-205',
        bedNumber: 'A-205-1',
        status: 'pending',
        requestedAt: '2026-10-13T08:10:00Z',
      },
    ])
  );
  const [canteenSlots, setCanteenSlots] = useState<CanteenSlot[]>(() => loadOrInit('canteen_slots', INITIAL_CANTEEN_SLOTS));
  const [canteenBookings, setCanteenBookings] = useState<CanteenBooking[]>(() =>
    loadOrInit('canteen_bookings', [
      {
        id: 'c-bk-1',
        studentId: 'usr-student-1',
        studentName: 'Rahul Sharma',
        studentRoll: 'CS2024-042',
        slotId: 'cnt-brk-1',
        date: new Date().toISOString().split('T')[0],
        mealType: 'breakfast',
        timeWindow: '07:30 AM - 08:30 AM',
        tokenNumber: 'HSTL-3904',
        status: 'confirmed',
        bookedAt: '2026-10-12T20:00:00Z',
      },
    ])
  );
  const [complaints, setComplaints] = useState<Complaint[]>(() => loadOrInit('complaints', INITIAL_COMPLAINTS));
  const [gymSessions, setGymSessions] = useState<GymSession[]>(() => loadOrInit('gym_sessions', INITIAL_GYM_SESSIONS));
  const [gymBookings, setGymBookings] = useState<GymBooking[]>(() =>
    loadOrInit('gym_bookings', [
      {
        id: 'g-bk-1',
        studentId: 'usr-student-1',
        studentName: 'Rahul Sharma',
        date: new Date().toISOString().split('T')[0],
        slotTime: '06:00 AM - 07:00 AM',
        status: 'confirmed',
        bookedAt: '2026-10-12T19:40:00Z',
      },
    ])
  );
  const [feeRecords, setFeeRecords] = useState<FeeRecord[]>(() => loadOrInit('fee_records', INITIAL_FEE_RECORDS));
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => loadOrInit('announcements', INITIAL_ANNOUNCEMENTS));
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => loadOrInit('notifications', INITIAL_NOTIFICATIONS));
  const [technicians, setTechnicians] = useState<TechnicianProfile[]>(() => loadOrInit('technicians', INITIAL_TECHNICIANS));
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => loadOrInit('activity_logs', INITIAL_ACTIVITY_LOGS));

  // Sync state to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PREFIX + 'rooms', JSON.stringify(rooms));
      localStorage.setItem(STORAGE_PREFIX + 'beds', JSON.stringify(beds));
      localStorage.setItem(STORAGE_PREFIX + 'bed_requests', JSON.stringify(bedRequests));
      localStorage.setItem(STORAGE_PREFIX + 'canteen_slots', JSON.stringify(canteenSlots));
      localStorage.setItem(STORAGE_PREFIX + 'canteen_bookings', JSON.stringify(canteenBookings));
      localStorage.setItem(STORAGE_PREFIX + 'complaints', JSON.stringify(complaints));
      localStorage.setItem(STORAGE_PREFIX + 'gym_sessions', JSON.stringify(gymSessions));
      localStorage.setItem(STORAGE_PREFIX + 'gym_bookings', JSON.stringify(gymBookings));
      localStorage.setItem(STORAGE_PREFIX + 'fee_records', JSON.stringify(feeRecords));
      localStorage.setItem(STORAGE_PREFIX + 'announcements', JSON.stringify(announcements));
      localStorage.setItem(STORAGE_PREFIX + 'notifications', JSON.stringify(notifications));
      localStorage.setItem(STORAGE_PREFIX + 'technicians', JSON.stringify(technicians));
      localStorage.setItem(STORAGE_PREFIX + 'activity_logs', JSON.stringify(activityLogs));
    } catch (e) {
      console.error('Failed to sync to storage:', e);
    }
  }, [
    rooms,
    beds,
    bedRequests,
    canteenSlots,
    canteenBookings,
    complaints,
    gymSessions,
    gymBookings,
    feeRecords,
    announcements,
    notifications,
    technicians,
    activityLogs,
  ]);

  // Helper to add activity log
  const logActivity = (actorName: string, actorRole: string, action: string, details: string) => {
    const newLog: ActivityLog = {
      id: `act-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      actorName,
      actorRole,
      action,
      details,
      timestamp: new Date().toISOString(),
    };
    setActivityLogs((prev) => [newLog, ...prev]);
  };

  // Helper to send notification
  const sendNotification = (userId: string, title: string, message: string, type: NotificationItem['type'], linkModule?: string) => {
    const item: NotificationItem = {
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId,
      title,
      message,
      type,
      read: false,
      createdAt: new Date().toISOString(),
      linkModule,
    };
    setNotifications((prev) => [item, ...prev]);
  };

  // Bed booking request
  const requestBedBooking = async (
    studentId: string,
    studentName: string,
    studentRoll: string,
    bedId: string
  ): Promise<void> => {
    const targetBed = beds.find((b) => b.id === bedId);
    if (!targetBed) {
      throw new Error('Target bed not found in hostel inventory.');
    }

    if (targetBed.status === 'occupied') {
      throw new Error('This bed is already occupied by another student.');
    }

    if (targetBed.status === 'reserved' || targetBed.requestedStudentId) {
      throw new Error('This bed has already been requested by another student and is awaiting approval.');
    }

    // Check if student already has a pending request
    const existingReq = bedRequests.find(
      (r) => r.studentId === studentId && r.status === 'pending'
    );
    if (existingReq) {
      throw new Error(`You already have a pending bed request for Bed ${existingReq.bedNumber}. Please wait for warden approval.`);
    }

    const room = rooms.find((r) => r.id === targetBed.roomId);

    const newRequest: BedBookingRequest = {
      id: `req-${Date.now()}`,
      studentId,
      studentName,
      studentRoll,
      bedId,
      roomId: targetBed.roomId,
      blockName: targetBed.blockName,
      roomNumber: targetBed.roomNumber,
      bedNumber: targetBed.bedNumber,
      status: 'pending',
      requestedAt: new Date().toISOString(),
    };

    setBeds((prev) =>
      prev.map((b) =>
        b.id === bedId
          ? {
              ...b,
              status: 'reserved',
              requestedStudentId: studentId,
              requestedStudentName: studentName,
              requestedStudentRoll: studentRoll,
              requestedAt: new Date().toISOString(),
            }
          : b
      )
    );

    setBedRequests((prev) => [newRequest, ...prev]);

    logActivity(
      studentName,
      'Student',
      'Requested Bed Allocation',
      `Requested Bed ${targetBed.bedNumber} in ${room?.blockName || targetBed.blockName}`
    );

    sendNotification(
      'usr-admin-1',
      'New Bed Allocation Request',
      `${studentName} (${studentRoll}) requested Bed ${targetBed.bedNumber}.`,
      'info',
      'beds'
    );
  };

  // Approve bed request
  const approveBedRequest = async (requestId: string, reviewNote?: string): Promise<void> => {
    const req = bedRequests.find((r) => r.id === requestId);
    if (!req) throw new Error('Request not found');

    setBedRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? { ...r, status: 'approved', reviewedAt: new Date().toISOString(), reviewNote }
          : r
      )
    );

    setBeds((prev) =>
      prev.map((b) =>
        b.id === req.bedId
          ? {
              ...b,
              status: 'occupied',
              currentStudentId: req.studentId,
              currentStudentName: req.studentName,
              currentStudentRoll: req.studentRoll,
              requestedStudentId: undefined,
              requestedStudentName: undefined,
              requestedStudentRoll: undefined,
            }
          : b
      )
    );

    setRooms((prev) =>
      prev.map((r) =>
        r.id === req.roomId
          ? { ...r, availableBeds: Math.max(0, r.availableBeds - 1) }
          : r
      )
    );

    logActivity(
      'Chief Warden Office',
      'Admin',
      'Approved Bed Allocation',
      `Approved Bed ${req.bedNumber} for ${req.studentName} (${req.studentRoll})`
    );

    sendNotification(
      req.studentId,
      'Bed Allocation Approved! 🎉',
      `Congratulations! Your bed allocation for ${req.bedNumber} (${req.blockName}) has been approved by the Warden.`,
      'success',
      'beds'
    );
  };

  // Reject bed request
  const rejectBedRequest = async (requestId: string, reviewNote?: string): Promise<void> => {
    const req = bedRequests.find((r) => r.id === requestId);
    if (!req) throw new Error('Request not found');

    setBedRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? { ...r, status: 'rejected', reviewedAt: new Date().toISOString(), reviewNote }
          : r
      )
    );

    setBeds((prev) =>
      prev.map((b) =>
        b.id === req.bedId
          ? {
              ...b,
              status: 'available',
              requestedStudentId: undefined,
              requestedStudentName: undefined,
              requestedStudentRoll: undefined,
            }
          : b
      )
    );

    logActivity(
      'Chief Warden Office',
      'Admin',
      'Rejected Bed Request',
      `Rejected request for Bed ${req.bedNumber}. Reason: ${reviewNote || 'Capacity limit'}`
    );

    sendNotification(
      req.studentId,
      'Bed Request Declined',
      `Your request for Bed ${req.bedNumber} was not approved. ${reviewNote ? `Note: ${reviewNote}` : 'Please browse other available beds.'}`,
      'warning',
      'beds'
    );
  };

  // Book canteen meal slot
  const bookCanteenSlot = async (
    studentId: string,
    studentName: string,
    studentRoll: string,
    slotId: string,
    date: string
  ): Promise<CanteenBooking> => {
    const slot = canteenSlots.find((s) => s.id === slotId);
    if (!slot) throw new Error('Meal slot not found');

    // Concurrency / Capacity validation
    if (slot.bookedCount >= slot.capacity) {
      throw new Error(`This dining slot (${slot.startTime} - ${slot.endTime}) has reached maximum hall capacity (${slot.capacity}/${slot.capacity}). Please select another meal window.`);
    }

    // Duplicate booking check for same mealType and date
    const duplicate = canteenBookings.find(
      (b) =>
        b.studentId === studentId &&
        b.date === date &&
        b.mealType === slot.mealType &&
        b.status === 'confirmed'
    );
    if (duplicate) {
      throw new Error(`Duplicate Reservation Error: You already hold confirmed token ${duplicate.tokenNumber} for ${slot.mealType.toUpperCase()} on ${date}.`);
    }

    const tokenNumber = `HSTL-${Math.floor(1000 + Math.random() * 9000)}`;

    const newBooking: CanteenBooking = {
      id: `cnt-bk-${Date.now()}`,
      studentId,
      studentName,
      studentRoll,
      slotId,
      date,
      mealType: slot.mealType,
      timeWindow: `${slot.startTime} - ${slot.endTime}`,
      tokenNumber,
      status: 'confirmed',
      bookedAt: new Date().toISOString(),
    };

    setCanteenSlots((prev) =>
      prev.map((s) => (s.id === slotId ? { ...s, bookedCount: s.bookedCount + 1 } : s))
    );

    setCanteenBookings((prev) => [newBooking, ...prev]);

    logActivity(
      studentName,
      'Student',
      'Booked Canteen Slot',
      `Generated Token ${tokenNumber} for ${slot.mealType.toUpperCase()} (${slot.startTime})`
    );

    sendNotification(
      studentId,
      'Meal Token Confirmed',
      `Token ${tokenNumber} issued for ${slot.mealType.toUpperCase()} on ${date} (${slot.startTime} - ${slot.endTime}).`,
      'success',
      'canteen'
    );

    return newBooking;
  };

  // Cancel canteen booking
  const cancelCanteenBooking = async (bookingId: string): Promise<void> => {
    const booking = canteenBookings.find((b) => b.id === bookingId);
    if (!booking) return;

    setCanteenBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' } : b))
    );

    setCanteenSlots((prev) =>
      prev.map((s) =>
        s.id === booking.slotId ? { ...s, bookedCount: Math.max(0, s.bookedCount - 1) } : s
      )
    );

    logActivity(
      booking.studentName,
      'Student',
      'Cancelled Canteen Token',
      `Cancelled meal token ${booking.tokenNumber}`
    );
  };

  const updateCanteenMenu = (slotId: string, newMenu: string, newCapacity: number) => {
    setCanteenSlots((prev) =>
      prev.map((s) =>
        s.id === slotId ? { ...s, menuDescription: newMenu, capacity: newCapacity } : s
      )
    );
  };

  // Submit Complaint
  const submitComplaint = async (data: {
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
  }): Promise<Complaint> => {
    const count = complaints.length + 105;
    const complaintNumber = `CMP-2026-${count}`;

    const newComplaint: Complaint = {
      id: `cmp-${Date.now()}`,
      complaintNumber,
      studentId: data.studentId,
      studentName: data.studentName,
      studentRoll: data.studentRoll,
      blockName: data.blockName,
      roomNumber: data.roomNumber,
      category: data.category,
      priority: data.priority,
      title: data.title,
      description: data.description,
      photoUrl: data.photoUrl,
      status: 'submitted',
      submittedAt: new Date().toISOString(),
      timeline: [
        {
          step: 'submitted',
          timestamp: new Date().toISOString(),
          actor: `${data.studentName} (Student)`,
          note: 'Maintenance ticket registered with room details',
        },
      ],
    };

    setComplaints((prev) => [newComplaint, ...prev]);

    logActivity(
      data.studentName,
      'Student',
      'Registered Complaint',
      `${complaintNumber}: ${data.title} (${data.category.toUpperCase()})`
    );

    sendNotification(
      'usr-admin-1',
      'New Maintenance Complaint',
      `Ticket ${complaintNumber} reported in Room ${data.roomNumber}: ${data.title}`,
      'alert',
      'complaints'
    );

    return newComplaint;
  };

  // Assign complaint to technician
  const assignComplaint = async (complaintId: string, technicianId: string): Promise<void> => {
    const tech = technicians.find((t) => t.id === technicianId);
    if (!tech) throw new Error('Technician not found');

    const complaint = complaints.find((c) => c.id === complaintId);
    if (!complaint) throw new Error('Complaint not found');

    const now = new Date().toISOString();

    setComplaints((prev) =>
      prev.map((c) =>
        c.id === complaintId
          ? {
              ...c,
              status: 'assigned',
              assignedTechnicianId: tech.id,
              assignedTechnicianName: tech.name,
              technicianPhone: tech.phone,
              technicianNotes: `Assigned to ${tech.name} (${tech.trade}). Work order dispatched.`,
              timeline: [
                ...c.timeline,
                {
                  step: 'assigned',
                  timestamp: now,
                  actor: 'Hostel Maintenance Desk (Admin)',
                  note: `Assigned to technician ${tech.name} (${tech.phone})`,
                },
              ],
            }
          : c
      )
    );

    setTechnicians((prev) =>
      prev.map((t) =>
        t.id === technicianId
          ? { ...t, activeComplaintsCount: t.activeComplaintsCount + 1, status: 'busy' }
          : t
      )
    );

    logActivity(
      'Admin Dispatcher',
      'Admin',
      'Dispatched Work Order',
      `Assigned ${complaint.complaintNumber} to ${tech.name}`
    );

    sendNotification(
      complaint.studentId,
      'Complaint Assigned to Technician',
      `Your ticket ${complaint.complaintNumber} has been assigned to ${tech.name} (${tech.phone}).`,
      'info',
      'complaints'
    );

    sendNotification(
      tech.id,
      'New Work Order Assigned',
      `Ticket ${complaint.complaintNumber} assigned to you in Room ${complaint.roomNumber} (${complaint.blockName}).`,
      'alert',
      'technician'
    );
  };

  // Update complaint progress (Technician accepted / inspected)
  const updateComplaintProgress = async (complaintId: string, progressNote: string): Promise<void> => {
    const complaint = complaints.find((c) => c.id === complaintId);
    if (!complaint) return;

    const now = new Date().toISOString();

    setComplaints((prev) =>
      prev.map((c) =>
        c.id === complaintId
          ? {
              ...c,
              status: 'in_progress',
              technicianNotes: progressNote,
              timeline: [
                ...c.timeline,
                {
                  step: 'in_progress',
                  timestamp: now,
                  actor: `${c.assignedTechnicianName || 'Technician'}`,
                  note: progressNote,
                },
              ],
            }
          : c
      )
    );

    logActivity(
      complaint.assignedTechnicianName || 'Technician',
      'Technician',
      'Updated Work In Progress',
      `${complaint.complaintNumber}: ${progressNote}`
    );

    sendNotification(
      complaint.studentId,
      'Work In Progress',
      `Technician ${complaint.assignedTechnicianName} has started work on ${complaint.complaintNumber}: "${progressNote}"`,
      'info',
      'complaints'
    );
  };

  // Mark complaint resolved
  const resolveComplaint = async (complaintId: string, resolutionDetails: string): Promise<void> => {
    const complaint = complaints.find((c) => c.id === complaintId);
    if (!complaint) return;

    const now = new Date().toISOString();

    setComplaints((prev) =>
      prev.map((c) =>
        c.id === complaintId
          ? {
              ...c,
              status: 'resolved',
              resolvedAt: now,
              resolutionDetails,
              timeline: [
                ...c.timeline,
                {
                  step: 'resolved',
                  timestamp: now,
                  actor: `${c.assignedTechnicianName || 'Technician'}`,
                  note: resolutionDetails,
                },
              ],
            }
          : c
      )
    );

    if (complaint.assignedTechnicianId) {
      setTechnicians((prev) =>
        prev.map((t) =>
          t.id === complaint.assignedTechnicianId
            ? {
                ...t,
                activeComplaintsCount: Math.max(0, t.activeComplaintsCount - 1),
                resolvedComplaintsCount: t.resolvedComplaintsCount + 1,
                status: 'available',
              }
            : t
        )
      );
    }

    logActivity(
      complaint.assignedTechnicianName || 'Technician',
      'Technician',
      'Resolved Complaint',
      `${complaint.complaintNumber} marked resolved. Details: ${resolutionDetails}`
    );

    sendNotification(
      complaint.studentId,
      'Complaint Resolved! ✅',
      `Great news! Ticket ${complaint.complaintNumber} in Room ${complaint.roomNumber} has been resolved by ${complaint.assignedTechnicianName}.`,
      'success',
      'complaints'
    );
  };

  const rateComplaint = (complaintId: string, rating: number) => {
    setComplaints((prev) =>
      prev.map((c) => (c.id === complaintId ? { ...c, rating } : c))
    );
  };

  // Gym booking
  const bookGymSession = async (
    studentId: string,
    studentName: string,
    slotTime: string,
    date: string
  ): Promise<GymBooking> => {
    const session = gymSessions.find((s) => s.slotTime === slotTime);
    if (session && session.bookedCount >= session.capacity) {
      throw new Error('This gym batch has reached maximum capacity.');
    }

    const duplicate = gymBookings.find(
      (b) => b.studentId === studentId && b.date === date && b.slotTime === slotTime && b.status === 'confirmed'
    );
    if (duplicate) {
      throw new Error(`You already booked a slot for ${slotTime} on ${date}.`);
    }

    const newBooking: GymBooking = {
      id: `gym-bk-${Date.now()}`,
      studentId,
      studentName,
      date,
      slotTime,
      status: 'confirmed',
      bookedAt: new Date().toISOString(),
    };

    setGymSessions((prev) =>
      prev.map((s) => (s.slotTime === slotTime ? { ...s, bookedCount: s.bookedCount + 1 } : s))
    );

    setGymBookings((prev) => [newBooking, ...prev]);

    logActivity(studentName, 'Student', 'Booked Gym Session', `Slot: ${slotTime} on ${date}`);

    return newBooking;
  };

  const cancelGymBooking = async (bookingId: string): Promise<void> => {
    const booking = gymBookings.find((b) => b.id === bookingId);
    if (!booking) return;

    setGymBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' } : b))
    );

    setGymSessions((prev) =>
      prev.map((s) =>
        s.slotTime === booking.slotTime ? { ...s, bookedCount: Math.max(0, s.bookedCount - 1) } : s
      )
    );
  };

  // Fee receipt upload
  const uploadFeeReceipt = async (
    studentId: string,
    studentRoll: string,
    data: Omit<FeeReceipt, 'id' | 'uploadedAt' | 'status'>
  ): Promise<void> => {
    const newReceipt: FeeReceipt = {
      id: `rcp-${Date.now()}`,
      studentId,
      studentRoll,
      transactionRef: data.transactionRef,
      paymentMode: data.paymentMode,
      amountPaid: data.amountPaid,
      receiptFileUrl: data.receiptFileUrl,
      uploadedAt: new Date().toISOString(),
      status: 'pending',
    };

    setFeeRecords((prev) => {
      const existing = prev.find((r) => r.studentId === studentId);
      if (existing) {
        return prev.map((r) =>
          r.studentId === studentId
            ? {
                ...r,
                status: 'pending_verification',
                receipts: [newReceipt, ...r.receipts],
              }
            : r
        );
      }
      return prev;
    });

    logActivity(
      studentRoll,
      'Student',
      'Submitted Fee Payment Receipt',
      `Amount: ₹${data.amountPaid.toLocaleString()} | Ref: ${data.transactionRef}`
    );

    sendNotification(
      'usr-admin-1',
      'New Fee Payment Receipt Submitted',
      `Student ${studentRoll} submitted receipt for ₹${data.amountPaid.toLocaleString()} awaiting verification.`,
      'warning',
      'fees'
    );
  };

  // Verify fee receipt
  const verifyFeeReceipt = async (
    recordId: string,
    receiptId: string,
    approved: boolean,
    remarks: string,
    verifiedBy: string
  ): Promise<void> => {
    const record = feeRecords.find((r) => r.id === recordId);
    if (!record) return;

    const receipt = record.receipts.find((rc) => rc.id === receiptId);
    if (!receipt) return;

    const now = new Date().toISOString();

    setFeeRecords((prev) =>
      prev.map((r) => {
        if (r.id !== recordId) return r;

        const updatedReceipts = r.receipts.map((rc) =>
          rc.id === receiptId
            ? {
                ...rc,
                status: approved ? ('verified' as const) : ('rejected' as const),
                verifiedBy,
                verifiedAt: now,
                adminRemarks: remarks,
              }
            : rc
        );

        let newPaid = r.paidAmount;
        if (approved) {
          newPaid += receipt.amountPaid;
        }

        const newStatus =
          newPaid >= r.totalAmount
            ? ('paid' as const)
            : newPaid > 0
            ? ('partial' as const)
            : ('unpaid' as const);

        return {
          ...r,
          paidAmount: newPaid,
          status: newStatus,
          receipts: updatedReceipts,
        };
      })
    );

    logActivity(
      verifiedBy,
      'Admin',
      approved ? 'Verified Fee Receipt' : 'Rejected Fee Receipt',
      `Receipt ${receipt.transactionRef} for ₹${receipt.amountPaid.toLocaleString()} ${approved ? 'approved' : 'rejected'}`
    );

    sendNotification(
      record.studentId,
      approved ? 'Fee Payment Verified! 💳' : 'Fee Receipt Rejected',
      approved
        ? `Your fee payment of ₹${receipt.amountPaid.toLocaleString()} has been verified by the accounts office.`
        : `Your fee receipt (${receipt.transactionRef}) was rejected: "${remarks}". Please re-upload valid proof.`,
      approved ? 'success' : 'alert',
      'fees'
    );
  };

  // Create Announcement
  const createAnnouncement = (data: Omit<Announcement, 'id' | 'createdAt'>) => {
    const newAnn: Announcement = {
      ...data,
      id: `ann-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setAnnouncements((prev) => [newAnn, ...prev]);

    logActivity(data.authorName, data.authorRole, 'Posted Campus Announcement', data.title);
  };

  const markNotificationRead = (notifId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = (userId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.userId === userId || n.userId === 'all' ? { ...n, read: true } : n))
    );
  };

  const resetAllData = () => {
    Object.keys(localStorage).forEach((k) => {
      if (k.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(k);
      }
    });
    window.location.reload();
  };

  return (
    <HostelContext.Provider
      value={{
        blocks,
        rooms,
        beds,
        bedRequests,
        canteenSlots,
        canteenBookings,
        complaints,
        gymSessions,
        gymBookings,
        feeRecords,
        announcements,
        notifications,
        technicians,
        activityLogs,
        requestBedBooking,
        approveBedRequest,
        rejectBedRequest,
        bookCanteenSlot,
        cancelCanteenBooking,
        updateCanteenMenu,
        submitComplaint,
        assignComplaint,
        updateComplaintProgress,
        resolveComplaint,
        rateComplaint,
        bookGymSession,
        cancelGymBooking,
        uploadFeeReceipt,
        verifyFeeReceipt,
        createAnnouncement,
        markNotificationRead,
        markAllNotificationsRead,
        resetAllData,
      }}
    >
      {children}
    </HostelContext.Provider>
  );
};

export const useHostel = () => {
  const context = useContext(HostelContext);
  if (!context) {
    throw new Error('useHostel must be used within a HostelProvider');
  }
  return context;
};
