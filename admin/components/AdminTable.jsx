import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit3, Trash2, Ban, CheckCircle, MoreVertical, Shield, Eye } from 'lucide-react';

const roleBadgeColors = {
  'Super Admin': { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/20' },
  'Manager': { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
  'Editor': { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
  'Viewer': { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/20' },
};

const AdminTable = ({ admins, onEdit, onDelete, onToggleStatus }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/[0.06]">
            <th className="text-left py-3 px-4 text-[11px] font-mono uppercase tracking-wider text-slate-500 font-medium">Admin</th>
            <th className="text-left py-3 px-4 text-[11px] font-mono uppercase tracking-wider text-slate-500 font-medium">Role</th>
            <th className="text-left py-3 px-4 text-[11px] font-mono uppercase tracking-wider text-slate-500 font-medium">Status</th>
            <th className="text-left py-3 px-4 text-[11px] font-mono uppercase tracking-wider text-slate-500 font-medium hidden lg:table-cell">Last Login</th>
            <th className="text-left py-3 px-4 text-[11px] font-mono uppercase tracking-wider text-slate-500 font-medium hidden md:table-cell">Permissions</th>
            <th className="text-right py-3 px-4 text-[11px] font-mono uppercase tracking-wider text-slate-500 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin, index) => {
            const roleColor = roleBadgeColors[admin.role] || roleBadgeColors['Viewer'];
            const initials = admin.name.split(' ').map(n => n[0]).join('').substring(0, 2);

            return (
              <motion.tr
                key={admin.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.04 }}
                className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors group"
              >
                {/* Admin info */}
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/[0.08] flex items-center justify-center text-xs font-bold text-indigo-300 shrink-0">
                      {initials}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{admin.name}</p>
                      <p className="text-xs text-slate-500">{admin.email}</p>
                    </div>
                  </div>
                </td>

                {/* Role */}
                <td className="py-4 px-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${roleColor.bg} ${roleColor.text} ${roleColor.border}`}>
                    {admin.role === 'Super Admin' && <Shield className="w-3 h-3" />}
                    {admin.role === 'Viewer' && <Eye className="w-3 h-3" />}
                    {admin.role}
                  </span>
                </td>

                {/* Status */}
                <td className="py-4 px-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium
                    ${admin.status === 'active'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                    }
                  `}>
                    <span className={`w-1.5 h-1.5 rounded-full ${admin.status === 'active' ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                    {admin.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </td>

                {/* Last Login */}
                <td className="py-4 px-4 hidden lg:table-cell">
                  <p className="text-xs text-slate-400 font-mono">
                    {new Date(admin.lastLogin).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                  <p className="text-[10px] text-slate-600 font-mono">
                    {new Date(admin.lastLogin).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </td>

                {/* Permissions */}
                <td className="py-4 px-4 hidden md:table-cell">
                  <div className="flex gap-1 flex-wrap">
                    {(admin.permissions || []).slice(0, 3).map(perm => (
                      <span key={perm} className="px-2 py-0.5 bg-white/[0.04] rounded text-[10px] text-slate-400 border border-white/[0.06]">
                        {perm}
                      </span>
                    ))}
                    {(admin.permissions || []).length > 3 && (
                      <span className="px-2 py-0.5 bg-white/[0.04] rounded text-[10px] text-slate-500">
                        +{(admin.permissions || []).length - 3}
                      </span>
                    )}
                  </div>
                </td>

                {/* Actions */}
                <td className="py-4 px-4">
                  <div className="flex items-center justify-end gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEdit(admin)}
                      className="w-8 h-8 rounded-lg hover:bg-indigo-500/10 flex items-center justify-center text-slate-400 hover:text-indigo-400 transition-all"
                      title="Edit"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onToggleStatus(admin.id)}
                      className="w-8 h-8 rounded-lg hover:bg-amber-500/10 flex items-center justify-center text-slate-400 hover:text-amber-400 transition-all"
                      title={admin.status === 'active' ? 'Suspend' : 'Activate'}
                    >
                      {admin.status === 'active' ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => onDelete(admin.id)}
                      className="w-8 h-8 rounded-lg hover:bg-rose-500/10 flex items-center justify-center text-slate-400 hover:text-rose-400 transition-all"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AdminTable;
