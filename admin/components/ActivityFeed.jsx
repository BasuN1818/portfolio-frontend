import React from 'react';
import { motion } from 'framer-motion';
import {
  Settings as SettingsIcon,
  FileText,
  Users,
  Cpu,
  BarChart3,
  ShieldAlert,
} from 'lucide-react';

const typeConfig = {
  settings: { icon: SettingsIcon, color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
  content: { icon: FileText, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
  users: { icon: Users, color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
  system: { icon: Cpu, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
  analytics: { icon: BarChart3, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  security: { icon: ShieldAlert, color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
};

const timeAgo = (timestamp) => {
  const diff = Date.now() - new Date(timestamp).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

const ActivityFeed = ({ activities = [], maxItems = 10 }) => {
  const items = activities.slice(0, maxItems);

  return (
    <div className="space-y-1">
      {items.map((activity, index) => {
        const config = typeConfig[activity.type] || typeConfig.system;
        const Icon = config.icon;

        return (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05, ease: 'easeOut' }}
            className="flex items-start gap-3 px-3 py-3 rounded-xl hover:bg-white/[0.03] transition-colors group"
          >
            {/* Timeline dot & line */}
            <div className="relative flex flex-col items-center shrink-0">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
                style={{ backgroundColor: config.bg }}
              >
                <Icon className="w-4 h-4" style={{ color: config.color }} />
              </div>
              {index < items.length - 1 && (
                <div className="w-px h-full bg-white/[0.06] absolute top-9 left-1/2 -translate-x-1/2" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pt-0.5">
              <p className="text-sm text-slate-300 leading-snug">
                <span className="font-medium text-white">{activity.user}</span>
                {' '}{activity.action}
              </p>
              <p className="text-[11px] text-slate-600 font-mono mt-1">
                {timeAgo(activity.timestamp)}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ActivityFeed;
