import { useState, useCallback, useEffect } from 'react';
import { SettingsService } from '@/services';

/**
 * Custom hook managing local configuration forms state, tabs indexes, and async save operations.
 * @param {SettingsModel} initialSettings - Initial loaded preferences.
 */
export const useSettings = (initialSettings) => {
  const [settings, setSettings] = useState(initialSettings);
  const [activeSection, setActiveSection] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (initialSettings) {
      setSettings(initialSettings);
    }
  }, [initialSettings]);

  const updateSectionSettings = useCallback(async (section, data) => {
    setIsSaving(true);
    try {
      const updated = await SettingsService.updateSettings({ [section]: data });
      setSettings(updated);
      return updated;
    } finally {
      setIsSaving(false);
    }
  }, []);

  const resetAllSettings = useCallback(async () => {
    setIsSaving(true);
    try {
      const reseted = await SettingsService.resetSettings();
      setSettings(reseted);
      return reseted;
    } finally {
      setIsSaving(false);
    }
  }, []);

  return {
    settings,
    setSettings,
    activeSection,
    setActiveSection,
    isSaving,
    updateSectionSettings,
    resetAllSettings,
  };
};
