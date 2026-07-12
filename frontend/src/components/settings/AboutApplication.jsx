import React from 'react';

/**
 * AboutApplication Component.
 * Summarizes the Shaunt app description, tech stack tag badges, and license copyrights.
 * @param {Object} props
 */
export const AboutApplication = ({ about = {} }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        maxWidth: '650px',
        fontSize: '0.875rem',
        lineHeight: '1.6',
      }}
    >
      <div>
        <h4 style={{ fontSize: '0.925rem', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: '0.5rem' }}>
          Description
        </h4>
        <p style={{ color: 'var(--color-text-muted)' }}>{about.description}</p>
      </div>

      <div>
        <h4 style={{ fontSize: '0.925rem', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: '0.75rem' }}>
          Technology Stack
        </h4>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {(about.techStack || []).map((tech) => (
            <span
              key={tech}
              style={{
                backgroundColor: 'var(--color-surface-hover)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '0.35rem 0.75rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--color-primary)',
              }}
            >
              {tech}
            </span>
          ))}
          <span
            style={{
              backgroundColor: 'var(--color-surface-hover)',
              border: '1px dashed var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '0.35rem 0.75rem',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'var(--color-text-muted)',
            }}
          >
            Supabase (Coming Soon)
          </span>
        </div>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)' }} />

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          color: 'var(--color-text-muted)',
          fontSize: '0.75rem',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}
      >
        <span>License: MIT Commercial Enterprise Code</span>
        <span>{about.copyright}</span>
      </div>
    </div>
  );
};
