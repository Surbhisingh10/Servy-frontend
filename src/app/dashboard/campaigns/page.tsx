'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  CalendarDays,
  Clock3,
  Crown,
  LucideIcon,
  Megaphone,
  Send,
  Sparkles,
  Star,
  Tags,
  Users,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '@/lib/api';

type AudienceKey = string;

interface QuickCard {
  title: string;
  description: string;
  badge: string;
  icon: LucideIcon;
  template: string;
}

interface Customer {
  id: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  customerGroups?: string[];
  totalVisits: number;
  lifetimeSpend: number;
  lastVisitDate?: string;
}

interface AudienceOption {
  key: string;
  label: string;
  reach: number;
  description: string;
  customerIds: string[];
  source: 'system' | 'manual';
  groupName?: string;
}

interface Campaign {
  id: string;
  name: string;
  status: string;
  type: string;
  startDate: string;
  actions?: {
    delivery?: {
      sentCount?: number;
      failedCount?: number;
      recipientCount?: number;
    };
  };
  targetAudience?: {
    key?: string;
    label?: string;
    groupName?: string;
    customerIds?: string[];
  };
}

const quickOutreach: QuickCard[] = [
  {
    title: 'Weekend Offer',
    description: 'Send 10% discount for Saturday or Sunday bookings.',
    badge: 'Popular',
    icon: Sparkles,
    template:
      'Hi {name}, enjoy 10% off this weekend at our restaurant. Reply YES to reserve your table.',
  },
  {
    title: 'VIP Preview',
    description: 'Invite your highest-value customers before everyone else.',
    badge: 'VIP',
    icon: Crown,
    template:
      'Hi {name}, you are invited to an exclusive VIP preview this week. Reply YES to book early access.',
  },
  {
    title: 'Win Back Guests',
    description: 'Reconnect with guests who have not visited recently.',
    badge: 'Retention',
    icon: Users,
    template:
      'Hi {name}, we miss serving you. Come back this week and enjoy a special welcome-back offer.',
  },
  {
    title: 'Group Promotion',
    description: 'Create a promo for any saved customer group you manage.',
    badge: 'Groups',
    icon: Tags,
    template:
      'Hi {name}, this promotion is reserved for your selected customer group. Show this message when you visit.',
  },
];

const tips = [
  {
    title: 'Create groups first',
    body: 'Add customers to groups like VIP, Corporate, or Brunch Club from the Customers page. Those groups appear here automatically as campaign audiences.',
  },
  {
    title: 'Use dynamic segments too',
    body: 'All Customers, VIP by spend, and Inactive are calculated automatically from your customer data so you can launch quickly.',
  },
  {
    title: 'Keep group names operational',
    body: 'Use short, stable names like VIP, Office Park, Catering Leads, or Birthday Club. That keeps campaign filtering predictable later.',
  },
];

const MAX_LENGTH = 160;

export default function CampaignsPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [groupNameInput, setGroupNameInput] = useState('VIP');
  const [selectedGroupMembers, setSelectedGroupMembers] = useState<string[]>([]);
  const [message, setMessage] = useState(
    'Hi {name}, join us this Sunday for 20% off all brunch items! Show this message to your server.',
  );
  const [campaignName, setCampaignName] = useState('Sunday Brunch Promo');
  const [selectedAudience, setSelectedAudience] = useState<AudienceKey>('all');
  const [scheduledDate, setScheduledDate] = useState(new Date().toISOString().split('T')[0]);
  const [scheduledTime, setScheduledTime] = useState('18:00');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingGroup, setIsSavingGroup] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [customerData, campaignData] = await Promise.all([
          api.getCustomers(),
          api.getCampaigns(),
        ]);
        setCustomers(customerData);
        setCampaigns(campaignData);
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to load campaigns');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const audienceOptions = useMemo<AudienceOption[]>(() => {
    const now = new Date();
    const vipCustomers = customers.filter(
      (customer) => customer.totalVisits >= 3 || Number(customer.lifetimeSpend || 0) >= 5000,
    );
    const inactiveCustomers = customers.filter((customer) => {
      if (!customer.lastVisitDate) return false;
      const lastVisit = new Date(customer.lastVisitDate);
      const diffDays = (now.getTime() - lastVisit.getTime()) / (1000 * 60 * 60 * 24);
      return diffDays >= 30;
    });

    const manualGroups: AudienceOption[] = Array.from(
      new Set(customers.flatMap((customer) => customer.customerGroups || [])),
    )
      .sort()
      .map((groupName) => {
        const groupedCustomers = customers.filter((customer) =>
          (customer.customerGroups || []).includes(groupName),
        );

        return {
          key: `group:${groupName}`,
          label: groupName,
          reach: groupedCustomers.length,
          description: `Saved customer group: ${groupName}`,
          customerIds: groupedCustomers.map((customer) => customer.id),
          source: 'manual',
          groupName,
        };
      });

    return [
      {
        key: 'all',
        label: 'All Customers',
        reach: customers.length,
        description: 'Everyone in your restaurant customer database.',
        customerIds: customers.map((customer) => customer.id),
        source: 'system',
      },
      {
        key: 'vip',
        label: 'VIP Segment',
        reach: vipCustomers.length,
        description: 'High-value guests based on repeat visits or spend.',
        customerIds: vipCustomers.map((customer) => customer.id),
        source: 'system',
      },
      {
        key: 'inactive',
        label: 'Inactive 30+ Days',
        reach: inactiveCustomers.length,
        description: 'Guests who have not visited in the last 30 days.',
        customerIds: inactiveCustomers.map((customer) => customer.id),
        source: 'system',
      },
      ...manualGroups,
    ];
  }, [customers]);

  const activeAudience =
    audienceOptions.find((option) => option.key === selectedAudience) || audienceOptions[0];
  const remainingChars = MAX_LENGTH - message.length;
  const normalizedGroupName = groupNameInput.trim();

  useEffect(() => {
    if (!normalizedGroupName) {
      setSelectedGroupMembers([]);
      return;
    }

    const members = customers
      .filter((customer) => (customer.customerGroups || []).includes(normalizedGroupName))
      .map((customer) => customer.id);
    setSelectedGroupMembers(members);
  }, [customers, normalizedGroupName]);

  const applyTemplate = (template: QuickCard) => {
    setCampaignName(template.title);
    setMessage(template.template);
    toast.success('Template applied');
  };

  const toggleGroupMember = (customerId: string) => {
    setSelectedGroupMembers((prev) =>
      prev.includes(customerId)
        ? prev.filter((id) => id !== customerId)
        : [...prev, customerId],
    );
  };

  const saveGroupMembers = async () => {
    if (!normalizedGroupName) {
      toast.error('Enter a group name first');
      return;
    }

    setIsSavingGroup(true);
    try {
      const updates = customers.map((customer) => {
        const currentGroups = customer.customerGroups || [];
        const shouldInclude = selectedGroupMembers.includes(customer.id);
        const nextGroups = shouldInclude
          ? Array.from(new Set([...currentGroups, normalizedGroupName]))
          : currentGroups.filter((group) => group !== normalizedGroupName);

        if (nextGroups.join('|') === currentGroups.join('|')) {
          return null;
        }

        return api.updateCustomer(customer.id, { customerGroups: nextGroups });
      });

      await Promise.all(updates.filter(Boolean));

      const refreshedCustomers = await api.getCustomers();
      setCustomers(refreshedCustomers);
      setSelectedAudience(`group:${normalizedGroupName}`);
      toast.success(`Saved group "${normalizedGroupName}"`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save customer group');
    } finally {
      setIsSavingGroup(false);
    }
  };

  const saveDraft = async () => {
    if (!campaignName.trim()) {
      toast.error('Campaign name is required');
      return;
    }

    try {
      setIsSubmitting(true);
      const created = await api.createCampaign({
        name: campaignName.trim(),
        type: 'PROMOTION',
        startDate: new Date(`${scheduledDate}T${scheduledTime}:00`).toISOString(),
        status: 'DRAFT',
        targetAudience: {
          key: activeAudience.key,
          label: activeAudience.label,
          groupName: activeAudience.groupName,
          customerIds: activeAudience.customerIds,
        },
        actions: { channel: 'WHATSAPP', message },
      });
      setCampaigns((prev) => [created, ...prev]);
      toast.success('Campaign saved as draft');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save campaign');
    } finally {
      setIsSubmitting(false);
    }
  };

  const launchCampaign = async () => {
    if (!campaignName.trim()) {
      toast.error('Campaign name is required');
      return;
    }

    if (!activeAudience?.customerIds?.length) {
      toast.error('No customers found in the selected audience');
      return;
    }

    try {
      setIsSubmitting(true);
      const created = await api.createCampaign({
        name: campaignName.trim(),
        type: 'PROMOTION',
        startDate: new Date(`${scheduledDate}T${scheduledTime}:00`).toISOString(),
        status: 'ACTIVE',
        targetAudience: {
          key: activeAudience.key,
          label: activeAudience.label,
          groupName: activeAudience.groupName,
          customerIds: activeAudience.customerIds,
        },
        actions: { channel: 'WHATSAPP', message },
        conditions: { scheduledTime },
      });
      setCampaigns((prev) => [created, ...prev]);
      toast.success(
        `Campaign scheduled for ${scheduledDate} at ${scheduledTime} to ${activeAudience.reach.toLocaleString()} customers`,
      );
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to launch campaign');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Marketing Campaigns</h1>
          <p className="mt-2 text-gray-600">
            Build promotions using real customer groups and segments.
          </p>
        </div>
        <div className="rounded-lg border border-primary-100 bg-primary-50 px-4 py-3 text-sm text-primary-800">
          {audienceOptions.filter((option) => option.source === 'manual').length} saved groups ready
        </div>
      </div>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-primary-600" />
          <h2 className="text-2xl font-semibold text-gray-900">Quick Outreach</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {quickOutreach.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={item.title}
                type="button"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="rounded-xl border border-gray-200 bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                onClick={() => applyTemplate(item)}
              >
                <div className="mb-4 flex items-center justify-between">
                  <Icon size={20} className="text-gray-700" />
                  <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                    {item.badge}
                  </span>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{item.description}</p>
              </motion.button>
            );
          })}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[2fr_1fr]">
        <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-3xl font-semibold text-gray-900">Campaign Composer</h2>
            <p className="mt-2 text-gray-600">
              Create a promotion and pick a real customer audience.
            </p>
          </div>

          <div className="space-y-6 p-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Campaign Name
              </label>
              <input
                value={campaignName}
                onChange={(event) => setCampaignName(event.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                placeholder="VIP Friday Invite"
              />
            </div>

            <div>
              <label
                htmlFor="campaignMessage"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Message Content
              </label>
              <textarea
                id="campaignMessage"
                rows={5}
                maxLength={MAX_LENGTH}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                className="w-full rounded-lg border border-gray-300 p-3 text-sm text-gray-900 outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                placeholder="e.g., Hi {name}, join us this Sunday for 20% off all brunch items!"
              />
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
                <span>Placeholders: {'{name}'}, {'{last_visit}'}, {'{favorite_dish}'}</span>
                <span>
                  {Math.max(remainingChars, 0)} / {MAX_LENGTH} characters left
                </span>
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-medium text-gray-700">Target Audience</h3>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {audienceOptions.map((audience) => (
                  <button
                    key={audience.key}
                    type="button"
                    onClick={() => setSelectedAudience(audience.key)}
                    className={`rounded-lg border px-4 py-3 text-left text-sm font-medium transition-colors ${
                      selectedAudience === audience.key
                        ? 'border-primary-600 bg-primary-600 text-white'
                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span>{audience.label}</span>
                      <span className="text-xs opacity-80">{audience.reach}</span>
                    </div>
                    <div className="mt-1 text-xs opacity-80">{audience.description}</div>
                  </button>
                ))}
              </div>

              <div className="mt-4 rounded-lg border border-primary-100 bg-primary-50 p-4">
                <div className="flex items-center gap-2 text-primary-700">
                  <Users size={16} />
                  <p className="font-semibold">
                    Reach {activeAudience?.reach?.toLocaleString?.() || 0} customers
                  </p>
                </div>
                <p className="mt-1 text-sm text-primary-700/90">
                  {activeAudience?.description}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="campaignDate"
                  className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-600"
                >
                  Date
                </label>
                <div className="relative">
                  <CalendarDays
                    size={16}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    id="campaignDate"
                    type="date"
                    value={scheduledDate}
                    onChange={(event) => setScheduledDate(event.target.value)}
                    className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm text-gray-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="campaignTime"
                  className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-600"
                >
                  Time
                </label>
                <div className="relative">
                  <Clock3
                    size={16}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    id="campaignTime"
                    type="time"
                    value={scheduledTime}
                    onChange={(event) => setScheduledTime(event.target.value)}
                    className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm text-gray-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 border-t border-gray-200 p-6 sm:grid-cols-2">
            <button
              type="button"
              onClick={saveDraft}
              disabled={isSubmitting}
              className="rounded-lg border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Save as Draft
            </button>
            <button
              type="button"
              onClick={launchCampaign}
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Send size={16} />
              Launch Campaign
            </button>
          </div>
        </section>

        <aside className="space-y-4">
          <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <Tags size={18} className="text-primary-600" />
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-700">
                Group Manager
              </h3>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Create a group and assign customers directly from this page.
            </p>

            <div className="mt-4 space-y-4">
              <div className="flex gap-2">
                <input
                  value={groupNameInput}
                  onChange={(event) => setGroupNameInput(event.target.value)}
                  placeholder="VIP List"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                />
                <button
                  type="button"
                  onClick={saveGroupMembers}
                  disabled={isSavingGroup}
                  className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSavingGroup ? 'Saving...' : 'Save'}
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {audienceOptions
                  .filter((option) => option.source === 'manual')
                  .map((option) => (
                    <button
                      key={option.key}
                      type="button"
                      onClick={() => setGroupNameInput(option.groupName || option.label)}
                      className="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-600 transition hover:border-primary-400 hover:text-primary-700"
                    >
                      {option.label}
                    </button>
                  ))}
              </div>

              <div className="max-h-80 space-y-2 overflow-y-auto rounded-lg border border-gray-200 p-3">
                {customers.length > 0 ? (
                  customers.map((customer) => {
                    const customerLabel =
                      `${customer.firstName || ''} ${customer.lastName || ''}`.trim() ||
                      customer.phone ||
                      'Customer';

                    return (
                      <label
                        key={customer.id}
                        className="flex items-center justify-between gap-3 rounded-lg px-2 py-2 transition hover:bg-gray-50"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-900">{customerLabel}</p>
                          <p className="text-xs text-gray-500">{customer.phone || 'No phone saved'}</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={selectedGroupMembers.includes(customer.id)}
                          onChange={() => toggleGroupMember(customer.id)}
                          className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                      </label>
                    );
                  })
                ) : (
                  <p className="text-sm text-gray-500">No customers available to group.</p>
                )}
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-700">
              Saved Campaigns
            </h3>
            <div className="mt-4 space-y-3">
              {loading ? (
                <p className="text-sm text-gray-500">Loading campaigns...</p>
              ) : campaigns.length > 0 ? (
                campaigns.slice(0, 5).map((campaign) => (
                  <div key={campaign.id} className="rounded-lg border border-gray-200 p-3">
                    <p className="font-semibold text-gray-900">{campaign.name}</p>
                    <p className="mt-1 text-xs uppercase tracking-wide text-gray-500">
                      {campaign.status}
                    </p>
                    <p className="mt-2 text-sm text-gray-600">
                      Audience:{' '}
                      {campaign.targetAudience?.label ||
                        campaign.targetAudience?.groupName ||
                        'Custom'}
                    </p>
                    {campaign.actions?.delivery && (
                      <p className="mt-2 text-xs text-gray-500">
                        Sent {campaign.actions.delivery.sentCount || 0} of{' '}
                        {campaign.actions.delivery.recipientCount || 0}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">
                  No campaigns yet. Create your first audience-based promotion.
                </p>
              )}
            </div>
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-700">
              Marketing Tips
            </h3>
            <div className="mt-4 divide-y divide-gray-200">
              {tips.map((tip) => (
                <details key={tip.title} className="group py-3 first:pt-0 last:pb-0" open>
                  <summary className="cursor-pointer list-none text-base font-semibold text-gray-900">
                    {tip.title}
                  </summary>
                  <p className="mt-2 text-sm leading-6 text-gray-600">{tip.body}</p>
                </details>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-blue-100 bg-blue-50 p-5">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-white p-2 text-blue-600">
                <Star size={18} />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Group-driven outreach</p>
                <p className="mt-1 text-sm text-gray-600">
                  Build lists on the Customers page first, then select those groups here when sending promotions.
                </p>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
