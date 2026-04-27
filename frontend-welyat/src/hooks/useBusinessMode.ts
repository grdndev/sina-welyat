import { useState, useEffect } from 'react';
import { api } from '../api/client';

export interface BusinessMode {
  id: number;
  mode_name: string;
  free_duration_minutes: number;
  price_per_minute_client: number;
  earn_per_minute_listener: number;
  xp_per_minutes: number;
  timeout_matching: number;
  is_active: boolean;
}

interface InfoData {
  mode: BusinessMode;
  total_tech_fees: number;
}

interface CachedInfo {
  mode: BusinessMode;
  totalTechFees: number;
}

let cache: CachedInfo | null = null;
let pending: Promise<CachedInfo> | null = null;

function fetchInfo(): Promise<CachedInfo> {
  if (cache) return Promise.resolve(cache);
  if (!pending) {
    pending = api.get<InfoData>('/info').then((data) => {
      cache = { mode: data.mode, totalTechFees: data.total_tech_fees };
      pending = null;
      return cache;
    });
  }
  return pending;
}

export function useBusinessMode() {
  const [info, setInfo] = useState<CachedInfo | null>(cache);

  useEffect(() => {
    if (cache) return;
    fetchInfo().then(setInfo).catch(() => {});
  }, []);

  return info;
}
