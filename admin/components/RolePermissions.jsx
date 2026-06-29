import React from 'react';
import { motion } from 'framer-motion';
import { allPermissions, rolePermissionsMatrix } from '../data/mockData';

const roles = ['Super Admin', 'Manager', 'Editor', 'Viewer'];

const roleColors = {
  'Super Admin': '#6366f1',
  'Manager': '#3b82f6',
  'Editor': '#f59e0b',
  'Viewer': '#64748b',
};

const RolePermissions = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="relative rounded-2xl overflow-hidden
        bg-gradient-to-br from-white/[0.06] to-white/[0.02]
        border border-white/[0.08]
        backdrop-blur-xl
        shadow-[0_4px_6px_rgba(0,0,0,0.07),0_10px_20px_rgba(0,0,0,0.06)]
        p-6"
    >
      <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <h3 className="font-heading font-semibold text-white text-base mb-1">Role Permissions Matrix</h3>
      <p className="text-xs text-slate-500 font-mono mb-5">Permission access by role level</p>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="text-left py-3 px-4 text-[11px] font-mono uppercase tracking-wider text-slate-500">Permission</th>
              {roles.map(role => (
                <th key={role} className="text-center py-3 px-4 text-[11px] font-mono uppercase tracking-wider" style={{ color: roleColors[role] }}>
                  {role}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allPermissions.map((perm, i) => (
              <tr key={perm.key} className="border-b border-white/[0.04] last:border-0">
                <td className="py-3 px-4">
                  <p className="text-sm text-white font-medium">{perm.label}</p>
                  <p className="text-[10px] text-slate-500">{perm.description}</p>
                </td>
                {roles.map(role => {
                  const hasPermission = rolePermissionsMatrix[role]?.includes(perm.key);
                  return (
                    <td key={role} className="text-center py-3 px-4">
                      <div className={`w-8 h-8 rounded-lg mx-auto flex items-center justify-center transition-all ${
                        hasPermission
                          ? 'bg-emerald-500/10 border border-emerald-500/20'
                          : 'bg-white/[0.02] border border-white/[0.06]'
                      }`}>
                        {hasPermission ? (
                          <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default RolePermissions;
