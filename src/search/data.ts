// src/search/data.ts
import { AUTHOR, DataArrayResult, HeavstalConfig } from '../types';
import { heavstalFetch } from '../fetcher';

export const hackerNews = async (config?: HeavstalConfig): Promise<DataArrayResult> => {
  const apiData = await heavstalFetch('hacker-news', {}, config);
  return { author: AUTHOR, status: true, data: apiData };
};

export const crypto = async (limit?: number, symbol?: string, config?: HeavstalConfig): Promise<DataArrayResult> => {
  const apiData = await heavstalFetch('crypto', { limit, symbol }, config);
  return { author: AUTHOR, status: true, data: apiData };
};

export const webSearch = async (url: string | string[], summarize?: boolean, config?: HeavstalConfig): Promise<DataArrayResult> => {
  const apiData = await heavstalFetch('web-search', { url, summarize }, config);
  return { author: AUTHOR, status: true, data: apiData };
};
