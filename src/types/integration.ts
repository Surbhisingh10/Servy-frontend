export type Platform = 'SWIGGY' | 'ZOMATO' | 'DINEOUT';

export interface IntegrationStatusRow {
  platform: Platform;
  status: 'CONNECTED' | 'DISCONNECTED' | 'ERROR';
  connected: boolean;
  hasApiKey: boolean;
  hasWebhookSecret: boolean;
  lastSyncAt?: string | null;
  updatedAt?: string | null;
}

