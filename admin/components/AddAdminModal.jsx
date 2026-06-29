import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserPlus, Mail, User, Shield, Lock } from 'lucide-react';
import { allPermissions } from '../data/mockData';

const roles = ['Super Admin', 'Manager', 'Editor', 'Viewer'];

const AddAdminModal = ({ isOpen, onClose, onSubmit, editAdmin = null }) => {
  const [formData, setFormData] = useState({
    name: editAdmin?.name || '',
    email: editAdmin?.email || '',
    role: editAdmin?.role || 'Viewer',
    permissions: editAdmin?.permissions || [],
  });

  // Reset form whenever the modal opens or editAdmin changes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: editAdmin?.name || '',
        email: editAdmin?.email || '',
        role: editAdmin?.role || 'Viewer',
        permissions: editAdmin?.permissions || [],
      });
    }
  }, [isOpen, editAdmin]);

  const handlePermissionToggle = (key) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(key)
        ? prev.permissions.filter(p => p !== key)
        : [...prev.permissions, key],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="w-full max-w-lg bg-slate-900/95 backdrop-blur-2xl border border-white/[0.08] rounded-2xl shadow-[0_25px_50px_rgba(0,0,0,0.5)] overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                  <UserPlus className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h2 className="font-heading font-semibold text-white">
                    {editAdmin ? 'Edit Admin' : 'Add New Admin'}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {editAdmin ? 'Update admin details' : 'Create a new admin account'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg hover:bg-white/[0.06] flex items-center justify-center text-slate-400 hover:text-white transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" /> Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter full name"
                  required
                  className="w-full h-10 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 text-sm text-white placeholder-slate-600 outline-none focus:border-indigo-500/50 transition-colors"
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" /> Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter email address"
                  required
                  className="w-full h-10 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 text-sm text-white placeholder-slate-600 outline-none focus:border-indigo-500/50 transition-colors"
                />
              </div>

              {/* Role */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" /> Role
                </label>
                <select
                  value={formData.role}
                  onChange={e => setFormData(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full h-10 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 text-sm text-white outline-none focus:border-indigo-500/50 transition-colors appearance-none cursor-pointer"
                >
                  {roles.map(role => (
                    <option key={role} value={role} className="bg-slate-900 text-white">
                      {role}
                    </option>
                  ))}
                </select>
              </div>

              {/* Permissions */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" /> Permissions
                </label>
                <div className="space-y-2">
                  {allPermissions.map(perm => (
                    <label
                      key={perm.key}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] transition-colors cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.permissions.includes(perm.key)}
                        onChange={() => handlePermissionToggle(perm.key)}
                        className="w-4 h-4 rounded border-white/20 bg-white/[0.05] text-indigo-500 focus:ring-indigo-500/30 focus:ring-offset-0"
                      />
                      <div>
                        <p className="text-sm text-white font-medium">{perm.label}</p>
                        <p className="text-[11px] text-slate-500">{perm.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-500 hover:bg-indigo-400 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all"
                >
                  {editAdmin ? 'Update Admin' : 'Create Admin'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddAdminModal;
