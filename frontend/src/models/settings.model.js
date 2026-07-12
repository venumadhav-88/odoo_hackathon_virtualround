/**
 * Domain model representing application administration preferences and metadata.
 */
export class SettingsModel {
  constructor(data = {}) {
    this.profile = data.profile || {};
    this.general = data.general || {};
    this.notifications = data.notifications || {};
    this.security = data.security || {};
    this.systemInfo = data.systemInfo || {};
    this.about = data.about || {};
  }
}
