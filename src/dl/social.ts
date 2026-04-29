import { AUTHOR, SocialResult, HeavstalConfig } from '../types';
import { heavstalFetch } from '../fetcher';

export const fbdl = async (url: string, config?: HeavstalConfig): Promise<SocialResult[]> => {
  const apiData = await heavstalFetch('facebook', { url }, config);
  
  return apiData.map((item: any) => ({
    author: AUTHOR,
    status: true,
    type: item.type || 'video',
    title: item.title,
    thumbnail: item.thumbnail,
    url: item.url
  }));
};

export const igdl = async (url: string, config?: HeavstalConfig): Promise<SocialResult[]> => {
  const apiData = await heavstalFetch('instagram', { url }, config);

  return apiData.map((item: any) => ({
    author: AUTHOR,
    status: true,
    type: item.type, // 'video' or 'image'
    thumbnail: item.thumbnail,
    url: item.url
  }));
};
