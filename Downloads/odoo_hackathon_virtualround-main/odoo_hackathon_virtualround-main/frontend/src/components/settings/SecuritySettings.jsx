import React, { useState } from 'react';
import { ShieldAlert, KeyRound, Monitor, History } from 'lucide-react';
import { notify } from '@/utils/notifications';

/**
 * SecuritySettings Component.
 * Custom forms managing mock passwords inputs, 2FA setups, active session records, and ip login history logs.
 * @param {Object} props
 */
export const SecuritySettings = ({ security = {}, onSave, isSaving }) => {
  const [twoFactorAuth, setTwoFactorAuth] = useState(!!security.twoFactorAuth);
  const [sessionTimeout, setSessionTimeout] = useState(security.sessionTimeout || 30);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleUpdateSecurity = (e) => {
    e.preventDefault();
    onSave({
      twoFactorAuth,
      sessionTimeout: parseInt(sessionTimeout, 10) || 30,
    });
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    notify.success('Security password update simulated successfully.');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Policy Options */}
      <form onSubmit={handleUpdateSecurity} noValidate>
        <h4
          style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: 'var(--color-text-main)',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <ShieldAlert size={16} />
          <span>Security Options & Policy</span>
        </h4>
        <div className="asset-form-grid" style={{ marginBottom: '1.25rem' }}>
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <input
                id="two-factor"
                type="checkbox"
                checked={twoFactorAuth}
                onChange={(e) => setTwoFactorAuth(e.target.checked)}
                style={{ marginTop: '0.25rem', cursor: 'pointer', accentColor: 'var(--color-primary)' }}
              />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label
                  htmlFor="two-factor"
                  style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-main)', cursor: 'pointer' }}
                >
                  Two-Factor Authentication (2FA)
                </label>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                  Add an extra layer of security to your admin account (Authenticator app).
                </span>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="sessionTimeout" className="form-label">Auto Logout Timeout (Minutes)</label>
            <select
              id="sessionTimeout"
              value={sessionTimeout}
              onChange={(e) => setSessionTimeout(e.target.value)}
              className="filters-select form-input"
            >
              <option value={15}>15 Minutes</option>
              <option value={30}>30 Minutes</option>
              <option value={60}>60 Minutes</option>
              <option value={120}>120 Minutes</option>
            </select>
          </div>
        </div>
        <button
          type="submit"
          disabled={isSaving}
          className="btn btn-primary"
          style={{ fontSize: '0.8125rem', padding: '0.5rem 1.25rem' }}
        >
          {isSaving ? 'Saving…' : 'Save Security Policy'}
        </button>
      </form>

      <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)' }} />

      {/* Password changes form */}
      <form onSubmit={handlePasswordChange} noValidate style={{ maxWidth: '400px' }}>
        <h4
          style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: 'var(--color-text-main)',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <KeyRound size={16} />
          <span>Change Password</span>
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="curr-pass">Current Password</label>
            <input
              id="curr-pass"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="new-pass">New Password</label>
            <input
              id="new-pass"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="conf-pass">Confirm Password</label>
            <input
              id="conf-pass"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="form-input"
            />
          </div>
        </div>
        <button type="submit" className="btn btn-secondary" style={{ fontSize: '0.8125rem', padding: '0.5rem 1.25rem' }}>
          Update Password
        </button>
      </form>

      <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)' }} />

      {/* Session tracker lists */}
      <div>
        <h4
          style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: 'var(--color-text-main)',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <Monitor size={16} />
          <span>Active Logged Sessions</span>
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {(security.activeSessions || []).map((sess) => (
            <div
              key={sess.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem 1rem',
                backgroundColor: 'var(--color-surface-hover)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8125rem',
              }}
            >
              <div>
                <strong style={{ color: 'var(--color-text-main)' }}>{sess.device}</strong>
                <span
                  style={{ display: 'block', fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '2px' }}
                >
                  {sess.location}
                </span>
              </div>
              <span
                style={{
                  color: sess.status.includes('Current') ? 'var(--color-success)' : 'var(--color-text-muted)',
                  fontWeight: 600,
                }}
              >
                {sess.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)' }} />

      {/* Login access logs */}
      <div>
        <h4
          style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: 'var(--color-text-main)',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <History size={16} />
          <span>Login Access Logs</span>
        </h4>
        <div style={{ overflowX: 'auto' }}>
          <table className="table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                <th style={{ padding: '0.5rem', textAlign: 'left', color: 'var(--color-text-muted)' }}>Timestamp</th>
                <th style={{ padding: '0.5rem', textAlign: 'left', color: 'var(--color-text-muted)' }}>IP Address</th>
                <th style={{ padding: '0.5rem', textAlign: 'left', color: 'var(--color-text-muted)' }}>Device</th>
                <th style={{ padding: '0.5rem', textAlign: 'right', color: 'var(--color-text-muted)' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {(security.loginHistory || []).map((h, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '0.625rem 0.5rem', color: 'var(--color-text-muted)' }}>{h.timestamp}</td>
                  <td style={{ padding: '0.625rem 0.5rem', color: 'var(--color-text-main)', fontWeight: 500 }}>
                    {h.ip}
                  </td>
                  <td style={{ padding: '0.625rem 0.5rem', color: 'var(--color-text-muted)' }}>{h.device}</td>
                  <td
                    style={{
                      padding: '0.625rem 0.5rem',
                      textAlign: 'right',
                      color: 'var(--color-success)',
                      fontWeight: 600,
                    }}
                  >
                    {h.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
