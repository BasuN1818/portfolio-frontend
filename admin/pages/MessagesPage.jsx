import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Trash2, Mail, Calendar, MessageSquare, RefreshCw, User } from 'lucide-react';
import Card3D from '../components/Card3D';

const MessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchMessages = async () => {
    setLoading(true);
    let localData = [];
    
    // Load from localStorage first
    try {
      const stored = localStorage.getItem('nb-portfolio-contacts');
      if (stored) {
        localData = JSON.parse(stored);
      }
    } catch (err) {
      console.error("Failed to parse local contacts:", err);
    }

    // Try backend fetch
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/contacts`);
      if (response.ok) {
        const backendData = await response.json();
        // Merge them, prioritizing backend data if there are duplicates by id
        const merged = [...backendData];
        localData.forEach(localItem => {
          if (!merged.some(item => item.id === localItem.id || (item.email === localItem.email && item.message === localItem.message))) {
            merged.push(localItem);
          }
        });
        setMessages(merged.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
        // Update local cache
        localStorage.setItem('nb-portfolio-contacts', JSON.stringify(merged));
      } else {
        setMessages(localData);
      }
    } catch (err) {
      console.warn("Backend offline, using localStorage data:", err);
      setMessages(localData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (id) => {
    // Delete locally
    const updatedMessages = messages.filter(m => m.id !== id);
    setMessages(updatedMessages);
    localStorage.setItem('nb-portfolio-contacts', JSON.stringify(updatedMessages));
    setDeleteConfirm(null);

    // Try delete on backend
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await fetch(`${apiUrl}/api/contacts/${id}`, {
        method: 'DELETE'
      });
    } catch (err) {
      console.warn("Backend offline, deleted locally only:", err);
    }

    // Log activity
    try {
      const activityStored = localStorage.getItem('nb-portfolio-activity');
      const activityList = activityStored ? JSON.parse(activityStored) : [];
      activityList.unshift({
        id: Date.now(),
        user: 'Basanagoud N.',
        action: `deleted contact message #${id}`,
        type: 'users',
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('nb-portfolio-activity', JSON.stringify(activityList));
    } catch (e) {}
  };

  const filteredMessages = messages.filter(msg =>
    (msg.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (msg.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (msg.message || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="font-heading font-bold text-2xl text-white">Contact Messages</h1>
          <p className="text-sm text-slate-500 mt-1">
            {messages.length} messages received · {filteredMessages.length} filtered
          </p>
        </div>
        <button
          onClick={fetchMessages}
          className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:text-white transition-all flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </motion.div>

      {/* Search Input */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative"
      >
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search by sender name, email, or message content..."
          className="w-full h-11 bg-white/[0.04] border border-white/[0.08] rounded-xl pl-11 pr-4 text-sm text-white placeholder-slate-600 outline-none focus:border-indigo-500/50 transition-colors"
        />
      </motion.div>

      {/* Messages Grid / Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-400 rounded-full animate-spin" />
          <p className="text-xs text-slate-500 font-mono">Loading real message data...</p>
        </div>
      ) : filteredMessages.length === 0 ? (
        <Card3D className="py-16 text-center">
          <MessageSquare className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 font-medium">No messages found</p>
          <p className="text-xs text-slate-600 mt-1">Try sending a message via the Contact Form first!</p>
        </Card3D>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredMessages.map((msg, index) => (
            <Card3D
              key={msg.id || index}
              delay={index * 0.05}
              hoverable={true}
              className="flex flex-col md:flex-row md:items-start justify-between gap-4 p-5"
            >
              <div className="space-y-3 flex-1">
                {/* Header info */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-white">
                    <User className="w-4 h-4 text-indigo-400 shrink-0" />
                    {msg.name}
                  </div>
                  <span className="text-slate-600 hidden sm:inline">|</span>
                  <a
                    href={`mailto:${msg.email}`}
                    className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-mono hover:underline"
                  >
                    <Mail className="w-3.5 h-3.5 shrink-0" />
                    {msg.email}
                  </a>
                  <span className="text-slate-600 hidden sm:inline">|</span>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
                    <Calendar className="w-3.5 h-3.5 shrink-0" />
                    {new Date(msg.created_at).toLocaleString()}
                  </div>
                </div>

                {/* Message text */}
                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap pl-6 border-l border-white/10">
                  {msg.message}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end shrink-0 pt-2 md:pt-0">
                <button
                  onClick={() => setDeleteConfirm(msg.id)}
                  className="w-9 h-9 rounded-xl hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 flex items-center justify-center text-slate-500 hover:text-rose-400 transition-all"
                  title="Delete Message"
                >
                  <Trash2 className="w-4.5 h-4.5" />
                </button>
              </div>
            </Card3D>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-sm bg-slate-900/95 backdrop-blur-2xl border border-white/[0.08] rounded-2xl shadow-2xl p-6 space-y-4"
          >
            <h3 className="font-heading font-semibold text-white text-lg">Delete Message?</h3>
            <p className="text-sm text-slate-400">
              This message will be removed from your logs permanently.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 rounded-xl text-sm text-slate-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-rose-500 hover:bg-rose-400 shadow-lg shadow-rose-500/20 transition-all"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default MessagesPage;
