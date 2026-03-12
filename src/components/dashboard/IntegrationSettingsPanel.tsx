'use client';

import { useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import toast from 'react-hot-toast';
import { IntegrationStatusRow, Platform } from '@/types/integration';

export default function IntegrationSettingsPanel() {
  const [rows, setRows] = useState<IntegrationStatusRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [savingPlatform, setSavingPlatform] = useState<Platform | null>(null);
  const [form, setForm] = useState<Record<Platform, { apiKey: string; webhookSecret: string }>>({
    SWIGGY: { apiKey: '', webhookSecret: '' },
    ZOMATO: { apiKey: '', webhookSecret: '' },
    DINEOUT: { apiKey: '', webhookSecret: '' },
  });

  const rowsByPlatform = useMemo(() => {
    const map = new Map(rows.map((r) => [r.platform, r]));
    return map;
  }, [rows]);

  const fetchIntegrations = async () => {
    try {
      setLoading(true);
      const data = await api.getIntegrations();
      setRows(data || []);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to load integrations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const connect = async (platform: Platform) => {
    const apiKey = form[platform].apiKey.trim();
    const webhookSecret = form[platform].webhookSecret.trim();
    if (!apiKey) {
      toast.error('API key is required');
      return;
    }

    try {
      setSavingPlatform(platform);
      await api.connectIntegration(platform, { apiKey, webhookSecret: webhookSecret || undefined });
      toast.success(`${platform} connected`);
      setForm((prev) => ({ ...prev, [platform]: { apiKey: '', webhookSecret: '' } }));
      fetchIntegrations();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || `Failed to connect ${platform}`);
    } finally {
      setSavingPlatform(null);
    }
  };

  const disconnect = async (platform: Platform) => {
    try {
      setSavingPlatform(platform);
      await api.disconnectIntegration(platform);
      toast.success(`${platform} disconnected`);
      fetchIntegrations();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || `Failed to disconnect ${platform}`);
    } finally {
      setSavingPlatform(null);
    }
  };

  const platforms: Platform[] = ['SWIGGY', 'ZOMATO', 'DINEOUT'];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Online Ordering Integrations</h2>
      {loading ? (
        <p className="text-sm text-gray-600">Loading integrations...</p>
      ) : (
        platforms.map((platform) => {
          const row = rowsByPlatform.get(platform);
          return (
            <div key={platform} className="rounded-xl border border-gray-200 p-4">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{platform}</p>
                  <p className="text-sm text-gray-600">
                    Status: {row?.status || 'DISCONNECTED'}
                    {row?.lastSyncAt ? ` • Last sync ${new Date(row.lastSyncAt).toLocaleString()}` : ''}
                  </p>
                </div>
                <div className="flex gap-2">
                  {row?.connected ? (
                    <Button
                      variant="outline"
                      onClick={() => disconnect(platform)}
                      isLoading={savingPlatform === platform}
                    >
                      Disconnect
                    </Button>
                  ) : (
                    <Button
                      onClick={() => connect(platform)}
                      isLoading={savingPlatform === platform}
                    >
                      Connect
                    </Button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <Input
                  label="API Key"
                  type="password"
                  value={form[platform].apiKey}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      [platform]: { ...prev[platform], apiKey: e.target.value },
                    }))
                  }
                  placeholder={row?.hasApiKey ? 'Stored securely' : 'Enter API key'}
                />
                <Input
                  label="Webhook Secret"
                  type="password"
                  value={form[platform].webhookSecret}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      [platform]: { ...prev[platform], webhookSecret: e.target.value },
                    }))
                  }
                  placeholder={row?.hasWebhookSecret ? 'Stored securely' : 'Enter webhook secret'}
                />
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
