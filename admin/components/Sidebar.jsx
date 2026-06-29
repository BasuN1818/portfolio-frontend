import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Settings,
  UserCircle,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ExternalLink,
  Shield,
  MessageSquare,
} from 'lucide-react';

const navItems = [
  { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { path: '/admin/messages', icon: MessageSquare, label: 'Messages' },
  { path: '/admin/admins', icon: Users, label: 'Admin Management' },
  { path: '/admin/settings', icon: Settings, label: 'Settings' },
  { path: '/admin/profile', icon: UserCircle, label: 'Profile' },
];

const Sidebar = ({ collapsed, setCollapsed }) => {
  const location = useLocation();
  const [siteName, setSiteName] = useState('AdminHub');
  const [logo, setLogo] = useState(null);

  const loadSettings = () => {
    try {
      const stored = localStorage.getItem('nb-portfolio-settings');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.siteName) setSiteName(parsed.siteName);
        if (parsed.logo) setLogo(parsed.logo);
        else setLogo(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadSettings();
    window.addEventListener('nb-settings-updated', loadSettings);
    return () => window.removeEventListener('nb-settings-updated', loadSettings);
  }, []);

  const handleGoBack = () => {
    window.location.href = '/';
  };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCollapsed(true)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 80 : 260 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`
          fixed top-0 left-0 h-screen z-50
          bg-gradient-to-b from-slate-900/95 to-slate-950/95
          backdrop-blur-2xl
          border-r border-white/[0.06]
          flex flex-col
          shadow-[4px_0_24px_rgba(0,0,0,0.2)]
          ${collapsed ? 'lg:w-20' : 'lg:w-[260px]'}
          ${collapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'}
          transition-transform lg:transition-none duration-300
        `}
      >
        {/* Brand */}
        <div className="h-16 flex items-center px-5 border-b border-white/[0.06] gap-3 shrink-0">
          {logo ? (
            <img src={logo} alt="Logo" className="w-9 h-9 rounded-xl object-cover shrink-0" />
          ) : (
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 shrink-0">
              <Shield className="w-5 h-5 text-white" />
            </div>
          )}
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <h1 className="font-heading font-bold text-white text-base tracking-tight whitespace-nowrap">
                  {siteName}
                </h1>
                <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider whitespace-nowrap">
                  Control Panel
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
          {!collapsed && (
            <p className="text-[10px] font-mono uppercase tracking-widest text-slate-600 px-3 mb-3">
              Navigation
            </p>
          )}
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.end
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path);

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => {
                  if (window.innerWidth < 1024) setCollapsed(true);
                }}
                className="block"
              >
                <motion.div
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    relative flex items-center gap-3 px-3 py-2.5 rounded-xl
                    transition-all duration-200 group
                    ${isActive
                      ? 'bg-indigo-500/10 text-indigo-400'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                    }
                  `}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.6)]"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}

                  <div className={`
                    w-9 h-9 rounded-lg flex items-center justify-center shrink-0
                    transition-all duration-200
                    ${isActive
                      ? 'bg-indigo-500/15 shadow-inner'
                      : 'bg-white/[0.03] group-hover:bg-white/[0.06]'
                    }
                  `}>
                    <Icon className={`w-[18px] h-[18px] ${isActive ? 'text-indigo-400' : ''}`} />
                  </div>

                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="text-sm font-medium whitespace-nowrap"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {/* Tooltip for collapsed */}
                  {collapsed && (
                    <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-800 border border-white/10 rounded-lg text-xs text-white font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-xl z-50">
                      {item.label}
                    </div>
                  )}
                </motion.div>
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="px-3 py-4 border-t border-white/[0.06] space-y-1 shrink-0">
          <button
            onClick={handleGoBack}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all duration-200 group"
          >
            <div className="w-9 h-9 rounded-lg bg-white/[0.03] group-hover:bg-emerald-500/10 flex items-center justify-center shrink-0 transition-all">
              <ExternalLink className="w-[18px] h-[18px]" />
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm font-medium whitespace-nowrap"
                >
                  Back to Site
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {/* Collapse toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:text-white hover:bg-white/[0.04] transition-all duration-200 group"
          >
            <div className="w-9 h-9 rounded-lg bg-white/[0.03] group-hover:bg-white/[0.06] flex items-center justify-center shrink-0 transition-all">
              {collapsed ? (
                <ChevronRight className="w-[18px] h-[18px]" />
              ) : (
                <ChevronLeft className="w-[18px] h-[18px]" />
              )}
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm font-medium whitespace-nowrap"
                >
                  Collapse
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
