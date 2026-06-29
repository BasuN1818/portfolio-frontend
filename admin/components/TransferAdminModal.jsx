import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRightLeft, UserCheck, ChevronDown } from 'lucide-react';

const TransferAdminModal = ({ isOpen, onClose, admins, onTransfer }) => {
  const [sourceId, setSourceId] = useState('');
  const [targetId, setTargetId] = useState('');
  const [step, setStep] = useState(1);

  const sourceAdmin = admins.find(a => a.id === Number(sourceId));
  const targetAdmin = admins.find(a => a.id === Number(targetId));

  const handleTransfer = () => {
    if (sourceAdmin && targetAdmin) {
      onTransfer(sourceAdmin.id, targetAdmin.id);
      setStep(1);
      setSourceId('');
      setTargetId('');
      onClose();
    }
  };

  const handleClose = () => {
    setStep(1);
    setSourceId('');
    setTargetId('');
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
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="w-full max-w-md bg-slate-900/95 backdrop-blur-2xl border border-white/[0.08] rounded-2xl shadow-[0_25px_50px_rgba(0,0,0,0.5)] overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <ArrowRightLeft className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h2 className="font-heading font-semibold text-white">Transfer Admin Rights</h2>
                  <p className="text-xs text-slate-500">Reassign admin role to another user</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-lg hover:bg-white/[0.06] flex items-center justify-center text-slate-400 hover:text-white transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {step === 1 && (
                <>
                  {/* Source admin */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Transfer from (Source Admin)
                    </label>
                    <select
                      value={sourceId}
                      onChange={e => setSourceId(e.target.value)}
                      className="w-full h-10 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 text-sm text-white outline-none focus:border-amber-500/50 transition-colors appearance-none cursor-pointer"
                    >
                      <option value="" className="bg-slate-900">Select source admin...</option>
                      {admins.filter(a => a.role !== 'Viewer').map(admin => (
                        <option key={admin.id} value={admin.id} className="bg-slate-900">
                          {admin.name} ({admin.role})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Arrow icon */}
                  <div className="flex justify-center">
                    <div className="w-10 h-10 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
                      <ChevronDown className="w-5 h-5 text-amber-400" />
                    </div>
                  </div>

                  {/* Target admin */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Transfer to (Target User)
                    </label>
                    <select
                      value={targetId}
                      onChange={e => setTargetId(e.target.value)}
                      className="w-full h-10 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 text-sm text-white outline-none focus:border-amber-500/50 transition-colors appearance-none cursor-pointer"
                    >
                      <option value="" className="bg-slate-900">Select target user...</option>
                      {admins.filter(a => a.id !== Number(sourceId)).map(admin => (
                        <option key={admin.id} value={admin.id} className="bg-slate-900">
                          {admin.name} ({admin.role})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={!sourceId || !targetId}
                      onClick={() => setStep(2)}
                      className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-amber-500 hover:bg-amber-400 shadow-lg shadow-amber-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      Continue
                    </button>
                  </div>
                </>
              )}

              {step === 2 && sourceAdmin && targetAdmin && (
                <>
                  {/* Confirmation */}
                  <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 space-y-3">
                    <div className="flex items-center gap-2 text-amber-400">
                      <UserCheck className="w-4 h-4" />
                      <p className="text-sm font-semibold">Confirm Transfer</p>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      Transfer <strong className="text-white">{sourceAdmin.role}</strong> rights from{' '}
                      <strong className="text-white">{sourceAdmin.name}</strong> to{' '}
                      <strong className="text-white">{targetAdmin.name}</strong>?
                    </p>
                    <p className="text-xs text-slate-500">
                      {sourceAdmin.name} will be set to Viewer role. This action can be reversed.
                    </p>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] transition-all"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleTransfer}
                      className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-amber-500 hover:bg-amber-400 shadow-lg shadow-amber-500/20 transition-all"
                    >
                      Confirm Transfer
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TransferAdminModal;
