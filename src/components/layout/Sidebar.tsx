import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useHostel } from '../../context/HostelContext';
import {
  LayoutDashboard,
  Bed,
  UtensilsCrossed,
  Wrench,
  Dumbbell,
  HeartPulse,
  Receipt,
  Megaphone,
  Users,
  ClipboardList,
  CheckCircle2,
  FileText,
  Activity,
  Layers,
  ShieldCheck,
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
}) => {
  const { role, currentUser } = useAuth();
  const { bedRequests, complaints, feeRecords } = useHostel();

  // Compute pending badges
  const pendingBedRequests = bedRequests.filter((r) => r.status === 'pending').length;
  const pendingComplaints = complaints.filter((c) => c.status === 'submitted').length;
  const pendingReceipts = feeRecords.flatMap((r) => r.receipts).filter((rc) => rc.status === 'pending').length;

  const techAssigned = complaints.filter(
    (c) =>
      c.assignedTechnicianId === currentUser?.id &&
      (c.status === 'assigned' || c.status === 'in_progress')
  ).length;

  interface NavItem {
    id: string;
    label: string;
    icon: React.ElementType;
    badge?: number;
    badgeColor?: string;
  }

  let navItems: NavItem[] = [];

  if (role === 'student') {
    navItems = [
      { id: 'overview', label: 'Student Home', icon: LayoutDashboard },
      { id: 'bed_booking', label: 'Bed Booking', icon: Bed },
      { id: 'canteen', label: 'Canteen Slots', icon: UtensilsCrossed },
      { id: 'complaints', label: 'Complaints Tracker', icon: Wrench },
      { id: 'gym', label: 'Gym Sessions', icon: Dumbbell },
      { id: 'health', label: 'AI Health Assist', icon: HeartPulse },
      { id: 'fees', label: 'Fee Management', icon: Receipt },
      { id: 'announcements', label: 'Announcements', icon: Megaphone },
    ];
  } else if (role === 'admin') {
    navItems = [
      { id: 'admin_overview', label: 'Hostel Analytics', icon: LayoutDashboard },
      { id: 'students', label: 'Student Directory', icon: Users },
      {
        id: 'beds',
        label: 'Bed Allocations',
        icon: Bed,
        badge: pendingBedRequests,
        badgeColor: 'bg-indigo-500 text-white',
      },
      {
        id: 'complaints',
        label: 'Complaint Dispatcher',
        icon: Wrench,
        badge: pendingComplaints,
        badgeColor: 'bg-rose-500 text-white',
      },
      { id: 'canteen_gym', label: 'Canteen & Gym', icon: UtensilsCrossed },
      {
        id: 'fees',
        label: 'Fee Verification',
        icon: Receipt,
        badge: pendingReceipts,
        badgeColor: 'bg-amber-500 text-white',
      },
      { id: 'announcements', label: 'Broadcast Notices', icon: Megaphone },
      { id: 'logs', label: 'Activity Logs', icon: Activity },
    ];
  } else if (role === 'technician') {
    navItems = [
      {
        id: 'tech_assigned',
        label: 'My Work Orders',
        icon: Wrench,
        badge: techAssigned,
        badgeColor: 'bg-amber-500 text-slate-950 font-bold',
      },
      { id: 'tech_history', label: 'Resolution History', icon: CheckCircle2 },
      { id: 'announcements', label: 'Hostel Notices', icon: Megaphone },
    ];
  }

  const handleSelect = (id: string) => {
    onSelectTab(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-0 -translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Header inside sidebar */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-sm tracking-wide text-white">
                Hostel<span className="text-blue-400">Sync</span>
              </span>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                {role} portal
              </p>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-semibold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`px-1.5 py-0.5 text-[10px] rounded-full font-bold ${
                      item.badgeColor || 'bg-slate-700 text-slate-200'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer info card */}
        <div className="p-4 border-t border-slate-800/80">
          <div className="rounded-xl bg-slate-800/50 p-3 border border-slate-800 text-slate-400 text-[11px]">
            <div className="flex items-center gap-2 text-slate-200 font-medium mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Campus Security & SOS</span>
            </div>
            <p className="text-[10px] text-slate-400">
              Hostel Control Desk: <span className="text-slate-300 font-mono">+91 98765-43210</span>
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
