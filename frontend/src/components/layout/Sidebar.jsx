import React from 'react';
import { NavLink } from 'react-router-dom';
import { LogOut, Shield, ChevronLeft, ChevronRight } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { navigationConfig } from '@/config/navigation';

/**
 * Sidebar Component.
 * Responsive collapsible navigation sidebar rendering links dynamically from central config.
 * @param {Object} props - Properties.
 * @param {boolean} props.isCollapsed - Desktop collapsed flag.
 * @param {Function} props.onToggle - Toggles sidebar collapse state.
 * @param {boolean} props.mobileOpen - Mobile overlay state flag.
 * @returns {JSX.Element} Sidebar layout.
 */
export const Sidebar = ({ isCollapsed, onToggle, mobileOpen }) => {
  const visibleNavItems = [...navigationConfig]
    .filter((item) => item.showInSidebar)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <Shield className="sidebar-logo" size={24} />
          <span className="sidebar-brand-text">AssetGuard</span>
        </div>
        <button 
          className="sidebar-toggle-btn" 
          onClick={onToggle}
          aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="sidebar-nav">
        {visibleNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) => 
                `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
              }
            >
              <Icon className="sidebar-icon" size={20} />
              <span className="sidebar-link-text">{item.title}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <NavLink 
          to={ROUTES.LOGIN} 
          className="sidebar-link logout-btn"
        >
          <LogOut className="sidebar-icon" size={20} />
          <span className="sidebar-link-text">Sign Out</span>
        </NavLink>
      </div>
    </aside>
  );
};
