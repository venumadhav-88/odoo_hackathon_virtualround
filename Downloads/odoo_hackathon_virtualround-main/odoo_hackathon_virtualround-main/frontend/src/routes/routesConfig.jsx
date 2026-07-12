import React from 'react';
import { ROUTES } from '@/constants/routes';
import MainLayout from '@/layouts/MainLayout';
import Login from '@/pages/Auth/Login';
import ForgotPassword from '@/pages/Auth/ForgotPassword';
import ResetPassword from '@/pages/Auth/ResetPassword';
import NotFound from '@/pages/Auth/NotFound';
import Dashboard from '@/pages/Dashboard/Dashboard';
import Assets from '@/pages/Assets/Assets';
import Categories from '@/pages/Categories/Categories';
import Vendors from '@/pages/Vendors';
import Employees from '@/pages/Employees/Employees';
import Assignments from '@/pages/Assignments/Assignments';
import Maintenance from '@/pages/Maintenance/Maintenance';
import Settings from '@/pages/Settings/Settings';
import Reports from '@/pages/Reports/Reports';
import { 
  LayoutDashboard, 
  Package, 
  FolderTree, 
  Building2,
  Users, 
  ClipboardList, 
  Wrench, 
  Settings as SettingsIcon,
  BarChart3
} from 'lucide-react';

/**
 * Global Routing Table.
 * Configures pathways and attaches security requirements, titles, and icons metadata to routes.
 */
export const routesConfig = [
  {
    path: ROUTES.LOGIN,
    element: <Login />,
    meta: {
      title: 'Sign In',
      breadcrumb: 'Sign In',
      requiresAuth: false,
      permission: null,
      icon: null,
      showInSidebar: false,
      order: 0,
    },
  },
  {
    path: ROUTES.FORGOT_PASSWORD,
    element: <ForgotPassword />,
    meta: {
      title: 'Forgot Password',
      breadcrumb: 'Forgot Password',
      requiresAuth: false,
      permission: null,
      icon: null,
      showInSidebar: false,
      order: 0,
    },
  },
  {
    path: ROUTES.RESET_PASSWORD,
    element: <ResetPassword />,
    meta: {
      title: 'Reset Password',
      breadcrumb: 'Reset Password',
      requiresAuth: false,
      permission: null,
      icon: null,
      showInSidebar: false,
      order: 0,
    },
  },
  {
    path: ROUTES.DASHBOARD,
    element: <MainLayout />,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        index: true,
        element: <Dashboard />,
        meta: {
          title: 'Dashboard',
          breadcrumb: 'Dashboard',
          requiresAuth: true,
          permission: null,
          icon: LayoutDashboard,
          showInSidebar: true,
          order: 1,
        },
      },
      {
        path: ROUTES.ASSETS.replace(/^\//, ''),
        element: <Assets />,
        meta: {
          title: 'Asset Inventory',
          breadcrumb: 'Assets',
          requiresAuth: true,
          permission: null,
          icon: Package,
          showInSidebar: true,
          order: 2,
        },
      },
      {
        path: ROUTES.CATEGORIES.replace(/^\//, ''),
        element: <Categories />,
        meta: {
          title: 'Asset Categories',
          breadcrumb: 'Categories',
          requiresAuth: true,
          permission: null,
          icon: FolderTree,
          showInSidebar: true,
          order: 3,
        },
      },
      {
        path: ROUTES.VENDORS.replace(/^\//, ''),
        element: <Vendors />,
        meta: {
          title: 'Vendor Management',
          breadcrumb: 'Vendors',
          requiresAuth: true,
          permission: null,
          icon: Building2,
          showInSidebar: true,
          order: 4,
        },
      },
      {
        path: ROUTES.EMPLOYEES.replace(/^\//, ''),
        element: <Employees />,
        meta: {
          title: 'Employees Directory',
          breadcrumb: 'Employees',
          requiresAuth: true,
          permission: null,
          icon: Users,
          showInSidebar: true,
          order: 5,
        },
      },
      {
        path: ROUTES.ASSIGNMENTS.replace(/^\//, ''),
        element: <Assignments />,
        meta: {
          title: 'Asset Assignments',
          breadcrumb: 'Assignments',
          requiresAuth: true,
          permission: null,
          icon: ClipboardList,
          showInSidebar: true,
          order: 6,
        },
      },
      {
        path: ROUTES.MAINTENANCE.replace(/^\//, ''),
        element: <Maintenance />,
        meta: {
          title: 'Maintenance Scheduling',
          breadcrumb: 'Maintenance',
          requiresAuth: true,
          permission: null,
          icon: Wrench,
          showInSidebar: true,
          order: 7,
        },
      },
      {
        path: ROUTES.SETTINGS.replace(/^\//, ''),
        element: <Settings />,
        meta: {
          title: 'System Settings',
          breadcrumb: 'Settings',
          requiresAuth: true,
          permission: null,
          icon: SettingsIcon,
          showInSidebar: true,
          order: 8,
        },
      },
      {
        path: ROUTES.REPORTS.replace(/^\//, ''),
        element: <Reports />,
        meta: {
          title: 'Reports & Analytics',
          breadcrumb: 'Reports',
          requiresAuth: true,
          permission: null,
          icon: BarChart3,
          showInSidebar: true,
          order: 9,
        },
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
];
