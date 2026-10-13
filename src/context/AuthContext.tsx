import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { INITIAL_USERS } from '../data/mockInitialData';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  role: UserRole | null;
  login: (email: string, password: string, role?: UserRole) => Promise<{ success: boolean; message?: string }>;
  register: (data: Partial<User> & { password: string }) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  switchUser: (userId: string) => void;
  availableUsers: User[];
  updateCurrentUserProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'hostelsync_user_session_v1';
const USERS_STORAGE_KEY = 'hostelsync_registered_users_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [availableUsers, setAvailableUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem(USERS_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse stored users:', e);
    }
    return INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse user session:', e);
    }
    // Default to student Rahul Sharma for demonstration readiness
    return INITIAL_USERS[0];
  });

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(availableUsers));
    } catch (e) {
      console.error(e);
    }
  }, [availableUsers]);

  const login = async (
    email: string,
    _password: string,
    expectedRole?: UserRole
  ): Promise<{ success: boolean; message?: string }> => {
    const trimmedEmail = email.trim().toLowerCase();
    const user = availableUsers.find((u) => u.email.toLowerCase() === trimmedEmail);

    if (!user) {
      return {
        success: false,
        message: 'No account registered with this email address.',
      };
    }

    if (expectedRole && user.role !== expectedRole) {
      return {
        success: false,
        message: `Account role mismatch: This account is registered as ${user.role.toUpperCase()}, not ${expectedRole.toUpperCase()}.`,
      };
    }

    setCurrentUser(user);
    return { success: true };
  };

  const register = async (
    data: Partial<User> & { password: string }
  ): Promise<{ success: boolean; message?: string }> => {
    if (!data.name || !data.email || !data.role) {
      return { success: false, message: 'Please provide full name, email, and role.' };
    }

    const emailClean = data.email.trim().toLowerCase();
    const exists = availableUsers.some((u) => u.email.toLowerCase() === emailClean);
    if (exists) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    if (data.role === 'student' && !data.studentId) {
      return { success: false, message: 'Roll Number is required for student registration.' };
    }

    const newUser: User = {
      id: `usr-${data.role}-${Date.now()}`,
      name: data.name,
      email: emailClean,
      role: data.role,
      phone: data.phone || '+91 90000 00000',
      studentId: data.studentId,
      roomNumber: data.roomNumber,
      blockName: data.blockName,
      trade: data.trade,
      avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80`,
    };

    setAvailableUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);

    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const switchUser = (userId: string) => {
    const target = availableUsers.find((u) => u.id === userId);
    if (target) {
      setCurrentUser(target);
    }
  };

  const updateCurrentUserProfile = (data: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...data };
    setCurrentUser(updated);
    setAvailableUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        role: currentUser?.role || null,
        login,
        register,
        logout,
        switchUser,
        availableUsers,
        updateCurrentUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
