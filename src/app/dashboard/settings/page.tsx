'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth-store';
import { motion } from 'framer-motion';
import { Save, Building2, CreditCard, Bell, Shield, Link2, Check, X, Zap } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import IntegrationSettingsPanel from '@/components/dashboard/IntegrationSettingsPanel';

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [restaurant, setRestaurant] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('general');

  const fetchRestaurant = useCallback(async () => {
    if (!user?.restaurantId) return;
    
    try {
      setLoading(true);
      const data = await api.getMyRestaurant();
      setRestaurant(data);
    } catch (error: any) {
      toast.error('Failed to load restaurant settings');
    } finally {
      setLoading(false);
    }
  }, [user?.restaurantId]);

  useEffect(() => {
    fetchRestaurant();
  }, [fetchRestaurant]);

  const tabs = [
    { id: 'general', label: 'General', icon: Building2 },
    { id: 'subscription', label: 'Subscription', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'integrations', label: 'Integrations', icon: Link2 },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-primary-600" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-2 text-gray-600">Manage your restaurant settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors mb-1 ${
                    activeTab === tab.id
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {activeTab === 'general' && <GeneralSettings restaurant={restaurant} />}
            {activeTab === 'subscription' && <SubscriptionSettings />}
            {activeTab === 'notifications' && <NotificationSettings />}
            {activeTab === 'security' && <SecuritySettings />}
            {activeTab === 'integrations' && <IntegrationSettingsPanel />}
          </div>
        </div>
      </div>
    </div>
  );
}

function GeneralSettings({ restaurant }: { restaurant: any }) {
  const [formData, setFormData] = useState({
    name: restaurant?.name || '',
    email: restaurant?.email || '',
    phone: restaurant?.phone || '',
    address: restaurant?.address || '',
    city: restaurant?.city || '',
    state: restaurant?.state || '',
    zipCode: restaurant?.zipCode || '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (restaurant) {
      setFormData({
        name: restaurant.name || '',
        email: restaurant.email || '',
        phone: restaurant.phone || '',
        address: restaurant.address || '',
        city: restaurant.city || '',
        state: restaurant.state || '',
        zipCode: restaurant.zipCode || '',
      });
    }
  }, [restaurant]);

  const handleSave = async () => {
    if (!restaurant?.id) {
      toast.error('Restaurant not loaded');
      return;
    }
    setSaving(true);
    try {
      await api.updateRestaurant(restaurant.id, formData);
      toast.success('Settings saved successfully');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">General Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Restaurant Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <Input
          label="Phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
        <Input
          label="Address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        />
        <Input
          label="City"
          value={formData.city}
          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
        />
        <Input
          label="State"
          value={formData.state}
          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
        />
        <Input
          label="Zip Code"
          value={formData.zipCode}
          onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
        />
      </div>
      <Button onClick={handleSave} isLoading={saving}>
        <Save size={18} className="mr-2" />
        Save Changes
      </Button>
    </div>
  );
}

interface Plan {
  id: string;
  name: string;
  description?: string;
  price: number;
  billingCycle: string;
  features: string[];
  supportsMultiOutlet: boolean;
  maxOutlets: number;
}

interface Subscription {
  id: string;
  status: string;
  currentPeriodEnd: string;
  plan: Plan;
}

function SubscriptionSettings() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loadingSub, setLoadingSub] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgrading, setUpgrading] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [sub, availablePlans] = await Promise.all([
          api.getMySubscription(),
          api.getAvailablePlans(),
        ]);
        setSubscription(sub);
        setPlans(availablePlans ?? []);
      } catch {
        toast.error('Failed to load subscription');
      } finally {
        setLoadingSub(false);
      }
    })();
  }, []);

  const handleUpgrade = async (planId: string) => {
    try {
      setUpgrading(planId);
      const updated = await api.upgradePlan(planId);
      setSubscription(updated);
      setShowUpgradeModal(false);
      toast.success(`Upgraded to ${updated.plan.name}`);
    } catch (err: unknown) {
      const e = err as { message?: string };
      toast.error(e.message || 'Upgrade failed');
    } finally {
      setUpgrading(null);
    }
  };

  if (loadingSub) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Loader2 className="animate-spin text-primary-600" size={28} />
      </div>
    );
  }

  const statusColor: Record<string, string> = {
    ACTIVE: 'bg-emerald-100 text-emerald-700',
    TRIAL: 'bg-amber-100 text-amber-700',
    EXPIRED: 'bg-red-100 text-red-700',
    CANCELLED: 'bg-gray-100 text-gray-600',
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Subscription</h2>

      {subscription ? (
        <>
          <div className="rounded-xl bg-gradient-to-r from-emerald-50 to-emerald-100 p-6 ring-1 ring-emerald-200">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-gray-900">{subscription.plan.name}</h3>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusColor[subscription.status] ?? statusColor.ACTIVE}`}>
                    {subscription.status}
                  </span>
                </div>
                {subscription.plan.description && (
                  <p className="mt-1 text-sm text-gray-600">{subscription.plan.description}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  {subscription.plan.billingCycle === 'MONTHLY' ? 'Monthly' : 'Yearly'} · ${Number(subscription.plan.price).toFixed(2)}/mo
                </p>
              </div>
              <Button onClick={() => setShowUpgradeModal(true)}>
                <Zap size={14} className="mr-1.5" /> Upgrade Plan
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
              <span className="text-sm text-gray-700">Next Billing Date</span>
              <span className="text-sm font-semibold text-gray-900">
                {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
              <span className="text-sm text-gray-700">Multi-outlet Support</span>
              <span className="text-sm font-semibold text-gray-900">
                {subscription.plan.supportsMultiOutlet
                  ? `Yes (up to ${subscription.plan.maxOutlets})`
                  : 'Not included'}
              </span>
            </div>
            {subscription.plan.features.length > 0 && (
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="mb-2 text-sm font-medium text-gray-700">Included features</p>
                <ul className="space-y-1">
                  {subscription.plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                      <Check size={13} className="text-emerald-500" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center">
          <CreditCard size={32} className="mx-auto mb-3 text-gray-300" />
          <p className="text-sm text-gray-500">No active subscription</p>
          <Button className="mt-4" onClick={() => setShowUpgradeModal(true)}>
            Choose a Plan
          </Button>
        </div>
      )}

      <Modal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} title="Choose a Plan" size="lg">
        {plans.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-500">No plans available</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {plans.map((plan) => {
              const isCurrent = subscription?.plan.id === plan.id;
              return (
                <div
                  key={plan.id}
                  className={`relative rounded-xl border p-5 ${isCurrent ? 'border-emerald-400 bg-emerald-50' : 'border-gray-200 bg-white'}`}
                >
                  {isCurrent && (
                    <span className="absolute right-3 top-3 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                      Current
                    </span>
                  )}
                  <h4 className="font-semibold text-gray-900">{plan.name}</h4>
                  {plan.description && <p className="mt-0.5 text-xs text-gray-500">{plan.description}</p>}
                  <p className="mt-2 text-2xl font-bold text-gray-900">
                    ${Number(plan.price).toFixed(0)}
                    <span className="text-sm font-normal text-gray-500">/mo</span>
                  </p>
                  {plan.features.length > 0 && (
                    <ul className="mt-3 space-y-1">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-center gap-1.5 text-xs text-gray-600">
                          <Check size={11} className="text-emerald-500 shrink-0" /> {f}
                        </li>
                      ))}
                    </ul>
                  )}
                  <button
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={isCurrent || upgrading === plan.id}
                    className="mt-4 w-full rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {upgrading === plan.id ? (
                      <Loader2 size={14} className="mx-auto animate-spin" />
                    ) : isCurrent ? (
                      'Current Plan'
                    ) : (
                      'Select Plan'
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </Modal>
    </div>
  );
}

function NotificationSettings() {
  const notificationGroups = [
    {
      title: 'Restaurant operations',
      color: 'emerald',
      items: [
        { label: 'Order placed', description: 'Owner and admins are notified when a new direct order is created.' },
        { label: 'Service request received', description: 'Open support requests from tables are highlighted for the operations team.' },
        { label: 'Payment succeeded', description: 'Successful collections are shared for paid takeaway and later payment updates.' },
        { label: 'Payment failed', description: 'Failed payment attempts are flagged so staff can follow up quickly.' },
      ],
    },
    {
      title: 'Restaurant account',
      color: 'blue',
      items: [
        { label: 'Restaurant approved', description: 'Owner is notified when onboarding is approved by platform admin.' },
        { label: 'Subscription expiring', description: 'Expiry reminders are sent before subscription access lapses.' },
        { label: 'Subscription purchased', description: 'New subscription assignments and renewals are confirmed to the restaurant.' },
      ],
    },
    {
      title: 'Admin & platform monitoring',
      color: 'violet',
      items: [
        { label: 'New restaurant onboarded', description: 'Admins are alerted whenever a new restaurant signup enters review.' },
        { label: 'Subscription changed or expired', description: 'Admins can monitor renewals, expiries, and failed activation paths.' },
        { label: 'Server, database, and payment risk', description: 'Platform-side error spikes and failed payment clusters are surfaced as alerts.' },
      ],
    },
  ];

  const dotColor: Record<string, string> = {
    emerald: 'bg-emerald-400',
    blue: 'bg-blue-400',
    violet: 'bg-violet-400',
  };

  const badgeColor: Record<string, string> = {
    emerald: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    blue: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
    violet: 'bg-violet-50 text-violet-700 ring-1 ring-violet-200',
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Notification Coverage</h2>
        <p className="mt-1 text-sm text-gray-500">
          All notifications below are automatically delivered by the platform. No configuration required.
        </p>
      </div>

      <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 flex items-start gap-2">
        <Check size={15} className="mt-0.5 shrink-0 text-emerald-600" />
        In-app and email notifications are active for your restaurant. The dashboard Notifications tab shows real-time alerts.
      </div>

      <div className="space-y-4">
        {notificationGroups.map((group) => (
          <div key={group.title} className="rounded-xl border border-gray-200 bg-gray-50/60 overflow-hidden">
            <div className="flex items-center gap-2.5 border-b border-gray-200 bg-white px-4 py-3">
              <span className={`h-2 w-2 rounded-full ${dotColor[group.color]}`} />
              <h3 className="text-sm font-semibold text-gray-900">{group.title}</h3>
              <span className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold ${badgeColor[group.color]}`}>
                {group.items.length} active
              </span>
            </div>
            <div className="divide-y divide-gray-100">
              {group.items.map((item) => (
                <div key={item.label} className="flex items-start gap-3 bg-white px-4 py-3.5">
                  <Check size={13} className="mt-0.5 shrink-0 text-emerald-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.label}</p>
                    <p className="mt-0.5 text-xs text-gray-500">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SecuritySettings() {
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwError, setPwError] = useState('');

  const handleChangePassword = async () => {
    setPwError('');
    if (!pwForm.current || !pwForm.next || !pwForm.confirm) {
      setPwError('All fields are required');
      return;
    }
    if (pwForm.next.length < 8) {
      setPwError('New password must be at least 8 characters');
      return;
    }
    if (pwForm.next !== pwForm.confirm) {
      setPwError('New passwords do not match');
      return;
    }
    try {
      setPwSaving(true);
      await api.changePassword(pwForm.current, pwForm.next, pwForm.confirm);
      toast.success('Password updated');
      setPwForm({ current: '', next: '', confirm: '' });
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } }; message?: string };
      setPwError(e.response?.data?.message || e.message || 'Failed to update password');
    } finally {
      setPwSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Security</h2>

      {/* Change Password */}
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <h3 className="text-sm font-semibold text-gray-900">Change Password</h3>
        <p className="mt-0.5 text-xs text-gray-500">Choose a strong password of at least 8 characters.</p>
        <div className="mt-4 space-y-3">
          <Input
            label="Current Password"
            type="password"
            value={pwForm.current}
            onChange={(e) => setPwForm((p) => ({ ...p, current: e.target.value }))}
          />
          <Input
            label="New Password"
            type="password"
            value={pwForm.next}
            onChange={(e) => setPwForm((p) => ({ ...p, next: e.target.value }))}
          />
          <Input
            label="Confirm New Password"
            type="password"
            value={pwForm.confirm}
            onChange={(e) => setPwForm((p) => ({ ...p, confirm: e.target.value }))}
          />
          {pwError && (
            <p className="flex items-center gap-1.5 text-xs text-red-600">
              <X size={12} /> {pwError}
            </p>
          )}
        </div>
        <Button className="mt-4" onClick={handleChangePassword} isLoading={pwSaving}>
          Update Password
        </Button>
      </div>

      {/* 2FA */}
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Two-Factor Authentication</h3>
            <p className="mt-0.5 text-xs text-gray-500">
              Add a one-time code from an authenticator app as a second login step.
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-700">
            Coming Soon
          </span>
        </div>
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-gray-50 px-4 py-3 text-xs text-gray-500">
          <Shield size={13} className="shrink-0" />
          TOTP-based 2FA (Google Authenticator / Authy) will be available in a future release.
        </div>
      </div>
    </div>
  );
}
