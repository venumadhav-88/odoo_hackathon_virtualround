/**
 * Initial mock application preferences and administration details.
 */
export const MOCK_SETTINGS = {
  profile: {
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&h=128&fit=crop&crop=face',
    name: 'Alex Carter',
    email: 'alex.carter@enterprise.com',
    role: 'Lead Systems Administrator',
    department: 'Information Technology',
    employeeId: 'EMP-2026-089',
    phone: '+1 (555) 019-2834',
  },
  general: {
    language: 'English',
    timezone: 'UTC-5 (EST)',
    dateFormat: 'YYYY-MM-DD',
    currency: 'USD',
    itemsPerPage: 10,
  },
  notifications: {
    emailNotifications: true,
    browserNotifications: false,
    assignmentAlerts: true,
    maintenanceAlerts: true,
    systemAnnouncements: false,
  },
  security: {
    twoFactorAuth: false,
    sessionTimeout: 30, // in minutes
    lastLogin: '2026-07-12 12:45:10',
    activeSessions: [
      { id: 'sess-1', device: 'Chrome / Windows 11', location: 'New York, USA', status: 'Active (Current)' },
      { id: 'sess-2', device: 'Safari / iPhone 15', location: 'London, UK', status: 'Active' },
    ],
    loginHistory: [
      { timestamp: '2026-07-12 12:45:10', status: 'Success', ip: '192.168.1.45', device: 'Chrome / Windows' },
      { timestamp: '2026-07-11 09:12:04', status: 'Success', ip: '192.168.1.45', device: 'Chrome / Windows' },
      { timestamp: '2026-07-10 18:34:55', status: 'Success', ip: '82.165.10.12', device: 'Safari / iPhone' },
    ],
  },
  systemInfo: {
    appName: 'Shaunt Enterprise',
    appVersion: 'v2.4.1',
    frontendVersion: 'v2.4.1-build88',
    apiVersion: 'v2.0.0-mock',
    environment: 'Staging / Local Simulation',
    buildDate: '2026-07-01',
    developer: 'Shaunt Frontend Team',
    license: 'Commercial Enterprise License',
  },
  about: {
    description: 'Shaunt system orchestrating full lifecycle asset tracking, assignment custody workflows, maintenance scheduling, and analytical executive audits.',
    techStack: ['React 18', 'Vite 8', 'ESLint + Oxlint', 'Lucide React', 'CSS Variables'],
    copyright: '© 2026 Shaunt Inc. All rights reserved.',
  },
};
