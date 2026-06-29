import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Bell,
  ChevronDown,
  User,
  LogOut,
  Settings,
  Menu,
  X,
  Check,
  AlertTriangle,
  Info,
  UserPlus,
  Shield,
} from 'lucide-react';

const defaultNotifications = [
  { id: 1, type: 'info', title: 'System update available', message: 'Version 2.5.0 ready to install', time: new Date(Date.now() - 5 * 60000).toISOString(), read: false },
  { id: 2, type: 'success', title: 'Backup completed', message: 'Daily backup finished successfully', time: new Date(Date.now() - 3600000).toISOString(), read: false },
  { id: 3, type: 'warning', title: 'High server load', message: 'CPU usage at 87% on prod-server-2', time: new Date(Date.now() - 7200000).toISOString(), read: true },
  { id: 4, type: 'info', title: 'New admin registered', message: 'Arjun Reddy joined as Editor', time: new Date(Date.now() - 18000000).toISOString(), read: true },
];

const pageTitles = {
  '/admin': 'Dashboard',
  '/admin/messages': 'Contact Messages',
  '/admin/admins': 'Admin Management',
  '/admin/settings': 'Settings',
  '/admin/profile': 'Profile',
};

const timeAgo = (timestamp) => {
  const diff = Date.now() - new Date(timestamp).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

const Topbar = ({ onToggleSidebar, sidebarCollapsed, onLogout }) => {
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [adminName, setAdminName] = useState('Basanagoud');
  const [adminInitials, setAdminInitials] = useState('BN');
  const [adminAvatar, setAdminAvatar] = useState(null);
  const [timezone, setTimezone] = useState('Asia/Kolkata');
  const [language, setLanguage] = useState('en');
  
  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const searchRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.read).length;
  const currentTitle = pageTitles[location.pathname] || 'Dashboard';

  const loadNotifications = () => {
    try {
      const stored = localStorage.getItem('nb-portfolio-notifications');
      if (stored) {
        setNotifications(JSON.parse(stored));
      } else {
        // Seed defaults on first load
        localStorage.setItem('nb-portfolio-notifications', JSON.stringify(defaultNotifications));
        setNotifications(defaultNotifications);
      }
    } catch (e) {
      setNotifications(defaultNotifications);
    }
  };

  const loadSettingsAndProfile = () => {
    try {
      const storedSettings = localStorage.getItem('nb-portfolio-settings');
      if (storedSettings) {
        const parsed = JSON.parse(storedSettings);
        if (parsed.timezone) setTimezone(parsed.timezone);
        if (parsed.language) setLanguage(parsed.language);
      }
    } catch (e) {}

    try {
      const storedAdmins = localStorage.getItem('nb-portfolio-admins');
      if (storedAdmins) {
        const list = JSON.parse(storedAdmins);
        // Use logged-in admin ID if available
        const loggedInId = (() => {
          try {
            const session = localStorage.getItem('admin-logged-in');
            return session ? JSON.parse(session).id : 1;
          } catch { return 1; }
        })();
        const adminObj = list.find(a => a.id === loggedInId) || list[0];
        if (adminObj) {
          setAdminName(adminObj.name);
          setAdminAvatar(adminObj.avatar || null);
          const initials = adminObj.name.split(' ').map(n => n[0]).join('').substring(0, 2);
          setAdminInitials(initials);
        }
      }
    } catch (e) {}
  };

  useEffect(() => {
    loadNotifications();
    loadSettingsAndProfile();
    window.addEventListener('nb-settings-updated', loadSettingsAndProfile);
    window.addEventListener('nb-profile-updated', loadSettingsAndProfile);
    window.addEventListener('nb-notifications-updated', loadNotifications);
    return () => {
      window.removeEventListener('nb-settings-updated', loadSettingsAndProfile);
      window.removeEventListener('nb-profile-updated', loadSettingsAndProfile);
      window.removeEventListener('nb-notifications-updated', loadNotifications);
    };
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    try {
      localStorage.setItem('nb-portfolio-notifications', JSON.stringify(updated));
    } catch (e) {}
  };

  const getNotifIcon = (type) => {
    switch (type) {
      case 'success': return <Check className="w-4 h-4 text-emerald-400" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      default: return <Info className="w-4 h-4 text-indigo-400" />;
    }
  };

  const formattedDate = new Date().toLocaleDateString(
    language === 'en' ? 'en-US' : language,
    {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: timezone,
    }
  );

  return (
    <header className="h-16 border-b border-white/[0.06] bg-slate-950/80 backdrop-blur-2xl flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
      {/* Left: hamburger + title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden w-9 h-9 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-slate-400 transition-colors"
        >
          {sidebarCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
        </button>

        <div>
          <h2 className="font-heading font-semibold text-white text-lg leading-tight">
            {currentTitle}
          </h2>
          <p className="text-[11px] text-slate-500 font-mono hidden sm:block">
            {formattedDate}
          </p>
        </div>
      </div>

      {/* Right: search, notifications, profile */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="relative">
          <AnimatePresence>
            {searchOpen && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 260, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="absolute right-0 top-1/2 -translate-y-1/2 overflow-hidden"
              >
                <input
                  ref={searchRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full h-9 bg-white/[0.05] border border-white/[0.1] rounded-lg px-3 text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500/50 transition-colors"
                  autoFocus
                  onBlur={() => { if (!searchQuery) setSearchOpen(false); }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {!searchOpen && (
            <button
              onClick={() => setSearchOpen(true)}
              className="w-9 h-9 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-slate-400 hover:text-white transition-all group"
            >
              <Search className="w-[18px] h-[18px]" />
            </button>
          )}
        </div>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
            className="relative w-9 h-9 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-slate-400 hover:text-white transition-all"
          >
            <Bell className="w-[18px] h-[18px]" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center shadow-lg shadow-rose-500/30 animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-12 w-80 bg-slate-900/95 backdrop-blur-2xl border border-white/[0.08] rounded-2xl shadow-[0_25px_50px_rgba(0,0,0,0.4)] overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-white/[0.06] flex items-center justify-between">
                  <h3 className="font-heading font-semibold text-white text-sm">Notifications</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center">
                      <Bell className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                      <p className="text-sm text-slate-500">No notifications yet</p>
                    </div>
                  ) : (
                    notifications.slice(0, 15).map((notif) => (
                      <div
                        key={notif.id}
                        className={`px-4 py-3 hover:bg-white/[0.03] transition-colors border-b border-white/[0.04] last:border-0 ${!notif.read ? 'bg-indigo-500/[0.03]' : ''}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-7 h-7 rounded-lg bg-white/[0.05] flex items-center justify-center shrink-0 mt-0.5">
                            {getNotifIcon(notif.type)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-white leading-tight">{notif.title}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{notif.message}</p>
                            <p className="text-[10px] text-slate-600 mt-1 font-mono">{timeAgo(notif.time)}</p>
                          </div>
                          {!notif.read && (
                            <div className="w-2 h-2 rounded-full bg-indigo-500 shrink-0 mt-1.5 shadow-[0_0_6px_rgba(99,102,241,0.6)]" />
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile dropdown */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
            className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-white/[0.04] transition-all"
          >
            {adminAvatar ? (
              <img src={adminAvatar} alt="Profile" className="w-8 h-8 rounded-lg object-cover shadow-lg shadow-indigo-500/20" />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-heading font-bold text-xs shadow-lg shadow-indigo-500/20">
                {adminInitials}
              </div>
            )}
            <div className="hidden sm:block text-left">
              <p className="text-xs font-medium text-white leading-tight">{adminName}</p>
              <p className="text-[10px] text-slate-500">Super Admin</p>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-500 hidden sm:block transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-12 w-56 bg-slate-900/95 backdrop-blur-2xl border border-white/[0.08] rounded-2xl shadow-[0_25px_50px_rgba(0,0,0,0.4)] overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-white/[0.06]">
                  <p className="font-medium text-white text-sm">{adminName}</p>
                  <p className="text-xs text-slate-500">basanagoud@admin.com</p>
                </div>
                <div className="p-2">
                  <a href="/admin/profile" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/[0.04] transition-all">
                    <User className="w-4 h-4" /> View Profile
                  </a>
                  <a href="/admin/settings" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/[0.04] transition-all">
                    <Settings className="w-4 h-4" /> Settings
                  </a>
                  <div className="h-px bg-white/[0.06] my-1" />
                  <button
                    onClick={() => {
                      if (onLogout) onLogout();
                      window.location.href = '/';
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
