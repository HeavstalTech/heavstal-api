import { heavstalFetch } from '../fetcher';
import { HeavstalConfig, RemoveBgResult, AUTHOR } from '../types';

export async function removeBg(imageUrl: string, config?: HeavstalConfig): Promise<RemoveBgResult> {
  const data = await heavstalFetch('remove-bg', { imageUrl }, config);
  return { author: AUTHOR, status: true, ...data };
}
