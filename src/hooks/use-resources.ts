'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { VIP_USERS } from '@/lib/constants';
import type { Resource } from '@/lib/db/schema';

interface UseResourcesFilters {
  tab: string;
  subject: string;
  type: string;
  search: string;
}

export function useResources(filters: UseResourcesFilters) {
  const [items, setItems] = useState<Resource[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const requestIdRef = useRef(0);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (filters.subject !== 'all') params.set('subject', filters.subject);
    if (filters.type !== 'all') params.set('type', filters.type);
    if (filters.search) params.set('search', filters.search);
    if (filters.tab !== 'all') {
      const vip = VIP_USERS.find((user) => user.id === filters.tab);
      if (vip) params.set('uploader', vip.nickname);
    }
    params.set('sort', 'newest');
    return params.toString();
  }, [filters.search, filters.subject, filters.tab, filters.type]);

  const fetchItems = useCallback(async (signal?: AbortSignal) => {
    const requestId = ++requestIdRef.current;
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/resources${queryString ? `?${queryString}` : ''}`, { signal });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || '璧勬枡鍒楄〃鍔犺浇澶辫触');
      }

      if (requestId === requestIdRef.current) {
        setItems(Array.isArray(data?.items) ? data.items : []);
        setTotal(typeof data?.total === 'number' ? data.total : 0);
      }
    } catch (error) {
      if (signal?.aborted) return;
      if (requestId === requestIdRef.current) {
        setError(error instanceof Error ? error.message : '璧勬枡鍒楄〃鍔犺浇澶辫触');
      }
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, [queryString]);

  useEffect(() => {
    const controller = new AbortController();
    fetchItems(controller.signal);
    return () => controller.abort();
  }, [fetchItems]);

  return {
    error,
    items,
    loading,
    reload: () => fetchItems(),
    total,
  };
}
