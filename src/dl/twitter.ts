import { AUTHOR, TwitterResult, HeavstalConfig } from '../types';
import { heavstalFetch } from '../fetcher';

export const twitter = async (url: string, config?: HeavstalConfig): Promise<TwitterResult> => {
  const apiData = await heavstalFetch('twitter', { url }, config);
  
  return {
    author: AUTHOR,
    status: true,
    desc: apiData.description,
    thumbnail: apiData.thumbnail,
    video_hd: apiData.video_hd,
    video_sd: apiData.video_sd,
    audio: apiData.audio
  };
};
