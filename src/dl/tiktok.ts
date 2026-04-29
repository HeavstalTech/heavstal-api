import { AUTHOR, TikTokResult, HeavstalConfig } from '../types';
import { heavstalFetch } from '../fetcher';

export const tiktok = async (input: string, config?: HeavstalConfig): Promise<TikTokResult> => {
  const apiData = await heavstalFetch('tiktok', { url: input, query: input }, config);
  
  return {
    author: AUTHOR,
    status: true,
    title: apiData.title,
    author_name: apiData.author,
    cover: apiData.cover,
    no_watermark: apiData.video_nowm,
    music: apiData.audio,
    views: apiData.stats?.views,
    likes: apiData.stats?.likes,
    shares: apiData.stats?.shares,
    downloads: apiData.stats?.downloads
  };
};

export const tiktokSlide = async (url: string, config?: HeavstalConfig): Promise<TikTokResult> => {
  try {
    const apiData = await heavstalFetch('tiktok-slide', { url }, config);

    return {
      author: AUTHOR,
      status: true,
      uniqueId: apiData.uniqueId,
      title: apiData.title,
      profileImage: apiData.profileImage,
      profileUrl: apiData.profileUrl,
      hashtags: apiData.hashtags,
      likes: apiData.likes,
      comments: apiData.comments,
      shares: apiData.shares,
      downloads: apiData.downloads,
      views: apiData.views,
      slideImages: apiData.images 
    };
  } catch (error: any) {
    if (error.message.includes('Heavstal') || error.message.includes('Auth') || error.message.includes('Rate Limit')) {
        throw error;
    }
    return {
      author: AUTHOR,
      status: false,
      title: "Error",
      views: error.message
    } as TikTokResult;
  }
};
