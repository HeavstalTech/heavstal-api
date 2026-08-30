// src/tv/index.ts
import { heavstalFetch } from '../fetcher';
import { HeavstalConfig, TVSearchResult, TVGetResult, TVScheduleResult } from '../types';
import { AUTHOR } from '../types';

export async function search(query: string, config?: HeavstalConfig): Promise<TVSearchResult> {
  const data = await heavstalFetch('tv/search', { query }, config);
  return { author: AUTHOR, status: true, ...data };
}

export async function get(id: number | string, config?: HeavstalConfig): Promise<TVGetResult> {
  const data = await heavstalFetch('tv/get', { id }, config);
  return { author: AUTHOR, status: true, data };
}

export async function schedule(country?: string, date?: string, config?: HeavstalConfig): Promise<TVScheduleResult> {
  const data = await heavstalFetch('tv/schedule', { country, date }, config);
  return { author: AUTHOR, status: true, ...data };
}
