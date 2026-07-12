import { 
  LayoutDashboard, 
  Package, 
  FolderTree, 
  Users, 
  ClipboardList, 
  Wrench, 
  Settings,
  BarChart3
} from 'lucide-react';
import { ROUTES } from '@/constants/routes';

/**
 * Catalog of application navigation parameters.
 * Dictates sidebar lists, sorting order, guest restrictions, and permissions placeholders.
 */
export const navigationConfig = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    path: ROUTES.DASHBOARD,
    requiresAuth: true,
    permission: null,
    showInSidebar: true,
    order: 1,
  },
  {
    title: 'Assets',
    icon: Package,
    path: ROUTES.ASSETS,
    requiresAuth: true,
    permission: null,
    showInSidebar: true,
    order: 2,
  },
  {
    title: 'Categories',
    icon: FolderTree,
    path: ROUTES.CATEGORIES,
    requiresAuth: true,
    permission: null,
    showInSidebar: true,
    order: 3,
  },
  {
    title: 'Employees',
    icon: Users,
    path: ROUTES.EMPLOYEES,
    requiresAuth: true,
    permission: null,
    showInSidebar: true,
    order: 4,
  },
  {
    title: 'Assignments',
    icon: ClipboardList,
    path: ROUTES.ASSIGNMENTS,
    requiresAuth: true,
    permission: null,
    showInSidebar: true,
    order: 5,
  },
  {
    title: 'Maintenance',
    icon: Wrench,
    path: ROUTES.MAINTENANCE,
    requiresAuth: true,
    permission: null,
    showInSidebar: true,
    order: 6,
  },
  {
    title: 'Settings',
    icon: Settings,
    path: ROUTES.SETTINGS,
    requiresAuth: true,
    permission: null,
    showInSidebar: true,
    order: 7,
  },
  {
    title: 'Reports',
    icon: BarChart3,
    path: ROUTES.REPORTS,
    requiresAuth: true,
    permission: null,
    showInSidebar: true,
    order: 8,
  },
];
