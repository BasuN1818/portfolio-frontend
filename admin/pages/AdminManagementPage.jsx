import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, ArrowRightLeft, Search, Filter } from 'lucide-react';
import AdminTable from '../components/AdminTable';
import AddAdminModal from '../components/AddAdminModal';
import TransferAdminModal from '../components/TransferAdminModal';
import RolePermissions from '../components/RolePermissions';
import { mockAdmins as initialAdmins } from '../data/mockData';

const AdminManagementPage = () => {
  const [admins, setAdmins] = useState(() => {
    try {
      const stored = localStorage.getItem('nb-portfolio-admins');
      return stored ? JSON.parse(stored) : initialAdmins;
    } catch {
      return initialAdmins;
    }
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/admins`);
      if (response.ok) {
        const data = await response.json();
        setAdmins(data);
        localStorage.setItem('nb-portfolio-admins', JSON.stringify(data));
      }
    } catch (err) {
      console.warn("Backend offline, using cached admin list:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const saveAdmins = (list) => {
    setAdmins(list);
    try {
      localStorage.setItem('nb-portfolio-admins', JSON.stringify(list));
    } catch (e) {
      console.error("Failed to save admins to localStorage:", e);
    }
  };

  const filteredAdmins = admins.filter(admin => {
    const name = admin.name || '';
    const email = admin.email || '';
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || admin.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const logNotification = (type, title, message) => {
    try {
      const stored = localStorage.getItem('nb-portfolio-notifications');
      const list = stored ? JSON.parse(stored) : [];
      list.unshift({
        id: Date.now() + Math.random(),
        type,
        title,
        message,
        time: new Date().toISOString(),
        read: false
      });
      localStorage.setItem('nb-portfolio-notifications', JSON.stringify(list));
      window.dispatchEvent(new Event('nb-notifications-updated'));
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddAdmin = async (formData) => {
    const nextId = admins.length > 0 ? Math.max(...admins.map(a => a.id)) + 1 : 1;
    const newAdminLocal = {
      id: nextId,
      ...formData,
      status: 'active',
      avatar: null,
      lastLogin: new Date().toISOString(),
      joinedAt: new Date().toISOString(),
      phone: '',
      bio: '',
    };
    saveAdmins([...admins, newAdminLocal]);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/admins`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, password: 'admin123' })
      });
      if (response.ok) {
        const resData = await response.json();
        if (resData.success && resData.admin) {
          setAdmins(prev => prev.map(a => a.id === nextId ? resData.admin : a));
        }
      }
    } catch (err) {
      console.warn("Backend offline, changes saved locally:", err);
    }

    logNotification('success', 'New admin added', `${formData.name} registered as ${formData.role}`);
  };

  const handleEditAdmin = async (formData) => {
    const updated = admins.map(a =>
      a.id === editingAdmin.id ? { ...a, ...formData } : a
    );
    saveAdmins(updated);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await fetch(`${apiUrl}/api/admins/${editingAdmin.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
    } catch (err) {
      console.warn("Backend offline, changes saved locally:", err);
    }

    logNotification('info', 'Admin updated', `Profile details for ${formData.name} were updated`);
    setEditingAdmin(null);
  };

  const handleDeleteAdmin = async (id) => {
    const target = admins.find(a => a.id === id);
    const name = target ? target.name : `ID: ${id}`;
    const updated = admins.filter(a => a.id !== id);
    saveAdmins(updated);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await fetch(`${apiUrl}/api/admins/${id}`, {
        method: 'DELETE'
      });
    } catch (err) {
      console.warn("Backend offline, deleted locally only:", err);
    }

    logNotification('warning', 'Admin deleted', `${name} was removed from the system`);
    setDeleteConfirm(null);
  };

  const handleToggleStatus = async (id) => {
    const target = admins.find(a => a.id === id);
    if (!target) return;
    const newStatus = target.status === 'active' ? 'inactive' : 'active';
    const updated = admins.map(a =>
      a.id === id ? { ...a, status: newStatus } : a
    );
    saveAdmins(updated);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await fetch(`${apiUrl}/api/admins/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
    } catch (err) {
      console.warn("Backend offline, status toggled locally:", err);
    }

    logNotification(
      newStatus === 'active' ? 'success' : 'warning',
      newStatus === 'active' ? 'Admin activated' : 'Admin suspended',
      `${target.name} has been ${newStatus}`
    );
  };

  const handleTransfer = async (sourceId, targetId) => {
    const source = admins.find(a => a.id === sourceId);
    const target = admins.find(a => a.id === targetId);
    if (!source || !target) return;

    const updated = admins.map(a => {
      if (a.id === sourceId) return { ...a, role: 'Viewer', permissions: ['analytics'] };
      if (a.id === targetId) return { ...a, role: source.role, permissions: [...(source.permissions || [])] };
      return a;
    });
    saveAdmins(updated);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await fetch(`${apiUrl}/api/admins/${sourceId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'Viewer', permissions: ['analytics'] })
      });
      await fetch(`${apiUrl}/api/admins/${targetId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: source.role, permissions: source.permissions })
      });
    } catch (err) {
      console.warn("Backend offline, transfer performed locally:", err);
    }

    logNotification(
      'info',
      'Rights transferred',
      `Admin rights transferred from ${source.name} to ${target.name}`
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="font-heading font-bold text-2xl text-white">Admin Management</h1>
          <p className="text-sm text-slate-500 mt-1">{admins.length} admins registered · {admins.filter(a => a.status === 'active').length} active</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTransferModalOpen(true)}
            className="px-4 py-2.5 rounded-xl text-sm font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition-all flex items-center gap-2"
          >
            <ArrowRightLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Transfer</span>
          </button>
          <button
            onClick={() => { setEditingAdmin(null); setAddModalOpen(true); }}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-500 hover:bg-indigo-400 shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Admin</span>
          </button>
        </div>
      </motion.div>

      {/* Search & Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full h-10 bg-white/[0.04] border border-white/[0.08] rounded-xl pl-10 pr-4 text-sm text-white placeholder-slate-600 outline-none focus:border-indigo-500/50 transition-colors"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <select
            value={filterRole}
            onChange={e => setFilterRole(e.target.value)}
            className="h-10 bg-white/[0.04] border border-white/[0.08] rounded-xl pl-10 pr-8 text-sm text-white outline-none focus:border-indigo-500/50 transition-colors appearance-none cursor-pointer"
          >
            <option value="all" className="bg-slate-900">All Roles</option>
            <option value="Super Admin" className="bg-slate-900">Super Admin</option>
            <option value="Manager" className="bg-slate-900">Manager</option>
            <option value="Editor" className="bg-slate-900">Editor</option>
            <option value="Viewer" className="bg-slate-900">Viewer</option>
          </select>
        </div>
      </motion.div>

      {/* Admin Table */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative rounded-2xl overflow-hidden
          bg-gradient-to-br from-white/[0.06] to-white/[0.02]
          border border-white/[0.08]
          backdrop-blur-xl
          shadow-[0_4px_6px_rgba(0,0,0,0.07),0_10px_20px_rgba(0,0,0,0.06)]"
      >
        <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {filteredAdmins.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-slate-400 font-medium">No admins found</p>
            <p className="text-sm text-slate-600 mt-1">Try adjusting your search or filter</p>
          </div>
        ) : (
          <AdminTable
            admins={filteredAdmins}
            onEdit={(admin) => { setEditingAdmin(admin); setAddModalOpen(true); }}
            onDelete={(id) => setDeleteConfirm(id)}
            onToggleStatus={handleToggleStatus}
          />
        )}
      </motion.div>

      {/* Role Permissions Matrix */}
      <RolePermissions />

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-sm bg-slate-900/95 backdrop-blur-2xl border border-white/[0.08] rounded-2xl shadow-2xl p-6 space-y-4"
          >
            <h3 className="font-heading font-semibold text-white text-lg">Delete Admin?</h3>
            <p className="text-sm text-slate-400">This action cannot be undone. The admin will lose all access immediately.</p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 rounded-xl text-sm text-slate-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteAdmin(deleteConfirm)}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-rose-500 hover:bg-rose-400 shadow-lg shadow-rose-500/20 transition-all"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modals */}
      <AddAdminModal
        isOpen={addModalOpen}
        onClose={() => { setAddModalOpen(false); setEditingAdmin(null); }}
        onSubmit={editingAdmin ? handleEditAdmin : handleAddAdmin}
        editAdmin={editingAdmin}
      />
      <TransferAdminModal
        isOpen={transferModalOpen}
        onClose={() => setTransferModalOpen(false)}
        admins={admins}
        onTransfer={handleTransfer}
      />
    </div>
  );
};

export default AdminManagementPage;
