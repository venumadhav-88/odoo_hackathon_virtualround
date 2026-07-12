import React, { useState } from 'react';

/**
 * AccountSettings Component.
 * Form inputs for language, timezone, date format, and pagination grids sizes.
 * @param {Object} props
 */
export const AccountSettings = ({ general = {}, onSave, isSaving }) => {
  const [language, setLanguage] = useState(general.language || 'English');
  const [timezone, setTimezone] = useState(general.timezone || 'UTC-5 (EST)');
  const [dateFormat, setDateFormat] = useState(general.dateFormat || 'YYYY-MM-DD');
  const [currency, setCurrency] = useState(general.currency || 'USD');
  const [itemsPerPage, setItemsPerPage] = useState(general.itemsPerPage || 10);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      language,
      timezone,
      dateFormat,
      currency,
      itemsPerPage: parseInt(itemsPerPage, 10) || 10,
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="asset-form-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="form-group">
          <label htmlFor="language" className="form-label">System Language</label>
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="filters-select form-input"
          >
            <option value="English">English</option>
            <option value="Spanish">Español</option>
            <option value="French">Français</option>
            <option value="German">Deutsch</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="timezone" className="form-label">Timezone</label>
          <select
            id="timezone"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="filters-select form-input"
          >
            <option value="UTC-5 (EST)">UTC-5 (EST)</option>
            <option value="UTC+0 (GMT)">UTC+0 (GMT)</option>
            <option value="UTC+1 (CET)">UTC+1 (CET)</option>
            <option value="UTC+8 (SGT)">UTC+8 (SGT)</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="dateFormat" className="form-label">Date Format</label>
          <select
            id="dateFormat"
            value={dateFormat}
            onChange={(e) => setDateFormat(e.target.value)}
            className="filters-select form-input"
          >
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="currency" className="form-label">Preferred Currency</label>
          <select
            id="currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="filters-select form-input"
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="SGD">SGD (S$)</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="itemsPerPage" className="form-label">Items per Page</label>
          <input
            id="itemsPerPage"
            type="number"
            min="5"
            max="100"
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(e.target.value)}
            className="form-input"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSaving}
        className="btn btn-primary"
        style={{ fontSize: '0.8125rem', padding: '0.5rem 1.25rem' }}
      >
        {isSaving ? 'Saving…' : 'Save General Preferences'}
      </button>
    </form>
  );
};
