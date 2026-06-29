import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings, Shield, Bell, Palette, Database,
  Globe, Clock, Languages, Upload, Save,
  Lock, Smartphone, Timer, Mail, MessageSquare,
  Sun, Moon, Download, RefreshCcw, Check,
} from 'lucide-react';
import { useTheme } from '../components/ThemeProvider';

const tabs = [
  { id: 'general', label: 'General', icon: Settings },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'theme', label: 'Theme', icon: Palette },
  { id: 'backup', label: 'Backup', icon: Database },
];

const ToggleSwitch = ({ enabled, onToggle, label, description }) => (
  <div className="flex items-center justify-between py-3">
    <div>
      <p className="text-sm font-medium text-white">{label}</p>
      {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
    </div>
    <button
      onClick={onToggle}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
        enabled ? 'bg-indigo-500' : 'bg-white/10'
      }`}
    >
      <motion.div
        animate={{ x: enabled ? 20 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-md"
      />
    </button>
  </div>
);

const SettingsPage = () => {
  const { mode, toggleMode, accentColor, setAccentColor, accentColors } = useTheme();
  const [activeTab, setActiveTab] = useState('general');
  const [saved, setSaved] = useState(false);

  // Load configuration helper
  const loadSavedSettings = () => {
    try {
      const stored = localStorage.getItem('nb-portfolio-settings');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  };

  const initialSettings = loadSavedSettings();

  // General settings state
  const [siteName, setSiteName] = useState(initialSettings.siteName || 'AdminHub Pro');
  const [timezone, setTimezone] = useState(initialSettings.timezone || 'Asia/Kolkata');
  const [language, setLanguage] = useState(initialSettings.language || 'en');
  const [logo, setLogo] = useState(initialSettings.logo || null);

  // Security settings state
  const [minPassword, setMinPassword] = useState(initialSettings.minPassword ?? 8);
  const [specialChars, setSpecialChars] = useState(initialSettings.specialChars ?? true);
  const [passwordExpiry, setPasswordExpiry] = useState(initialSettings.passwordExpiry ?? 90);
  const [twoFactor, setTwoFactor] = useState(initialSettings.twoFactor ?? true);
  const [sessionTimeout, setSessionTimeout] = useState(initialSettings.sessionTimeout ?? 30);

  // Notification settings state
  const [emailAlerts, setEmailAlerts] = useState(initialSettings.emailAlerts ?? true);
  const [smsAlerts, setSmsAlerts] = useState(initialSettings.smsAlerts ?? false);
  const [loginAlerts, setLoginAlerts] = useState(initialSettings.loginAlerts ?? true);
  const [securityAlerts, setSecurityAlerts] = useState(initialSettings.securityAlerts ?? true);
  const [updateAlerts, setUpdateAlerts] = useState(initialSettings.updateAlerts ?? false);
  const [weeklyReport, setWeeklyReport] = useState(initialSettings.weeklyReport ?? true);

  // Backup state
  const [backups] = useState([
    { id: 1, date: '2026-06-27T06:00:00Z', size: '24.5 MB', type: 'Automated', status: 'success' },
    { id: 2, date: '2026-06-26T06:00:00Z', size: '24.3 MB', type: 'Automated', status: 'success' },
    { id: 3, date: '2026-06-25T14:30:00Z', size: '24.1 MB', type: 'Manual', status: 'success' },
    { id: 4, date: '2026-06-24T06:00:00Z', size: '23.9 MB', type: 'Automated', status: 'failed' },
  ]);

  const handleExportJSON = () => {
    const data = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('nb-portfolio-') || key.startsWith('admin-')) {
        try {
          data[key] = JSON.parse(localStorage.getItem(key));
        } catch {
          data[key] = localStorage.getItem(key);
        }
      }
    }
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `admin-backup-${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportCSV = () => {
    try {
      const storedAdmins = localStorage.getItem('nb-portfolio-admins');
      const adminList = storedAdmins ? JSON.parse(storedAdmins) : [];
      if (adminList.length === 0) return;
      
      const headers = ['id', 'name', 'email', 'phone', 'role', 'status', 'joinedAt'];
      const csvRows = [];
      csvRows.push(headers.join(','));
      
      adminList.forEach(admin => {
        const values = headers.map(header => {
          const val = admin[header] || '';
          return `"${val.toString().replace(/"/g, '""')}"`;
        });
        csvRows.push(values.join(','));
      });
      
      const csvStr = "data:text/csv;charset=utf-8," + encodeURIComponent(csvRows.join('\n'));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", csvStr);
      downloadAnchor.setAttribute("download", `admin-list-${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSave = () => {
    const settingsPayload = {
      siteName,
      timezone,
      language,
      logo,
      minPassword,
      specialChars,
      passwordExpiry,
      twoFactor,
      sessionTimeout,
      emailAlerts,
      smsAlerts,
      loginAlerts,
      securityAlerts,
      updateAlerts,
      weeklyReport
    };
    try {
      localStorage.setItem('nb-portfolio-settings', JSON.stringify(settingsPayload));
      // Log activity
      const activityStored = localStorage.getItem('nb-portfolio-activity');
      const activityList = activityStored ? JSON.parse(activityStored) : [];
      activityList.unshift({
        id: Date.now(),
        user: 'Basanagoud N.',
        action: 'saved system settings configuration',
        type: 'settings',
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('nb-portfolio-activity', JSON.stringify(activityList));
      // Dispatch custom event
      window.dispatchEvent(new Event('nb-settings-updated'));
    } catch (e) {
      console.error(e);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" /> Site Name
              </label>
              <input
                type="text"
                value={siteName}
                onChange={e => setSiteName(e.target.value)}
                className="w-full h-10 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 text-sm text-white outline-none focus:border-indigo-500/50 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5" /> Logo Upload
              </label>
              <div className="flex items-center gap-4">
                <label className="w-16 h-16 rounded-2xl bg-white/[0.04] border-2 border-dashed border-white/[0.12] flex items-center justify-center text-slate-500 hover:border-indigo-500/40 hover:text-indigo-400 transition-all cursor-pointer overflow-hidden relative group">
                  {logo ? (
                    <img src={logo} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <Upload className="w-6 h-6" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setLogo(reader.result);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
                <div>
                  <p className="text-sm text-slate-300">Upload your logo</p>
                  <p className="text-xs text-slate-500">PNG, SVG up to 2MB</p>
                  {logo && (
                    <button
                      type="button"
                      onClick={() => setLogo(null)}
                      className="text-xs text-rose-400 hover:text-rose-300 mt-1 block"
                    >
                      Remove Logo
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Timezone
                </label>
                <select
                  value={timezone}
                  onChange={e => setTimezone(e.target.value)}
                  className="w-full h-10 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 text-sm text-white outline-none focus:border-indigo-500/50 transition-colors appearance-none cursor-pointer"
                >
                  <option value="Asia/Kolkata" className="bg-slate-900">Asia/Kolkata (IST)</option>
                  <option value="America/New_York" className="bg-slate-900">America/New York (EST)</option>
                  <option value="Europe/London" className="bg-slate-900">Europe/London (GMT)</option>
                  <option value="Asia/Tokyo" className="bg-slate-900">Asia/Tokyo (JST)</option>
                  <option value="America/Los_Angeles" className="bg-slate-900">America/Los Angeles (PST)</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Languages className="w-3.5 h-3.5" /> Language
                </label>
                <select
                  value={language}
                  onChange={e => setLanguage(e.target.value)}
                  className="w-full h-10 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 text-sm text-white outline-none focus:border-indigo-500/50 transition-colors appearance-none cursor-pointer"
                >
                  <option value="en" className="bg-slate-900">English</option>
                  <option value="hi" className="bg-slate-900">Hindi</option>
                  <option value="kn" className="bg-slate-900">Kannada</option>
                  <option value="es" className="bg-slate-900">Spanish</option>
                  <option value="fr" className="bg-slate-900">French</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" /> Minimum Password Length
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="6"
                  max="24"
                  value={minPassword}
                  onChange={e => setMinPassword(Number(e.target.value))}
                  className="flex-1 h-2 bg-white/[0.08] rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
                <span className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-sm font-mono text-indigo-400 font-bold">
                  {minPassword}
                </span>
              </div>
            </div>

            <ToggleSwitch
              enabled={specialChars}
              onToggle={() => setSpecialChars(!specialChars)}
              label="Require Special Characters"
              description="Passwords must include !@#$%^&* symbols"
            />

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Timer className="w-3.5 h-3.5" /> Password Expiry (days)
              </label>
              <select
                value={passwordExpiry}
                onChange={e => setPasswordExpiry(Number(e.target.value))}
                className="w-full h-10 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 text-sm text-white outline-none focus:border-indigo-500/50 transition-colors appearance-none cursor-pointer"
              >
                <option value={30} className="bg-slate-900">30 days</option>
                <option value={60} className="bg-slate-900">60 days</option>
                <option value={90} className="bg-slate-900">90 days</option>
                <option value={180} className="bg-slate-900">180 days</option>
                <option value={0} className="bg-slate-900">Never</option>
              </select>
            </div>

            <ToggleSwitch
              enabled={twoFactor}
              onToggle={() => setTwoFactor(!twoFactor)}
              label="Two-Factor Authentication (2FA)"
              description="Require 2FA for all admin logins"
            />

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Session Timeout (minutes)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="5"
                  max="120"
                  step="5"
                  value={sessionTimeout}
                  onChange={e => setSessionTimeout(Number(e.target.value))}
                  className="flex-1 h-2 bg-white/[0.08] rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
                <span className="w-14 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-sm font-mono text-indigo-400 font-bold">
                  {sessionTimeout}m
                </span>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-2">
            <div className="bg-white/[0.02] rounded-xl border border-white/[0.06] p-4 space-y-1">
              <h4 className="text-sm font-medium text-white flex items-center gap-2 mb-3">
                <Mail className="w-4 h-4 text-indigo-400" /> Channel Preferences
              </h4>
              <ToggleSwitch enabled={emailAlerts} onToggle={() => setEmailAlerts(!emailAlerts)} label="Email Alerts" description="Receive notifications via email" />
              <ToggleSwitch enabled={smsAlerts} onToggle={() => setSmsAlerts(!smsAlerts)} label="SMS Alerts" description="Receive notifications via SMS" />
            </div>

            <div className="bg-white/[0.02] rounded-xl border border-white/[0.06] p-4 space-y-1">
              <h4 className="text-sm font-medium text-white flex items-center gap-2 mb-3">
                <Bell className="w-4 h-4 text-indigo-400" /> Event Notifications
              </h4>
              <ToggleSwitch enabled={loginAlerts} onToggle={() => setLoginAlerts(!loginAlerts)} label="Login Alerts" description="New login from unknown device" />
              <ToggleSwitch enabled={securityAlerts} onToggle={() => setSecurityAlerts(!securityAlerts)} label="Security Alerts" description="Suspicious activity and threats" />
              <ToggleSwitch enabled={updateAlerts} onToggle={() => setUpdateAlerts(!updateAlerts)} label="Update Alerts" description="System and feature updates" />
              <ToggleSwitch enabled={weeklyReport} onToggle={() => setWeeklyReport(!weeklyReport)} label="Weekly Report" description="Summary of weekly activity" />
            </div>
          </div>
        );

      case 'theme':
        return (
          <div className="space-y-6">
            {/* Mode toggle */}
            <div>
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3 block">
                Appearance
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => { if (mode !== 'dark') toggleMode(); }}
                  className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${
                    mode === 'dark'
                      ? 'border-indigo-500 bg-indigo-500/5'
                      : 'border-white/[0.08] bg-white/[0.02] hover:border-white/[0.15]'
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center">
                    <Moon className="w-6 h-6 text-indigo-400" />
                  </div>
                  <span className="text-sm font-medium text-white">Dark</span>
                </button>
                <button
                  onClick={() => { if (mode !== 'light') toggleMode(); }}
                  className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${
                    mode === 'light'
                      ? 'border-indigo-500 bg-indigo-500/5'
                      : 'border-white/[0.08] bg-white/[0.02] hover:border-white/[0.15]'
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center">
                    <Sun className="w-6 h-6 text-amber-500" />
                  </div>
                  <span className="text-sm font-medium text-white">Light</span>
                </button>
              </div>
            </div>

            {/* Accent Color */}
            <div>
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3 block">
                Accent Color
              </label>
              <div className="flex gap-3">
                {Object.entries(accentColors).map(([name, colors]) => (
                  <button
                    key={name}
                    onClick={() => setAccentColor(name)}
                    className={`relative w-10 h-10 rounded-xl transition-all ${
                      accentColor === name
                        ? 'ring-2 ring-offset-2 ring-offset-slate-900 scale-110'
                        : 'hover:scale-105'
                    }`}
                    style={{
                      backgroundColor: colors.primary,
                      ringColor: colors.primary,
                    }}
                  >
                    {accentColor === name && (
                      <Check className="w-4 h-4 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div>
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3 block">
                Preview
              </label>
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 space-y-3">
                <div className="h-3 w-32 rounded-full" style={{ backgroundColor: accentColors[accentColor]?.primary }} />
                <div className="h-2 w-48 bg-white/10 rounded-full" />
                <div className="h-2 w-36 bg-white/[0.06] rounded-full" />
                <button
                  className="px-4 py-2 rounded-xl text-sm text-white font-medium"
                  style={{ backgroundColor: accentColors[accentColor]?.primary }}
                >
                  Sample Button
                </button>
              </div>
            </div>
          </div>
        );

      case 'backup':
        return (
          <div className="space-y-6">
            {/* Export buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button onClick={handleExportJSON} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06] transition-all text-left group">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                  <Download className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Export as JSON</p>
                  <p className="text-xs text-slate-500">Full database export</p>
                </div>
              </button>
              <button onClick={handleExportCSV} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06] transition-all text-left group">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                  <Download className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Export as CSV</p>
                  <p className="text-xs text-slate-500">Spreadsheet format</p>
                </div>
              </button>
            </div>

            {/* Backup history */}
            <div>
              <h4 className="text-sm font-medium text-white mb-3">Backup History</h4>
              <div className="space-y-2">
                {backups.map(backup => (
                  <div
                    key={backup.id}
                    className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        backup.status === 'success' ? 'bg-emerald-400' : 'bg-rose-400'
                      }`} />
                      <div>
                        <p className="text-sm text-white">
                          {new Date(backup.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          {' · '}
                          <span className="text-slate-400">{backup.size}</span>
                        </p>
                        <p className="text-[10px] text-slate-500 font-mono">{backup.type}</p>
                      </div>
                    </div>
                    <button className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                      <RefreshCcw className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="font-heading font-bold text-2xl text-white">Settings</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your platform preferences and configuration</p>
        </div>
        <button
          onClick={handleSave}
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
            saved
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
              : 'bg-indigo-500 text-white hover:bg-indigo-400 shadow-lg shadow-indigo-500/20'
          }`}
        >
          {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:w-56 shrink-0"
        >
          <div className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.04] border border-transparent'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex-1 relative rounded-2xl overflow-hidden
            bg-gradient-to-br from-white/[0.06] to-white/[0.02]
            border border-white/[0.08]
            backdrop-blur-xl
            shadow-[0_4px_6px_rgba(0,0,0,0.07),0_10px_20px_rgba(0,0,0,0.06)]
            p-6"
        >
          <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          {renderTabContent()}
        </motion.div>
      </div>
    </div>
  );
};

export default SettingsPage;
