//src/dl/mediafire.ts
import { AUTHOR, GenericDataResult, HeavstalConfig } from '../types';
import { heavstalFetch } from '../fetcher';

export const mediafire = async (url: string, config?: HeavstalConfig): Promise<GenericDataResult> => {
  const apiData = await heavstalFetch('mediafire', { url }, config);
  return { author: AUTHOR, status: true, data: apiData };
};
