import React, { useState } from 'react';

/**
 * NotificationSettings Component.
 * Checkbox toggles configuring notification targets (email, browser, system).
 * @param {Object} props
 */
export const NotificationSettings = ({ notifications = {}, onSave, isSaving }) => {
  const [emailNotifications, setEmailNotifications] = useState(!!notifications.emailNotifications);
  const [browserNotifications, setBrowserNotifications] = useState(!!notifications.browserNotifications);
  const [assignmentAlerts, setAssignmentAlerts] = useState(!!notifications.assignmentAlerts);
  const [maintenanceAlerts, setMaintenanceAlerts] = useState(!!notifications.maintenanceAlerts);
  const [systemAnnouncements, setSystemAnnouncements] = useState(!!notifications.systemAnnouncements);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      emailNotifications,
      browserNotifications,
      assignmentAlerts,
      maintenanceAlerts,
      systemAnnouncements,
    });
  };

  const notificationItems = [
    {
      id: 'email',
      label: 'Email Notifications',
      desc: 'Receive daily status digest and custody alerts.',
      state: emailNotifications,
      set: setEmailNotifications,
    },
    {
      id: 'browser',
      label: 'Browser Notifications',
      desc: 'Real-time alert bubbles inside application windows.',
      state: browserNotifications,
      set: setBrowserNotifications,
    },
    {
      id: 'assignment',
      label: 'Assignment Alerts',
      desc: 'Get notified when custody handovers or returns are logged.',
      state: assignmentAlerts,
      set: setAssignmentAlerts,
    },
    {
      id: 'maintenance',
      label: 'Maintenance Alerts',
      desc: 'Notifications on upcoming diagnostic checkups.',
      state: maintenanceAlerts,
      set: setMaintenanceAlerts,
    },
    {
      id: 'system',
      label: 'System Announcements',
      desc: 'Critical alerts detailing database upgrades.',
      state: systemAnnouncements,
      set: setSystemAnnouncements,
    },
  ];

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '1.5rem' }}>
        {notificationItems.map((item) => (
          <div key={item.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <input
              id={item.id}
              type="checkbox"
              checked={item.state}
              onChange={(e) => item.set(e.target.checked)}
              style={{ marginTop: '0.25rem', cursor: 'pointer', accentColor: 'var(--color-primary)' }}
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label
                htmlFor={item.id}
                style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-main)', cursor: 'pointer' }}
              >
                {item.label}
              </label>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                {item.desc}
              </span>
            </div>
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={isSaving}
        className="btn btn-primary"
        style={{ fontSize: '0.8125rem', padding: '0.5rem 1.25rem' }}
      >
        {isSaving ? 'Saving…' : 'Save Notification Preferences'}
      </button>
    </form>
  );
};
