import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useHostel } from '../../context/HostelContext';
import {
  Building2,
  Bell,
  LogOut,
  User as UserIcon,
  CheckCircle2,
  Sparkles,
  Home,
  Menu,
} from 'lucide-react';

interface NavbarProps {
  onToggleSidebar?: () => void;
  onNavigateLanding?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, onNavigateLanding }) => {
  const { currentUser, role, logout } = useAuth();
  const { notifications, markNotificationRead, markAllNotificationsRead } = useHostel();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Filter notifications relevant to current user or broadcast
  const userNotifications = notifications.filter(
    (n) => n.userId === currentUser?.id || n.userId === 'all' || (role === 'admin' && n.userId === 'usr-admin-1')
  );
  const unreadCount = userNotifications.filter((n) => !n.read).length;

  const roleBadgeColor =
    role === 'admin'
      ? 'bg-violet-100 text-violet-800 border-violet-200'
      : role === 'technician'
      ? 'bg-amber-100 text-amber-800 border-amber-200'
      : 'bg-blue-100 text-blue-800 border-blue-200';

  const roleTitle =
    role === 'admin'
      ? 'Hostel Administrator'
      : role === 'technician'
      ? 'Maintenance Technician'
      : 'Resident Student';

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      <div className="px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Left: Mobile sidebar toggle + Logo */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Toggle navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div
            onClick={onNavigateLanding}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight text-slate-900">
                  Hostel<span className="text-blue-600">Sync</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/60">
                  CAMPUS OS
                </span>
              </div>
              <p className="text-[11px] text-slate-600 hidden md:block">
                One Hostel. One Connected Platform.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Actions, Notifications & Profile */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Quick link to Landing Page */}
          {onNavigateLanding && (
            <button
              onClick={onNavigateLanding}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              title="Return to Presentation Landing Page"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Landing Page</span>
            </button>
          )}

          {/* Role badge */}
          {role && (
            <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${roleBadgeColor}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              <span>{roleTitle}</span>
            </div>
          )}

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserMenu(false);
              }}
              className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="View notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white shadow-xs">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-white shadow-xl ring-1 ring-black/5 border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-xs text-slate-800">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-medium">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={() => currentUser && markAllNotificationsRead(currentUser.id)}
                      className="text-[11px] text-blue-600 hover:text-blue-700 font-medium hover:underline"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {userNotifications.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-600">
                      No notifications yet
                    </div>
                  ) : (
                    userNotifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`p-3 text-xs transition-colors cursor-pointer ${
                          n.read ? 'bg-white hover:bg-slate-50' : 'bg-blue-50/50 hover:bg-blue-50/80'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className={`font-semibold ${n.read ? 'text-slate-800' : 'text-blue-950'}`}>
                            {n.title}
                          </p>
                          <span className="text-[10px] text-slate-600 shrink-0">
                            {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-slate-600 mt-1 text-[11px] leading-relaxed">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile dropdown */}
          {currentUser && (
            <div className="relative">
              <button
                onClick={() => {
                  setShowUserMenu(!showUserMenu);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-2 p-1 pl-1.5 rounded-full hover:bg-slate-100 transition-colors text-left"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 ring-2 ring-blue-500/20 shrink-0">
                  {currentUser.avatarUrl ? (
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-600 text-white font-bold text-xs">
                      {currentUser.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="hidden lg:block">
                  <div className="text-xs font-semibold text-slate-800 leading-tight">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-slate-600">
                    {currentUser.studentId || currentUser.roomNumber || role}
                  </div>
                </div>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-xl ring-1 ring-black/5 border border-slate-200 z-50 overflow-hidden py-1">
                  <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50">
                    <p className="text-xs font-semibold text-slate-900">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-600 truncate">{currentUser.email}</p>
                    {currentUser.studentId && (
                      <p className="text-[10px] font-mono text-blue-600 mt-0.5">
                        Roll: {currentUser.studentId}
                      </p>
                    )}
                    {currentUser.roomNumber && (
                      <p className="text-[10px] text-slate-600">
                        Room: {currentUser.roomNumber} ({currentUser.blockName})
                      </p>
                    )}
                  </div>

                  <div className="p-1">
                    <button
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
