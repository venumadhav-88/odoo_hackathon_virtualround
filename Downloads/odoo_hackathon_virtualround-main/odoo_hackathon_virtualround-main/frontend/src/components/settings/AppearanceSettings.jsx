import React, { useState } from 'react';
import { useTheme } from '@/hooks';

/**
 * AppearanceSettings Component.
 * Integrates light/dark mode selection toggles with global ThemeContext.
 * @param {Object} props
 */
export const AppearanceSettings = ({ onSave, isSaving }) => {
  const { theme, toggleTheme } = useTheme();

  const [sidebarMode, setSidebarMode] = useState('Expanded');
  const [density, setDensity] = useState('Comfortable');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      sidebarMode,
      density,
    });
  };

  const handleThemeChange = (newTheme) => {
    if (newTheme !== theme) {
      toggleTheme();
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="asset-form-grid" style={{ marginBottom: '1.5rem' }}>
        {/* Theme select block */}
        <div className="form-group" style={{ gridColumn: 'span 2' }}>
          <label className="form-label">System Appearance Theme</label>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem' }}>
            {['light', 'dark'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => handleThemeChange(t)}
                style={{
                  flex: 1,
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  border: theme === t ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                  backgroundColor: theme === t ? 'var(--color-surface-hover)' : 'var(--color-surface)',
                  color: theme === t ? 'var(--color-primary)' : 'var(--color-text-muted)',
                  fontWeight: 600,
                  textTransform: 'capitalize',
                  fontSize: '0.8125rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {t} Mode
              </button>
            ))}
          </div>
        </div>

        {/* Sidebar layouts */}
        <div className="form-group">
          <label htmlFor="sidebarMode" className="form-label">Sidebar Default Layout</label>
          <select
            id="sidebarMode"
            value={sidebarMode}
            onChange={(e) => setSidebarMode(e.target.value)}
            className="filters-select form-input"
          >
            <option value="Expanded">Expanded</option>
            <option value="Collapsed">Collapsed</option>
          </select>
        </div>

        {/* Layout density */}
        <div className="form-group">
          <label htmlFor="density" className="form-label">Grid Layout Density</label>
          <select
            id="density"
            value={density}
            onChange={(e) => setDensity(e.target.value)}
            className="filters-select form-input"
          >
            <option value="Comfortable">Comfortable</option>
            <option value="Compact">Compact</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSaving}
        className="btn btn-primary"
        style={{ fontSize: '0.8125rem', padding: '0.5rem 1.25rem' }}
      >
        {isSaving ? 'Saving…' : 'Save Appearance Settings'}
      </button>
    </form>
  );
};
