// Mock data for the Admin Panel
// All data is realistic demo data — replace with API calls when backend is ready

export const mockAdmins = [
  {
    id: 1,
    name: 'Basanagoud N.',
    email: 'basanagoud@admin.com',
    phone: '+91 98765 43210',
    bio: 'Full-stack developer and system architect. Manages all platform operations.',
    role: 'Super Admin',
    status: 'active',
    avatar: null,
    permissions: ['users', 'content', 'settings', 'analytics', 'billing'],
    lastLogin: '2026-06-27T12:30:00Z',
    joinedAt: '2024-01-15T09:00:00Z',
  },
  {
    id: 2,
    name: 'Priya Sharma',
    email: 'priya.sharma@admin.com',
    phone: '+91 87654 32109',
    bio: 'Content strategist with 5+ years of digital marketing experience.',
    role: 'Manager',
    status: 'active',
    avatar: null,
    permissions: ['users', 'content', 'analytics'],
    lastLogin: '2026-06-27T10:15:00Z',
    joinedAt: '2024-03-20T09:00:00Z',
  },
  {
    id: 3,
    name: 'Rahul Verma',
    email: 'rahul.verma@admin.com',
    phone: '+91 76543 21098',
    bio: 'Frontend developer specializing in React and design systems.',
    role: 'Editor',
    status: 'active',
    avatar: null,
    permissions: ['content'],
    lastLogin: '2026-06-26T18:45:00Z',
    joinedAt: '2024-06-10T09:00:00Z',
  },
  {
    id: 4,
    name: 'Ananya Patel',
    email: 'ananya.patel@admin.com',
    phone: '+91 65432 10987',
    bio: 'Data analyst focused on user behavior and growth metrics.',
    role: 'Viewer',
    status: 'active',
    avatar: null,
    permissions: ['analytics'],
    lastLogin: '2026-06-25T14:20:00Z',
    joinedAt: '2024-09-01T09:00:00Z',
  },
  {
    id: 5,
    name: 'Vikram Singh',
    email: 'vikram.singh@admin.com',
    phone: '+91 54321 09876',
    bio: 'DevOps engineer managing infrastructure and deployments.',
    role: 'Manager',
    status: 'inactive',
    avatar: null,
    permissions: ['settings', 'analytics'],
    lastLogin: '2026-05-15T09:00:00Z',
    joinedAt: '2024-04-05T09:00:00Z',
  },
  {
    id: 6,
    name: 'Meera Kulkarni',
    email: 'meera.k@admin.com',
    phone: '+91 43210 98765',
    bio: 'UX researcher and product designer for customer-facing features.',
    role: 'Editor',
    status: 'active',
    avatar: null,
    permissions: ['content', 'analytics'],
    lastLogin: '2026-06-27T08:30:00Z',
    joinedAt: '2025-01-12T09:00:00Z',
  },
  {
    id: 7,
    name: 'Arjun Reddy',
    email: 'arjun.reddy@admin.com',
    phone: '+91 32109 87654',
    bio: 'Backend engineer working on API and database optimization.',
    role: 'Editor',
    status: 'active',
    avatar: null,
    permissions: ['content'],
    lastLogin: '2026-06-26T22:10:00Z',
    joinedAt: '2025-03-08T09:00:00Z',
  },
  {
    id: 8,
    name: 'Sneha Desai',
    email: 'sneha.desai@admin.com',
    phone: '+91 21098 76543',
    bio: 'Marketing lead managing campaigns and brand partnerships.',
    role: 'Viewer',
    status: 'inactive',
    avatar: null,
    permissions: ['analytics'],
    lastLogin: '2026-04-20T16:00:00Z',
    joinedAt: '2025-05-22T09:00:00Z',
  },
];

export const mockStats = {
  totalUsers: 12847,
  totalAdmins: 8,
  activeSessions: 342,
  revenue: 48250,
  usersTrend: 12.5,
  adminsTrend: 0,
  sessionsTrend: -3.2,
  revenueTrend: 8.7,
};

export const mockActivityChartData = [
  { name: 'Mon', users: 420, sessions: 280, revenue: 5200 },
  { name: 'Tue', users: 380, sessions: 310, revenue: 4800 },
  { name: 'Wed', users: 510, sessions: 360, revenue: 6100 },
  { name: 'Thu', users: 470, sessions: 290, revenue: 5600 },
  { name: 'Fri', users: 620, sessions: 410, revenue: 7200 },
  { name: 'Sat', users: 550, sessions: 380, revenue: 6800 },
  { name: 'Sun', users: 490, sessions: 340, revenue: 5900 },
];

export const mockRevenueData = [
  { month: 'Jan', revenue: 32000 },
  { month: 'Feb', revenue: 28500 },
  { month: 'Mar', revenue: 41000 },
  { month: 'Apr', revenue: 38200 },
  { month: 'May', revenue: 45600 },
  { month: 'Jun', revenue: 48250 },
];

export const mockActivityFeed = [
  { id: 1, user: 'Basanagoud N.', action: 'updated system settings', type: 'settings', timestamp: '2026-06-27T12:30:00Z' },
  { id: 2, user: 'Priya Sharma', action: 'added new blog post "Design Systems 101"', type: 'content', timestamp: '2026-06-27T11:45:00Z' },
  { id: 3, user: 'Rahul Verma', action: 'edited user permissions for Team Alpha', type: 'users', timestamp: '2026-06-27T10:20:00Z' },
  { id: 4, user: 'System', action: 'automated backup completed successfully', type: 'system', timestamp: '2026-06-27T09:00:00Z' },
  { id: 5, user: 'Ananya Patel', action: 'exported analytics report (Q2 2026)', type: 'analytics', timestamp: '2026-06-27T08:15:00Z' },
  { id: 6, user: 'Meera Kulkarni', action: 'uploaded 12 new design assets', type: 'content', timestamp: '2026-06-26T17:30:00Z' },
  { id: 7, user: 'Basanagoud N.', action: 'promoted Arjun Reddy to Editor role', type: 'users', timestamp: '2026-06-26T16:45:00Z' },
  { id: 8, user: 'Vikram Singh', action: 'deployed v2.4.1 to production', type: 'system', timestamp: '2026-06-26T15:00:00Z' },
  { id: 9, user: 'Priya Sharma', action: 'scheduled newsletter campaign', type: 'content', timestamp: '2026-06-26T14:20:00Z' },
  { id: 10, user: 'System', action: 'detected unusual login attempt — blocked', type: 'security', timestamp: '2026-06-26T13:10:00Z' },
  { id: 11, user: 'Arjun Reddy', action: 'optimized database queries (30% faster)', type: 'system', timestamp: '2026-06-26T11:00:00Z' },
  { id: 12, user: 'Sneha Desai', action: 'created new ad campaign "Summer Sale"', type: 'content', timestamp: '2026-06-26T09:30:00Z' },
  { id: 13, user: 'Basanagoud N.', action: 'updated security policy — enforced 2FA', type: 'security', timestamp: '2026-06-25T18:00:00Z' },
  { id: 14, user: 'Ananya Patel', action: 'generated monthly user growth report', type: 'analytics', timestamp: '2026-06-25T15:30:00Z' },
  { id: 15, user: 'Rahul Verma', action: 'fixed responsive layout issues on dashboard', type: 'system', timestamp: '2026-06-25T12:00:00Z' },
];

export const mockLoginHistory = [
  { id: 1, date: '2026-06-27T12:30:00Z', ip: '192.168.1.105', browser: 'Chrome 126', location: 'Bangalore, IN', status: 'success' },
  { id: 2, date: '2026-06-26T18:15:00Z', ip: '192.168.1.105', browser: 'Chrome 126', location: 'Bangalore, IN', status: 'success' },
  { id: 3, date: '2026-06-25T09:00:00Z', ip: '103.45.67.89', browser: 'Firefox 128', location: 'Mumbai, IN', status: 'success' },
  { id: 4, date: '2026-06-24T14:30:00Z', ip: '192.168.1.105', browser: 'Chrome 126', location: 'Bangalore, IN', status: 'success' },
  { id: 5, date: '2026-06-23T22:00:00Z', ip: '45.67.89.123', browser: 'Unknown', location: 'Unknown', status: 'failed' },
  { id: 6, date: '2026-06-22T10:45:00Z', ip: '192.168.1.105', browser: 'Chrome 126', location: 'Bangalore, IN', status: 'success' },
];

export const mockDevices = [
  { id: 1, name: 'Windows PC — Chrome', type: 'desktop', lastActive: '2026-06-27T12:30:00Z', current: true },
  { id: 2, name: 'iPhone 15 Pro — Safari', type: 'mobile', lastActive: '2026-06-26T20:00:00Z', current: false },
  { id: 3, name: 'MacBook Air — Firefox', type: 'laptop', lastActive: '2026-06-25T09:00:00Z', current: false },
  { id: 4, name: 'iPad Pro — Safari', type: 'tablet', lastActive: '2026-06-20T14:00:00Z', current: false },
];

export const mockSettings = {
  general: {
    siteName: 'AdminHub Pro',
    timezone: 'Asia/Kolkata',
    language: 'en',
    logo: null,
  },
  security: {
    minPasswordLength: 8,
    requireSpecialChars: true,
    passwordExpiry: 90,
    twoFactorEnabled: true,
    sessionTimeout: 30,
  },
  notifications: {
    emailAlerts: true,
    smsAlerts: false,
    loginAlerts: true,
    securityAlerts: true,
    updateAlerts: false,
    weeklyReport: true,
  },
  theme: {
    mode: 'dark',
    accentColor: 'indigo',
  },
};

export const rolePermissionsMatrix = {
  'Super Admin': ['users', 'content', 'settings', 'analytics', 'billing'],
  'Manager': ['users', 'content', 'analytics'],
  'Editor': ['content'],
  'Viewer': ['analytics'],
};

export const allPermissions = [
  { key: 'users', label: 'User Management', description: 'Create, edit, and delete users' },
  { key: 'content', label: 'Content Management', description: 'Create and publish content' },
  { key: 'settings', label: 'System Settings', description: 'Modify platform configuration' },
  { key: 'analytics', label: 'Analytics & Reports', description: 'View data and export reports' },
  { key: 'billing', label: 'Billing & Payments', description: 'Manage subscriptions and invoices' },
];
