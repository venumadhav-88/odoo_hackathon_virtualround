import React, { useState } from 'react';
import { Mail, Briefcase, Phone, Tag } from 'lucide-react';

/**
 * ProfileCard Component.
 * Displays profile metrics (avatar, employee ID, role) with editable name/phone controls.
 * @param {Object} props
 */
export const ProfileCard = ({ profile = {}, onUpdate, isSaving }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(profile.name || '');
  const [phone, setPhone] = useState(profile.phone || '');

  const handleSave = async (e) => {
    e.preventDefault();
    await onUpdate({ ...profile, name, phone });
    setIsEditing(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Avatar info block */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
        <img
          src={profile.avatarUrl}
          alt={profile.name}
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            objectFit: 'cover',
            border: '3px solid var(--color-border)',
          }}
        />
        <div>
          <h4 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-text-main)' }}>{profile.name}</h4>
          <span style={{ fontSize: '0.8125rem', color: 'var(--color-primary)', fontWeight: 600 }}>{profile.role}</span>
          <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', display: 'block', marginTop: '2px' }}>
            {profile.department}
          </span>
        </div>
      </div>

      {isEditing ? (
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="edit-name">
              Full Name *
            </label>
            <input
              id="edit-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="edit-phone">
              Phone Number
            </label>
            <input
              id="edit-phone"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="form-input"
            />
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button
              type="submit"
              disabled={isSaving}
              className="btn btn-primary"
              style={{ fontSize: '0.8125rem', padding: '0.5rem 1rem' }}
            >
              {isSaving ? 'Saving…' : 'Save Changes'}
            </button>
            <button
              type="button"
              disabled={isSaving}
              onClick={() => {
                setName(profile.name || '');
                setPhone(profile.phone || '');
                setIsEditing(false);
              }}
              className="btn btn-secondary"
              style={{ fontSize: '0.8125rem', padding: '0.5rem 1rem' }}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', maxWidth: '500px' }}>
          {[
            { label: 'Employee ID', value: profile.employeeId, icon: Tag },
            { label: 'Primary Email', value: profile.email, icon: Mail },
            { label: 'Contact Phone', value: profile.phone, icon: Phone },
            { label: 'Department', value: profile.department, icon: Briefcase },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0.75rem 1rem',
                  backgroundColor: 'var(--color-surface-hover)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                }}
              >
                <div style={{ color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center' }}>
                  <Icon size={16} />
                </div>
                <div style={{ flexGrow: 1 }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', display: 'block' }}>
                    {item.label}
                  </span>
                  <strong style={{ fontSize: '0.875rem', color: 'var(--color-text-main)' }}>{item.value || '-'}</strong>
                </div>
              </div>
            );
          })}

          <button
            onClick={() => setIsEditing(true)}
            className="btn btn-secondary"
            style={{ width: 'fit-content', marginTop: '0.5rem', fontSize: '0.8125rem', padding: '0.5rem 1.25rem' }}
          >
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
};
