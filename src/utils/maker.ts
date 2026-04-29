import { HeavstalConfig } from '../types';
import { heavstalFetch } from '../fetcher';

export const ephoto = async (style: string, text: string, config?: HeavstalConfig): Promise<string> => {
  const apiData = await heavstalFetch('ephoto', { style, text }, config);
  return apiData.url
}
