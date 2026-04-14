'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { MessageCircle } from 'lucide-react';
import { api } from '@/lib/api';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface WhatsappConfigState {
  connected: boolean;
  apiVersion: string;
  hasAccessToken: boolean;
  hasPhoneNumberId: boolean;
  hasBusinessAccountId: boolean;
  updatedAt?: string | null;
  displayPhoneNumberId?: string | null;
}

export default function WhatsappSettingsPanel() {
  const [config, setConfig] = useState<WhatsappConfigState | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sendingTest, setSendingTest] = useState(false);
  const [form, setForm] = useState({
    accessToken: '',
    phoneNumberId: '',
    apiVersion: 'v23.0',
    businessAccountId: '',
  });
  const [testPhone, setTestPhone] = useState('');

  const loadConfig = async () => {
    try {
      setLoading(true);
      const data = await api.getWhatsappConfig();
      setConfig(data);
      setForm((current) => ({
        ...current,
        apiVersion: data?.apiVersion || 'v23.0',
      }));
    } catch (error: any) {
      toast.error(error?.message || 'Failed to load WhatsApp configuration');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConfig();
  }, []);

  const saveConfig = async () => {
    if (!form.accessToken.trim()) {
      toast.error('Access token is required');
      return;
    }

    if (!form.phoneNumberId.trim()) {
      toast.error('Phone number ID is required');
      return;
    }

    try {
      setSaving(true);
      const data = await api.updateWhatsappConfig({
        accessToken: form.accessToken.trim(),
        phoneNumberId: form.phoneNumberId.trim(),
        apiVersion: form.apiVersion.trim() || 'v23.0',
        businessAccountId: form.businessAccountId.trim() || undefined,
      });
      setConfig(data);
      setForm((current) => ({
        ...current,
        accessToken: '',
        phoneNumberId: '',
        businessAccountId: '',
      }));
      toast.success('WhatsApp credentials saved');
    } catch (error: any) {
      toast.error(error?.message || 'Failed to save WhatsApp configuration');
    } finally {
      setSaving(false);
    }
  };

  const disconnect = async () => {
    try {
      setSaving(true);
      const data = await api.disconnectWhatsappConfig();
      setConfig(data);
      setForm({
        accessToken: '',
        phoneNumberId: '',
        apiVersion: 'v23.0',
        businessAccountId: '',
      });
      toast.success('WhatsApp disconnected');
    } catch (error: any) {
      toast.error(error?.message || 'Failed to disconnect WhatsApp');
    } finally {
      setSaving(false);
    }
  };

  const sendTestMessage = async () => {
    if (!testPhone.trim()) {
      toast.error('Test phone number is required');
      return;
    }

    try {
      setSendingTest(true);
      await api.sendWhatsappTestMessage(testPhone.trim());
      toast.success('Test WhatsApp message sent');
    } catch (error: any) {
      toast.error(error?.message || 'Failed to send test WhatsApp message');
    } finally {
      setSendingTest(false);
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 p-4">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-emerald-50 p-2 text-emerald-600">
              <MessageCircle size={18} />
            </div>
            <div>
              <p className="font-semibold text-gray-900">WhatsApp Cloud API</p>
              <p className="text-sm text-gray-600">
                Each restaurant can connect its own Meta WhatsApp sender number.
              </p>
            </div>
          </div>
          {!loading && config ? (
            <p className="mt-3 text-sm text-gray-600">
              Status: {config.connected ? 'CONNECTED' : 'DISCONNECTED'}
              {config.displayPhoneNumberId ? ` • Phone Number ID ${config.displayPhoneNumberId}` : ''}
              {config.updatedAt ? ` • Updated ${new Date(config.updatedAt).toLocaleString()}` : ''}
            </p>
          ) : null}
        </div>
        {config?.connected ? (
          <Button variant="outline" onClick={disconnect} isLoading={saving}>
            Disconnect
          </Button>
        ) : null}
      </div>

      {loading ? (
        <p className="text-sm text-gray-600">Loading WhatsApp configuration...</p>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <Input
            label="Access Token"
            type="password"
            value={form.accessToken}
            onChange={(event) => setForm((current) => ({ ...current, accessToken: event.target.value }))}
            placeholder={config?.hasAccessToken ? 'Stored securely' : 'Meta access token'}
          />
          <Input
            label="Phone Number ID"
            type="password"
            value={form.phoneNumberId}
            onChange={(event) => setForm((current) => ({ ...current, phoneNumberId: event.target.value }))}
            placeholder={config?.hasPhoneNumberId ? 'Stored securely' : 'WhatsApp phone number ID'}
          />
          <Input
            label="Business Account ID"
            type="password"
            value={form.businessAccountId}
            onChange={(event) => setForm((current) => ({ ...current, businessAccountId: event.target.value }))}
            placeholder={config?.hasBusinessAccountId ? 'Stored securely' : 'Optional business account ID'}
          />
          <Input
            label="API Version"
            value={form.apiVersion}
            onChange={(event) => setForm((current) => ({ ...current, apiVersion: event.target.value }))}
            placeholder="v23.0"
          />
          <div className="md:col-span-2 rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
            Save the credentials from this restaurant&apos;s own Meta WhatsApp Business setup. Order confirmations,
            review requests, and campaigns will be sent from that restaurant&apos;s number.
          </div>
          <Input
            label="Test Phone Number"
            value={testPhone}
            onChange={(event) => setTestPhone(event.target.value)}
            placeholder="+919999999999"
          />
          <div className="md:col-span-2 flex flex-wrap gap-3">
            <Button onClick={saveConfig} isLoading={saving}>
              Save WhatsApp Configuration
            </Button>
            <Button
              variant="outline"
              onClick={sendTestMessage}
              isLoading={sendingTest}
              disabled={!config?.connected && (!form.accessToken.trim() || !form.phoneNumberId.trim())}
            >
              Send Test WhatsApp Message
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
