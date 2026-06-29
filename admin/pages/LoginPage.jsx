import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  LogIn,
  ArrowLeft,
} from 'lucide-react';
import { mockAdmins } from '../data/mockData';
import logo from '../../logo.png';

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!password.trim()) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);

    let loggedInAdmin = null;
    let loginErrorMsg = '';
    let usedBackend = false;

    // Try backend authentication
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      usedBackend = true;
      const data = await response.json();

      if (response.ok && data.success) {
        loggedInAdmin = data.admin;
      } else {
        loginErrorMsg = data.error || 'Authentication failed.';
      }
    } catch (err) {
      console.warn("Backend offline, falling back to localStorage authentication:", err);
    }

    // Fallback to localStorage authentication if backend is unreachable
    if (!usedBackend) {
      // Load admins from localStorage or defaults
      let adminList;
      try {
        const stored = localStorage.getItem('nb-portfolio-admins');
        adminList = stored ? JSON.parse(stored) : [...mockAdmins];
      } catch {
        adminList = [...mockAdmins];
      }

      // Find admin by email
      const admin = adminList.find(
        a => a.email.toLowerCase() === email.trim().toLowerCase()
      );

      if (!admin) {
        setError('No admin account found with this email address.');
        setLoading(false);
        return;
      }

      if (admin.status === 'inactive') {
        setError('This account has been suspended. Contact the Super Admin.');
        setLoading(false);
        return;
      }

      // Check password (default: admin123)
      const storedPassword = admin.password || 'admin123';
      if (password !== storedPassword) {
        setError('Incorrect password. Please try again.');
        setLoading(false);
        return;
      }

      loggedInAdmin = admin;
    } else if (loginErrorMsg) {
      // If backend was used but returned an authentication error
      setError(loginErrorMsg);
      setLoading(false);
      return;
    }

    if (!loggedInAdmin) {
      setError('Authentication failed. Please check your credentials.');
      setLoading(false);
      return;
    }

    // Success — store session
    const session = {
      id: loggedInAdmin.id,
      name: loggedInAdmin.name,
      email: loggedInAdmin.email,
      role: loggedInAdmin.role,
      loginTime: new Date().toISOString(),
    };
    localStorage.setItem('admin-logged-in', JSON.stringify(session));

    // Log activity
    try {
      const activityStored = localStorage.getItem('nb-portfolio-activity');
      const activityList = activityStored ? JSON.parse(activityStored) : [];
      activityList.unshift({
        id: Date.now(),
        user: loggedInAdmin.name,
        action: `signed in to the admin panel`,
        type: 'security',
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem('nb-portfolio-activity', JSON.stringify(activityList));
    } catch (err) { }

    // Push notification
    try {
      const notifStored = localStorage.getItem('nb-portfolio-notifications');
      const notifList = notifStored ? JSON.parse(notifStored) : [];
      notifList.unshift({
        id: Date.now() + 1,
        type: 'success',
        title: 'Admin signed in',
        message: `${loggedInAdmin.name} logged in as ${loggedInAdmin.role}`,
        time: new Date().toISOString(),
        read: false,
      });
      localStorage.setItem('nb-portfolio-notifications', JSON.stringify(notifList));
    } catch (err) { }

    setLoading(false);
    onLogin(session);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden" style={{ cursor: 'default' }}>
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-500/[0.06] rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/[0.05] rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/[0.03] rounded-full blur-[150px]" />
      </div>

      {/* Grid pattern */}
      <div
        className="fixed inset-0 opacity-[0.015] pointer-events-none z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Back to site */}
        <motion.a
          href="/"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Website
        </motion.a>

        {/* Login Card */}
        <div
          className="relative rounded-3xl overflow-hidden
            bg-gradient-to-br from-white/[0.07] to-white/[0.02]
            border border-white/[0.08]
            backdrop-blur-2xl
            shadow-[0_25px_60px_rgba(0,0,0,0.3)]"
        >
          {/* Top glow */}
          <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />

          <div className="p-8 sm:p-10">
            {/* Brand */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
                className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto mb-4 shadow-xl overflow-hidden"
              >
                <img src={logo} alt="Logo" className="w-full h-full object-contain p-2" />
              </motion.div>
              <h1 className="font-heading font-bold text-2xl text-white mb-1">
                BN Portfolio Admin Panel
              </h1>
              <p className="text-sm text-slate-500">
                Sign in to access the control panel
              </p>
            </div>

            {/* Error message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -8, height: 0 }}
                  className="mb-5"
                >
                  <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
                    <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                    <p className="text-sm text-rose-300">{error}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" /> Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(''); }}
                  placeholder="admin@example.com"
                  autoComplete="email"
                  className="w-full h-12 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 text-sm text-white placeholder-slate-600 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" /> Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => { setPassword(e.target.value); setError(''); }}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="w-full h-12 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 pr-12 text-sm text-white placeholder-slate-600 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className={`w-full h-12 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all ${loading
                    ? 'bg-indigo-500/50 cursor-wait'
                    : 'bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 shadow-lg shadow-indigo-500/25'
                  }`}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </>
                )}
              </motion.button>
            </form>


          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[11px] text-slate-600 mt-6 font-mono">
          AdminHub Pro &middot; Only authorized admins may access this panel
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
