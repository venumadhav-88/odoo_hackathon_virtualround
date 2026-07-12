export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },
  ASSETS: {
    BASE: '/assets',
    BY_ID: (id) => `/assets/${id}`,
  },
  EMPLOYEES: {
    BASE: '/employees',
    BY_ID: (id) => `/employees/${id}`,
  },
  CATEGORIES: {
    BASE: '/categories',
    BY_ID: (id) => `/categories/${id}`,
  },
  ASSIGNMENTS: {
    BASE: '/assignments',
    BY_ID: (id) => `/assignments/${id}`,
  },
  MAINTENANCE: {
    BASE: '/maintenance',
    BY_ID: (id) => `/maintenance/${id}`,
  },
};
