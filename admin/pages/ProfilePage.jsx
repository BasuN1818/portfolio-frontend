import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Camera, Save, Lock, Eye, EyeOff,
  Monitor, Smartphone, Tablet, Laptop,
  MapPin, Globe, Trash2, Shield,
  Check, X as XIcon,
} from 'lucide-react';
import { mockAdmins, mockLoginHistory, mockDevices } from '../data/mockData';

const deviceIcons = {
  desktop: Monitor,
  mobile: Smartphone,
  tablet: Tablet,
  laptop: Laptop,
};

const PasswordStrength = ({ password }) => {
  const getStrength = () => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const strength = getStrength();
  const labels = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];
  const colors = ['bg-rose-500', 'bg-amber-500', 'bg-yellow-500', 'bg-emerald-500', 'bg-emerald-400'];

  if (!password) return null;

  return (
    <div className="space-y-1.5 mt-2">
      <div className="flex gap-1">
        {[0, 1, 2, 3, 4].map(i => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i < strength ? colors[strength - 1] : 'bg-white/[0.08]'
            }`}
          />
        ))}
      </div>
      <p className={`text-[11px] font-mono ${strength <= 2 ? 'text-amber-400' : 'text-emerald-400'}`}>
        {labels[strength - 1] || 'Too Short'}
      </p>
    </div>
  );
};

const ProfilePage = () => {
  const [adminId] = useState(() => {
    try {
      const session = localStorage.getItem('admin-logged-in');
      return session ? JSON.parse(session).id : 1;
    } catch {
      return 1;
    }
  });

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [role, setRole] = useState('Super Admin');
  const [joinedAt, setJoinedAt] = useState('');
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Password state
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);

  const [devices, setDevices] = useState(() => {
    try {
      const stored = localStorage.getItem('nb-portfolio-devices');
      return stored ? JSON.parse(stored) : mockDevices;
    } catch {
      return mockDevices;
    }
  });

  const fetchProfile = async () => {
    setLoadingProfile(true);
    // Load local cache first
    try {
      const stored = localStorage.getItem('nb-portfolio-admins');
      if (stored) {
        const list = JSON.parse(stored);
        const admin = list.find(a => a.id === adminId);
        if (admin) {
          setName(admin.name);
          setEmail(admin.email);
          setPhone(admin.phone || '');
          setBio(admin.bio || '');
          setAvatar(admin.avatar || null);
          setRole(admin.role);
          setJoinedAt(admin.joinedAt);
        }
      }
    } catch (e) {}

    // Fetch from backend
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/admins`);
      if (response.ok) {
        const list = await response.json();
        const admin = list.find(a => a.id === adminId);
        if (admin) {
          setName(admin.name);
          setEmail(admin.email);
          setPhone(admin.phone || '');
          setBio(admin.bio || '');
          setAvatar(admin.avatar || null);
          setRole(admin.role);
          setJoinedAt(admin.joinedAt);

          // Update local cache
          const localStored = localStorage.getItem('nb-portfolio-admins');
          const localList = localStored ? JSON.parse(localStored) : [];
          const updatedLocalList = localList.some(a => a.id === adminId)
            ? localList.map(a => a.id === adminId ? { ...a, ...admin } : a)
            : [...localList, admin];
          localStorage.setItem('nb-portfolio-admins', JSON.stringify(updatedLocalList));
        }
      }
    } catch (err) {
      console.warn("Backend offline, using cached profile details:", err);
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [adminId]);

  const handleSaveProfile = async () => {
    // 1. Update locally
    try {
      const stored = localStorage.getItem('nb-portfolio-admins');
      const list = stored ? JSON.parse(stored) : [...mockAdmins];
      const updated = list.map(a => 
        a.id === adminId ? { ...a, name, email, phone, bio, avatar } : a
      );
      localStorage.setItem('nb-portfolio-admins', JSON.stringify(updated));
      
      // Update session
      const sessionStored = localStorage.getItem('admin-logged-in');
      if (sessionStored) {
        const session = JSON.parse(sessionStored);
        if (session.id === adminId) {
          session.name = name;
          session.email = email;
          localStorage.setItem('admin-logged-in', JSON.stringify(session));
        }
      }

      // Log activity
      const activityStored = localStorage.getItem('nb-portfolio-activity');
      const activityList = activityStored ? JSON.parse(activityStored) : [];
      activityList.unshift({
        id: Date.now(),
        user: name,
        action: 'updated their personal profile details',
        type: 'users',
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('nb-portfolio-activity', JSON.stringify(activityList));

      // Trigger event to sync Topbar
      window.dispatchEvent(new Event('nb-profile-updated'));
    } catch (e) {
      console.error(e);
    }

    // 2. Update on backend
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await fetch(`${apiUrl}/api/admins/${adminId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, bio, avatar })
      });
    } catch (err) {
      console.warn("Backend offline, profile changes saved locally only:", err);
    }

    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleRevokeDevice = (id) => {
    const updated = devices.filter(d => d.id !== id);
    setDevices(updated);
    try {
      localStorage.setItem('nb-portfolio-devices', JSON.stringify(updated));
    } catch (e) {}
  };

  const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-heading font-bold text-2xl text-white">My Profile</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your personal information and security</p>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative rounded-2xl overflow-hidden
          bg-gradient-to-br from-white/[0.06] to-white/[0.02]
          border border-white/[0.08]
          backdrop-blur-xl
          shadow-[0_4px_6px_rgba(0,0,0,0.07),0_10px_20px_rgba(0,0,0,0.06)]"
      >
        {/* Cover */}
        <div className="h-32 bg-gradient-to-r from-indigo-600/30 via-purple-600/20 to-indigo-600/10 relative">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIi8+PC9zdmc+')] opacity-50" />
        </div>

        <div className="px-6 pb-6">
          {/* Avatar */}
          <div className="-mt-12 relative inline-block">
            {avatar ? (
              <img src={avatar} alt="Avatar" className="w-24 h-24 rounded-2xl border-4 border-slate-900 object-cover shadow-xl shadow-indigo-500/20" />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 border-4 border-slate-900 flex items-center justify-center text-2xl font-heading font-bold text-white shadow-xl shadow-indigo-500/20">
                {initials}
              </div>
            )}
            <label className="absolute -bottom-1 -right-1 w-8 h-8 rounded-xl bg-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-400 transition-colors cursor-pointer">
              <Camera className="w-4 h-4" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setAvatar(reader.result);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </label>
          </div>

          {/* Profile Info */}
          <div className="mt-4 space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-heading font-bold text-xl text-white">{name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    <Shield className="w-3 h-3" /> {role}
                  </span>
                  <span className="text-xs text-slate-500">· Joined {new Date(joinedAt || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                </div>
              </div>
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 transition-all"
                >
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditing(false)}
                    className="px-4 py-2 rounded-xl text-sm text-slate-400 bg-white/[0.04] hover:bg-white/[0.08] transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 ${
                      saved
                        ? 'bg-emerald-500 text-white'
                        : 'bg-indigo-500 text-white hover:bg-indigo-400 shadow-lg shadow-indigo-500/20'
                    }`}
                  >
                    {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                    {saved ? 'Saved!' : 'Save'}
                  </button>
                </div>
              )}
            </div>

            {/* Editable fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  disabled={!editing}
                  className={`w-full h-10 rounded-xl px-4 text-sm outline-none transition-colors ${
                    editing
                      ? 'bg-white/[0.04] border border-white/[0.08] text-white focus:border-indigo-500/50'
                      : 'bg-transparent border border-transparent text-slate-300'
                  }`}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  disabled={!editing}
                  className={`w-full h-10 rounded-xl px-4 text-sm outline-none transition-colors ${
                    editing
                      ? 'bg-white/[0.04] border border-white/[0.08] text-white focus:border-indigo-500/50'
                      : 'bg-transparent border border-transparent text-slate-300'
                  }`}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  disabled={!editing}
                  className={`w-full h-10 rounded-xl px-4 text-sm outline-none transition-colors ${
                    editing
                      ? 'bg-white/[0.04] border border-white/[0.08] text-white focus:border-indigo-500/50'
                      : 'bg-transparent border border-transparent text-slate-300'
                  }`}
                />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Bio</label>
                <textarea
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  disabled={!editing}
                  rows={3}
                  className={`w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-colors resize-none ${
                    editing
                      ? 'bg-white/[0.04] border border-white/[0.08] text-white focus:border-indigo-500/50'
                      : 'bg-transparent border border-transparent text-slate-300'
                  }`}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Change Password */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative rounded-2xl overflow-hidden
          bg-gradient-to-br from-white/[0.06] to-white/[0.02]
          border border-white/[0.08]
          backdrop-blur-xl
          shadow-[0_4px_6px_rgba(0,0,0,0.07),0_10px_20px_rgba(0,0,0,0.06)]
          p-6"
      >
        <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-heading font-semibold text-white text-base flex items-center gap-2">
              <Lock className="w-4 h-4 text-indigo-400" /> Change Password
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Update your password to keep your account secure</p>
          </div>
          <button
            onClick={() => setShowPasswordSection(!showPasswordSection)}
            className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            {showPasswordSection ? 'Cancel' : 'Change'}
          </button>
        </div>

        {showPasswordSection && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Current Password</label>
              <div className="relative">
                <input
                  type={showCurrent ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  className="w-full h-10 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 pr-10 text-sm text-white outline-none focus:border-indigo-500/50"
                />
                <button
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">New Password</label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full h-10 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 pr-10 text-sm text-white outline-none focus:border-indigo-500/50"
                />
                <button
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <PasswordStrength password={newPassword} />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className={`w-full h-10 bg-white/[0.04] border rounded-xl px-4 text-sm text-white outline-none transition-colors ${
                  confirmPassword && confirmPassword !== newPassword
                    ? 'border-rose-500/50'
                    : 'border-white/[0.08] focus:border-indigo-500/50'
                }`}
              />
              {confirmPassword && confirmPassword !== newPassword && (
                <p className="text-xs text-rose-400">Passwords don't match</p>
              )}
            </div>

            <button
              onClick={async () => {
                if (!currentPassword) {
                  alert("Please enter your current password.");
                  return;
                }
                if (!newPassword) {
                  alert("Please enter a new password.");
                  return;
                }
                if (newPassword !== confirmPassword) {
                  alert("Passwords do not match.");
                  return;
                }

                let usedBackend = false;
                let updateSuccess = false;
                let updateErrorMsg = '';

                // Try backend password update first
                try {
                  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                  const response = await fetch(`${apiUrl}/api/admins/${adminId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ currentPassword, newPassword })
                  });
                  usedBackend = true;
                  const data = await response.json();
                  if (response.ok && data.success) {
                    updateSuccess = true;
                  } else {
                    updateErrorMsg = data.error || 'Failed to update password.';
                  }
                } catch (err) {
                  console.warn("Backend offline, updating password in local storage only:", err);
                }

                // Fallback to local storage password update
                if (!usedBackend) {
                  try {
                    const stored = localStorage.getItem('nb-portfolio-admins');
                    const list = stored ? JSON.parse(stored) : [...mockAdmins];
                    const adminIndex = list.findIndex(a => a.id === adminId);
                    
                    if (adminIndex !== -1) {
                      const admin = list[adminIndex];
                      const storedPassword = admin.password || 'admin123';
                      if (currentPassword !== storedPassword) {
                        alert("Current password is incorrect.");
                        return;
                      }
                      
                      list[adminIndex].password = newPassword;
                      localStorage.setItem('nb-portfolio-admins', JSON.stringify(list));
                      updateSuccess = true;
                    } else {
                      updateErrorMsg = 'Admin account not found in local cache.';
                    }
                  } catch (e) {
                    updateErrorMsg = e.message;
                  }
                } else if (updateErrorMsg) {
                  alert(updateErrorMsg);
                  return;
                }

                if (updateSuccess) {
                  try {
                    const activityStored = localStorage.getItem('nb-portfolio-activity');
                    const activityList = activityStored ? JSON.parse(activityStored) : [];
                    activityList.unshift({
                      id: Date.now(),
                      user: name,
                      action: 'changed account password security configuration',
                      type: 'security',
                      timestamp: new Date().toISOString()
                    });
                    localStorage.setItem('nb-portfolio-activity', JSON.stringify(activityList));
                  } catch (e) {}

                  alert("Password updated successfully!");
                  setCurrentPassword('');
                  setNewPassword('');
                  setConfirmPassword('');
                  setShowPasswordSection(false);
                } else {
                  alert(updateErrorMsg || 'Password update failed.');
                }
              }}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-500 hover:bg-indigo-400 shadow-lg shadow-indigo-500/20 transition-all"
            >
              Update Password
            </button>
          </motion.div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Login History */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative rounded-2xl overflow-hidden
            bg-gradient-to-br from-white/[0.06] to-white/[0.02]
            border border-white/[0.08]
            backdrop-blur-xl
            shadow-[0_4px_6px_rgba(0,0,0,0.07),0_10px_20px_rgba(0,0,0,0.06)]
            p-6"
        >
          <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <h3 className="font-heading font-semibold text-white text-base mb-1">Login History</h3>
          <p className="text-xs text-slate-500 font-mono mb-4">Recent sign-in activity</p>

          <div className="space-y-2">
            {mockLoginHistory.map(entry => (
              <div
                key={entry.id}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/[0.03] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    entry.status === 'success' ? 'bg-emerald-400' : 'bg-rose-400'
                  }`} />
                  <div>
                    <p className="text-sm text-white">{entry.browser}</p>
                    <p className="text-[10px] text-slate-500 font-mono flex items-center gap-1.5">
                      <MapPin className="w-3 h-3" />
                      {entry.location} · {entry.ip}
                    </p>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 font-mono">
                  {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Connected Devices */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="relative rounded-2xl overflow-hidden
            bg-gradient-to-br from-white/[0.06] to-white/[0.02]
            border border-white/[0.08]
            backdrop-blur-xl
            shadow-[0_4px_6px_rgba(0,0,0,0.07),0_10px_20px_rgba(0,0,0,0.06)]
            p-6"
        >
          <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <h3 className="font-heading font-semibold text-white text-base mb-1">Connected Devices</h3>
          <p className="text-xs text-slate-500 font-mono mb-4">Active sessions on your devices</p>

          <div className="space-y-2">
            {devices.map(device => {
              const DeviceIcon = deviceIcons[device.type] || Monitor;
              return (
                <div
                  key={device.id}
                  className="flex items-center justify-between px-3 py-3 rounded-xl hover:bg-white/[0.03] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                      <DeviceIcon className="w-4 h-4 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-sm text-white flex items-center gap-2">
                        {device.name}
                        {device.current && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            THIS DEVICE
                          </span>
                        )}
                      </p>
                      <p className="text-[10px] text-slate-500 font-mono">
                        Last active: {new Date(device.lastActive).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  {!device.current && (
                    <button
                      onClick={() => handleRevokeDevice(device.id)}
                      className="px-3 py-1.5 rounded-lg text-xs text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition-all"
                    >
                      Revoke
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
