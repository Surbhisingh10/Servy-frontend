'use client';

import Image from 'next/image';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth-store';
import { Loader2, QrCode, Copy, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface QrCodeItem {
  id: string;
  code: string;
  tableNumber: string;
  tableName?: string;
  isActive: boolean;
  createdAt: string;
}

function normalizeForCode(value: string) {
  return value
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function QrCodesPage() {
  const { user } = useAuthStore();
  const [restaurantSlug, setRestaurantSlug] = useState('');
  const [qrCodes, setQrCodes] = useState<QrCodeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [tableNumber, setTableNumber] = useState('');
  const [tableName, setTableName] = useState('');
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.restaurantId) return;

      try {
        setLoading(true);
        const [restaurant, qrs] = await Promise.all([
          api.getRestaurant(user.restaurantId),
          api.getQrCodes(),
        ]);
        setRestaurantSlug(restaurant?.slug || '');
        setQrCodes(qrs);
      } catch (error: any) {
        toast.error(error?.message || 'Failed to load QR codes');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.restaurantId]);

  const createQrCode = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!restaurantSlug) {
      toast.error('Restaurant slug not found');
      return;
    }

    if (!tableNumber.trim()) {
      toast.error('Table number is required');
      return;
    }

    const normalizedTable = normalizeForCode(tableNumber);
    const payload = {
      code: `${restaurantSlug.toUpperCase()}-${normalizedTable}`,
      tableNumber: tableNumber.trim(),
      tableName: tableName.trim() || undefined,
    };

    try {
      setSubmitting(true);
      const created = await api.createQrCode(payload);
      setQrCodes((prev) => [created, ...prev]);
      setTableNumber('');
      setTableName('');
      toast.success('QR code created');
    } catch (error: any) {
      toast.error(error?.message || 'Failed to create QR code');
    } finally {
      setSubmitting(false);
    }
  };

  const rows = useMemo(() => {
    return qrCodes.map((item) => {
      const menuUrl = `${origin}/restaurant/${restaurantSlug}/menu?table=${encodeURIComponent(
        item.tableNumber,
      )}&qr=${encodeURIComponent(item.code)}`;
      const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
        menuUrl,
      )}`;
      return { ...item, menuUrl, qrImageUrl };
    });
  }, [qrCodes, restaurantSlug, origin]);

  const copyToClipboard = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success('Copied');
    } catch {
      toast.error('Copy failed');
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="animate-spin text-primary-600" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">QR Codes</h1>
        <p className="mt-2 text-gray-600">
          Create table QR codes. Scanning opens this restaurant&apos;s menu directly.
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <form onSubmit={createQrCode} className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Input
            label="Table Number"
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
            placeholder="1, A1, Patio-2"
            required
          />
          <Input
            label="Table Name (optional)"
            value={tableName}
            onChange={(e) => setTableName(e.target.value)}
            placeholder="Window Table"
          />
          <div className="flex items-end">
            <Button type="submit" className="w-full" isLoading={submitting}>
              Create QR
            </Button>
          </div>
        </form>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
          <QrCode className="mx-auto mb-3 text-gray-400" size={30} />
          <p className="text-gray-600">No QR codes yet. Create your first table QR code.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {rows.map((item) => (
            <article key={item.id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Table {item.tableNumber}
                  </h2>
                  <p className="text-sm text-gray-500">{item.tableName || item.code}</p>
                </div>
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${
                    item.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {item.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="mb-3 flex justify-center rounded-lg bg-gray-50 p-4">
                <Image
                  src={item.qrImageUrl}
                  alt={`QR code for table ${item.tableNumber}`}
                  width={220}
                  height={220}
                  unoptimized
                  className="h-[220px] w-[220px]"
                />
              </div>

              <div className="rounded-md border border-gray-200 bg-gray-50 p-2">
                <p className="truncate text-xs text-gray-600">{item.menuUrl}</p>
              </div>

              <div className="mt-3 flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => copyToClipboard(item.menuUrl)}
                >
                  <Copy size={16} className="mr-2" />
                  Copy URL
                </Button>
                <a
                  href={item.qrImageUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex flex-1 items-center justify-center rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <Download size={16} className="mr-2" />
                  Download
                </a>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
