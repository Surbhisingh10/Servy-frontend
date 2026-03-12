import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

interface Customer {
  id: string;
  firstName?: string;
  lastName?: string;
  phone: string;
  email?: string;
  customerGroups?: string[];
  totalVisits: number;
  lifetimeSpend: number;
  lastVisitDate?: string;
}

export function useCustomers(search?: string, page: number = 1, limit: number = 20) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const data = await api.getCustomers();
        
        // Client-side filtering and pagination
        let filtered = data;
        if (search) {
          const searchLower = search.toLowerCase();
          filtered = data.filter(
            (customer: Customer) =>
              customer.phone.toLowerCase().includes(searchLower) ||
              customer.email?.toLowerCase().includes(searchLower) ||
              customer.firstName?.toLowerCase().includes(searchLower) ||
              customer.lastName?.toLowerCase().includes(searchLower) ||
              customer.customerGroups?.some((group) =>
                group.toLowerCase().includes(searchLower),
              )
          );
        }

        setTotal(filtered.length);
        const start = (page - 1) * limit;
        const end = start + limit;
        setCustomers(filtered.slice(start, end));
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load customers');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [search, page, limit]);

  return {
    customers,
    loading,
    error,
    total,
    totalPages: Math.ceil(total / limit),
  };
}
