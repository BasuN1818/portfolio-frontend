import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Users, ShieldCheck, Activity, DollarSign } from 'lucide-react';
import StatCard from '../components/StatCard';
import ChartCard from '../components/ChartCard';
import ActivityFeed from '../components/ActivityFeed';
import { mockAdmins, mockStats, mockActivityChartData, mockRevenueData, mockActivityFeed } from '../data/mockData';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900/95 backdrop-blur-xl border border-white/[0.1] rounded-xl px-4 py-3 shadow-2xl">
      <p className="text-xs font-mono text-slate-400 mb-1.5">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-sm font-semibold" style={{ color: entry.color }}>
          {entry.name}: {entry.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
};

const DashboardPage = () => {
  const [adminsCount, setAdminsCount] = useState(mockStats.totalAdmins);
  const [messagesCount, setMessagesCount] = useState(0);
  const [sessionsCount, setSessionsCount] = useState(mockStats.activeSessions);
  const [activities, setActivities] = useState(mockActivityFeed);

  useEffect(() => {
    // Get live admins count
    const fetchAdminCount = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await fetch(`${apiUrl}/api/admins`);
        if (response.ok) {
          const data = await response.json();
          setAdminsCount(data.length);
        } else {
          // Local storage fallback
          const storedAdmins = localStorage.getItem('nb-portfolio-admins');
          if (storedAdmins) {
            setAdminsCount(JSON.parse(storedAdmins).length);
          }
        }
      } catch (err) {
        // Local storage fallback
        const storedAdmins = localStorage.getItem('nb-portfolio-admins');
        if (storedAdmins) {
          setAdminsCount(JSON.parse(storedAdmins).length);
        }
      }
    };
    
    fetchAdminCount();

    // Get live messages count
    try {
      const storedContacts = localStorage.getItem('nb-portfolio-contacts');
      if (storedContacts) {
        setMessagesCount(JSON.parse(storedContacts).length);
      }
    } catch (e) {}

    // Get live devices count as active sessions
    try {
      const storedDevices = localStorage.getItem('nb-portfolio-devices');
      if (storedDevices) {
        setSessionsCount(JSON.parse(storedDevices).length);
      }
    } catch (e) {}

    // Get live activities
    try {
      const storedActivity = localStorage.getItem('nb-portfolio-activity');
      if (storedActivity) {
        setActivities(JSON.parse(storedActivity));
      } else {
        localStorage.setItem('nb-portfolio-activity', JSON.stringify(mockActivityFeed));
      }
    } catch (e) {}
  }, []);

  const stats = [
    {
      icon: Users, label: 'Total Users', value: mockStats.totalUsers + messagesCount,
      trend: mockStats.usersTrend, trendLabel: 'vs last month',
      accentColor: '#6366f1',
    },
    {
      icon: ShieldCheck, label: 'Total Admins', value: adminsCount,
      trend: 0, trendLabel: 'Live database count',
      accentColor: '#3b82f6',
    },
    {
      icon: Activity, label: 'Active Sessions', value: sessionsCount,
      trend: mockStats.sessionsTrend, trendLabel: 'Active devices count',
      accentColor: '#10b981',
    },
    {
      icon: DollarSign, label: 'Contact Messages', value: messagesCount,
      trend: messagesCount > 0 ? 100 : 0, trendLabel: 'Real submissions',
      accentColor: '#f59e0b',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="font-heading font-bold text-2xl text-white">Dashboard Overview</h1>
        <p className="text-sm text-slate-500 mt-1">Welcome back, Basanagoud. Here's what's happening today.</p>
      </motion.div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <StatCard key={stat.label} {...stat} delay={i * 0.1} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* User Activity Chart */}
        <ChartCard
          title="User Activity"
          subtitle="Last 7 days"
          delay={0.4}
          className="lg:col-span-2"
        >
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={mockActivityChartData}>
              <defs>
                <linearGradient id="gradientUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradientSessions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis
                dataKey="name"
                stroke="rgba(255,255,255,0.2)"
                tick={{ fontSize: 11, fill: '#64748b', fontFamily: 'JetBrains Mono' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                stroke="rgba(255,255,255,0.2)"
                tick={{ fontSize: 11, fill: '#64748b', fontFamily: 'JetBrains Mono' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="users"
                stroke="#6366f1"
                strokeWidth={2.5}
                fill="url(#gradientUsers)"
                name="Users"
                dot={false}
                activeDot={{ r: 5, stroke: '#6366f1', strokeWidth: 2, fill: '#1e1b4b' }}
              />
              <Area
                type="monotone"
                dataKey="sessions"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#gradientSessions)"
                name="Sessions"
                dot={false}
                activeDot={{ r: 4, stroke: '#10b981', strokeWidth: 2, fill: '#064e3b' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Revenue Chart */}
        <ChartCard
          title="Revenue"
          subtitle="Monthly breakdown"
          delay={0.5}
        >
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={mockRevenueData}>
              <defs>
                <linearGradient id="gradientRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.3} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis
                dataKey="month"
                stroke="rgba(255,255,255,0.2)"
                tick={{ fontSize: 11, fill: '#64748b', fontFamily: 'JetBrains Mono' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                stroke="rgba(255,255,255,0.2)"
                tick={{ fontSize: 11, fill: '#64748b', fontFamily: 'JetBrains Mono' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="revenue"
                fill="url(#gradientRevenue)"
                radius={[6, 6, 0, 0]}
                name="Revenue"
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Activity Feed */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
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
            <h3 className="font-heading font-semibold text-white text-base">Recent Activity</h3>
            <p className="text-xs text-slate-500 font-mono mt-0.5">Latest actions across the platform</p>
          </div>
          <span className="text-xs text-slate-600 font-mono">{activities.length} events</span>
        </div>
        <ActivityFeed activities={activities} maxItems={10} />
      </motion.div>
    </div>
  );
};

export default DashboardPage;
