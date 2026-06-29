import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ThemeProvider } from './components/ThemeProvider';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import DashboardPage from './pages/DashboardPage';
import MessagesPage from './pages/MessagesPage';
import AdminManagementPage from './pages/AdminManagementPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';

const AdminApp = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [loggedIn, setLoggedIn] = useState(() => {
    try {
      const session = localStorage.getItem('admin-logged-in');
      return session ? JSON.parse(session) : null;
    } catch {
      return null;
    }
  });

  const handleLogin = (session) => {
    setLoggedIn(session);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin-logged-in');
    setLoggedIn(null);
  };

  // Show login page if not authenticated
  if (!loggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <ThemeProvider>
      <div className="admin-root min-h-screen bg-slate-950 text-white font-sans" style={{ cursor: 'default' }}>
        {/* Ambient background */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-500/[0.03] rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/[0.03] rounded-full blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/[0.02] rounded-full blur-[150px]" />
        </div>

        {/* Sidebar */}
        <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />

        {/* Main content area */}
        <motion.div
          initial={false}
          animate={{
            marginLeft: sidebarCollapsed ? 80 : 260,
          }}
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative z-10 min-h-screen hidden lg:block"
        >
          <Topbar
            onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
            sidebarCollapsed={sidebarCollapsed}
            onLogout={handleLogout}
          />
          <main className="p-6">
            <Routes>
              <Route index element={<DashboardPage />} />
              <Route path="messages" element={<MessagesPage />} />
              <Route path="admins" element={<AdminManagementPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Routes>
          </main>
        </motion.div>

        {/* Mobile layout */}
        <div className="lg:hidden relative z-10 min-h-screen">
          <Topbar
            onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
            sidebarCollapsed={sidebarCollapsed}
            onLogout={handleLogout}
          />
          <main className="p-4">
            <Routes>
              <Route index element={<DashboardPage />} />
              <Route path="messages" element={<MessagesPage />} />
              <Route path="admins" element={<AdminManagementPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default AdminApp;
