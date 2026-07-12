import React, { useEffect, useState, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';
import { usePageTitle, useSettings } from '@/hooks';
import { SettingsService } from '@/services';
import { PageContainer, PageHeader, ErrorState, ActionButton } from '@/components/common';
import { PageLoader } from '@/components/common/loading/PageLoader';
import { LoaderOverlay } from '@/components/common/loading/LoaderOverlay';
import {
  ProfileCard,
  AccountSettings,
  AppearanceSettings,
  NotificationSettings,
  SecuritySettings,
  SystemInformation,
  AboutApplication,
  SettingsSidebar,
  SettingsSection,
} from '@/components/settings';

/**
 * Settings Page Orchestrator.
 * Connects layout sidebar tabs with active preference configuration forms.
 */
const Settings = () => {
  usePageTitle('System Settings');

  const [rawSettings, setRawSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSettings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await SettingsService.getSettings();
      setRawSettings(data);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const {
    settings,
    activeSection,
    setActiveSection,
    isSaving,
    updateSectionSettings,
    resetAllSettings,
  } = useSettings(rawSettings);

  if (isLoading || !settings) {
    return (
      <PageContainer>
        <PageHeader title="System Settings" subtitle="Configure EAM parameters and user preferences" />
        <PageLoader message="Fetching configuration preferences…" />
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <PageHeader title="System Settings" subtitle="Configure EAM parameters and user preferences" />
        <ErrorState
          title="Failed to Load System Settings"
          description="We encountered an issue connecting to the settings registry database."
          onRetry={fetchSettings}
        />
      </PageContainer>
    );
  }

  const handleUpdate = async (section, data) => {
    await updateSectionSettings(section, data);
  };

  const handleReset = async () => {
    await resetAllSettings();
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <SettingsSection title="User Profile Details" description="View and manage employee profile parameters.">
            <ProfileCard
              profile={settings.profile}
              onUpdate={(data) => handleUpdate('profile', data)}
              isSaving={isSaving}
            />
          </SettingsSection>
        );
      case 'account':
        return (
          <SettingsSection title="General Preferences" description="Configure timezone, preferred currency, and localization.">
            <AccountSettings
              general={settings.general}
              onSave={(data) => handleUpdate('general', data)}
              isSaving={isSaving}
            />
          </SettingsSection>
        );
      case 'appearance':
        return (
          <SettingsSection title="Appearance Design" description="Customize screen themes, densities, and layout modes.">
            <AppearanceSettings onSave={(data) => handleUpdate('general', data)} isSaving={isSaving} />
          </SettingsSection>
        );
      case 'notifications':
        return (
          <SettingsSection title="Notifications Alerts" description="Configure when and how alerts are dispatched.">
            <NotificationSettings
              notifications={settings.notifications}
              onSave={(data) => handleUpdate('notifications', data)}
              isSaving={isSaving}
            />
          </SettingsSection>
        );
      case 'security':
        return (
          <SettingsSection
            title="Security & Access Policy"
            description="Setup two-factor credentials, passwords, and track sessions."
          >
            <SecuritySettings
              security={settings.security}
              onSave={(data) => handleUpdate('security', data)}
              isSaving={isSaving}
            />
          </SettingsSection>
        );
      case 'system':
        return (
          <SettingsSection title="System Information" description="Technical software specifications and build dates.">
            <SystemInformation systemInfo={settings.systemInfo} />
          </SettingsSection>
        );
      case 'about':
        return (
          <SettingsSection title="About EAM Application" description="Underlying architecture, stacks, and legal licensing.">
            <AboutApplication about={settings.about} />
          </SettingsSection>
        );
      default:
        return null;
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="System Settings"
        subtitle="Configure EAM parameters and user preferences"
        actions={
          <ActionButton onClick={handleReset} icon={RefreshCw} variant="secondary">
            Reset Preferences
          </ActionButton>
        }
      />

      {isSaving && <LoaderOverlay />}

      {/* KPI Info Widgets */}
      <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Theme Layout Mode</span>
          </div>
          <div className="stat-card-value" style={{ textTransform: 'capitalize' }}>
            {window.document.body.classList.contains('light-theme') ? 'Light Mode' : 'Dark Mode'}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Active Admin Sessions</span>
          </div>
          <div className="stat-card-value">{settings.security?.activeSessions?.length || 0} Sessions</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Storage Space Used</span>
          </div>
          <div className="stat-card-value" style={{ color: 'var(--color-primary)' }}>
            142.8 MB
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Last Automated Backup</span>
          </div>
          <div className="stat-card-value" style={{ fontSize: '0.9rem', padding: '0.35rem 0', color: 'var(--color-success)' }}>
            2026-07-11 23:00:00
          </div>
        </div>
      </div>

      {/* Workspace Panel */}
      <div
        style={{
          display: 'flex',
          gap: '1.5rem',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
        }}
      >
        <SettingsSidebar activeSection={activeSection} onSelectSection={setActiveSection} />

        {renderSection()}
      </div>
    </PageContainer>
  );
};

export default Settings;
