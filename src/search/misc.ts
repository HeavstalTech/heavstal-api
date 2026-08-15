// src/search/misc.ts
import { AUTHOR, GenericDataResult, HeavstalConfig } from '../types';
import { heavstalFetch } from '../fetcher';

export const github = async (username: string, config?: HeavstalConfig): Promise<GenericDataResult> => {
  const apiData = await heavstalFetch('github-info', { username }, config);
  return { author: AUTHOR, status: true, data: apiData };
};

export const tiktokInfo = async (username: string, config?: HeavstalConfig): Promise<GenericDataResult> => {
  const apiData = await heavstalFetch('tiktok-info', { username }, config);
  return { author: AUTHOR, status: true, data: apiData };
};

export const weather = async (city: string, config?: HeavstalConfig): Promise<GenericDataResult> => {
  const apiData = await heavstalFetch('weather', { city }, config);
  return { author: AUTHOR, status: true, data: apiData };
};

export const metadata = async (url: string, config?: HeavstalConfig): Promise<GenericDataResult> => {
  const apiData = await heavstalFetch('metadata', { url }, config);
  return { author: AUTHOR, status: true, data: apiData };
};
