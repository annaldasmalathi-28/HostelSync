import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { HostelProvider } from './context/HostelContext';
import { DemoRoleBar } from './components/common/DemoRoleBar';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { LandingPage } from './components/landing/LandingPage';
import { AuthModal } from './components/auth/AuthModal';

// Student modules
import { StudentOverview } from './components/student/StudentOverview';
import { BedBookingModule } from './components/student/BedBookingModule';
import { CanteenBookingModule } from './components/student/CanteenBookingModule';
import { ComplaintModule } from './components/student/ComplaintModule';
import { GymBookingModule } from './components/student/GymBookingModule';
import { HealthAssistModule } from './components/student/HealthAssistModule';
import { FeeManagementModule } from './components/student/FeeManagementModule';

// Admin modules
import { AdminOverview } from './components/admin/AdminOverview';
import { BedManagement } from './components/admin/BedManagement';
import { ComplaintDispatcher } from './components/admin/ComplaintDispatcher';
import { FeeVerificationDesk } from './components/admin/FeeVerificationDesk';
import { StudentManagement } from './components/admin/StudentManagement';
import { CanteenGymManager } from './components/admin/CanteenGymManager';
import { AnnouncementsDesk } from './components/admin/AnnouncementsDesk';
import { ActivityLogsView } from './components/admin/ActivityLogsView';

// Technician module
import { TechnicianDashboard } from './components/technician/TechnicianDashboard';

const MainApp: React.FC = () => {
  const { currentUser, role, isAuthenticated } = useAuth();

  // Landing page toggle state
  const [showLanding, setShowLanding] = useState(false);

  // Auth modal state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authDefaultTab, setAuthDefaultTab] = useState<'login' | 'register'>('login');

  // Active tab state
  const [currentTab, setCurrentTab] = useState<string>(() => {
    if (role === 'admin') return 'admin_overview';
    if (role === 'technician') return 'tech_assigned';
    return 'overview';
  });

  // Mobile drawer state
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState(false);

  // Sync tab if role switches
  React.useEffect(() => {
    if (role === 'admin') {
      setCurrentTab((prev) => (prev.startsWith('admin_') || prev === 'beds' || prev === 'students' || prev === 'complaints' || prev === 'fees' || prev === 'canteen_gym' || prev === 'announcements' || prev === 'logs' ? prev : 'admin_overview'));
    } else if (role === 'technician') {
      setCurrentTab('tech_assigned');
    } else {
      setCurrentTab((prev) => (prev === 'overview' || prev === 'bed_booking' || prev === 'canteen' || prev === 'complaints' || prev === 'gym' || prev === 'health' || prev === 'fees' || prev === 'announcements' ? prev : 'overview'));
    }
  }, [role]);

  // If user opened landing page view
  if (showLanding || !isAuthenticated) {
    return (
      <>
        <DemoRoleBar />
        <LandingPage
          onEnterApp={() => setShowLanding(false)}
          onOpenAuth={(tab) => {
            setAuthDefaultTab(tab);
            setAuthModalOpen(true);
          }}
        />
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => {
            setAuthModalOpen(false);
            setShowLanding(false);
          }}
          defaultTab={authDefaultTab}
        />
      </>
    );
  }

  // Render role-specific view content
  const renderContent = () => {
    if (role === 'student') {
      switch (currentTab) {
        case 'overview':
          return <StudentOverview onNavigateTab={setCurrentTab} />;
        case 'bed_booking':
          return <BedBookingModule />;
        case 'canteen':
          return <CanteenBookingModule />;
        case 'complaints':
          return <ComplaintModule />;
        case 'gym':
          return <GymBookingModule />;
        case 'health':
          return <HealthAssistModule />;
        case 'fees':
          return <FeeManagementModule />;
        case 'announcements':
          return <AnnouncementsDesk />;
        default:
          return <StudentOverview onNavigateTab={setCurrentTab} />;
      }
    }

    if (role === 'admin') {
      switch (currentTab) {
        case 'admin_overview':
          return <AdminOverview onNavigateTab={setCurrentTab} />;
        case 'beds':
          return <BedManagement />;
        case 'complaints':
          return <ComplaintDispatcher />;
        case 'fees':
          return <FeeVerificationDesk />;
        case 'students':
          return <StudentManagement />;
        case 'canteen_gym':
          return <CanteenGymManager />;
        case 'announcements':
          return <AnnouncementsDesk />;
        case 'logs':
          return <ActivityLogsView />;
        default:
          return <AdminOverview onNavigateTab={setCurrentTab} />;
      }
    }

    if (role === 'technician') {
      switch (currentTab) {
        case 'tech_assigned':
        case 'tech_history':
        case 'tech_schedule':
          return <TechnicianDashboard />;
        case 'announcements':
          return <AnnouncementsDesk />;
        default:
          return <TechnicianDashboard />;
      }
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* 1-Click Role Switcher Bar for College Demonstration */}
      <DemoRoleBar />

      {/* Top Navbar */}
      <Navbar
        onToggleSidebar={() => setIsSidebarOpenMobile(!isSidebarOpenMobile)}
        onNavigateLanding={() => setShowLanding(true)}
      />

      {/* Main Workspace with Sidebar & Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Dark Navy Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          isOpenMobile={isSidebarOpenMobile}
          onCloseMobile={() => setIsSidebarOpenMobile(false)}
        />

        {/* Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">{renderContent()}</div>
        </main>
      </div>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultTab={authDefaultTab}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <HostelProvider>
        <MainApp />
      </HostelProvider>
    </AuthProvider>
  );
}
