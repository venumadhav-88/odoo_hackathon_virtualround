import React from 'react';
import { User, Settings, Palette, Bell, Shield, Info, HelpCircle } from 'lucide-react';

/**
 * SettingsSidebar Component.
 * Left-side navigation bar allowing tabs selections.
 * @param {Object} props
 */
export const SettingsSidebar = ({ activeSection, onSelectSection }) => {
  const sections = [
    { id: 'profile', label: 'Profile Card', icon: User },
    { id: 'account', label: 'General Preferences', icon: Settings },
    { id: 'appearance', label: 'Appearance Design', icon: Palette },
    { id: 'notifications', label: 'Notifications Alerts', icon: Bell },
    { id: 'security', label: 'Security & Access', icon: Shield },
    { id: 'system', label: 'System Information', icon: Info },
    { id: 'about', label: 'About EAM App', icon: HelpCircle },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem',
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '0.75rem',
        minWidth: '220px',
        height: 'fit-content',
      }}
    >
      {sections.map(({ id, label, icon: Icon }) => {
        const isActive = activeSection === id;
        return (
          <button
            key={id}
            onClick={() => onSelectSection(id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              width: '100%',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              backgroundColor: isActive ? 'var(--color-surface-hover)' : 'transparent',
              color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
              fontWeight: isActive ? 600 : 500,
              fontSize: '0.875rem',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <Icon size={18} style={{ color: isActive ? 'var(--color-primary)' : 'inherit' }} />
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
};
