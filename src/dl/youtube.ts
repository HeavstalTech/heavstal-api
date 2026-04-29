import { AUTHOR, YouTubeResult, YouTubeSearchResult, HeavstalConfig } from '../types';
import { heavstalFetch } from '../fetcher';

export const search = async (query: string, config?: HeavstalConfig): Promise<YouTubeSearchResult[]> => {
  const apiData = await heavstalFetch('youtube', { type: 'search', query }, config);
  
  return apiData.map((item: any) => ({
    type: item.type,
    url: item.url,
    title: item.title,
    description: item.description,
    image: item.image,
    thumbnail: item.thumbnail,
    seconds: item.seconds,
    timestamp: item.timestamp,
    views: item.views,
    ago: item.ago,
    author: item.author
  }));
};

export const ytmp3 = async (url: string, config?: HeavstalConfig): Promise<YouTubeResult> => {
  const apiData = await heavstalFetch('youtube', { type: 'ytmp3', url }, config);
  
  return {
    author: AUTHOR,
    title: apiData.title,
    thumbnail: apiData.thumbnail,
    channel: apiData.channel,
    published: apiData.published,
    views: apiData.views,
    duration: apiData.duration,
    url: apiData.url,
    status: true
  };
};

export const ytmp4 = async (url: string, config?: HeavstalConfig): Promise<YouTubeResult> => {
  const apiData = await heavstalFetch('youtube', { type: 'ytmp4', url }, config);
  
  return {
    author: AUTHOR,
    title: apiData.title,
    thumbnail: apiData.thumbnail,
    channel: apiData.channel,
    published: apiData.published,
    views: apiData.views,
    duration: apiData.duration,
    url: apiData.url,
    status: true
  };
};

export const play = async (query: string, format: 'mp3' | 'mp4' = 'mp3', config?: HeavstalConfig): Promise<YouTubeResult> => {
  const apiData = await heavstalFetch('youtube', { type: 'play', query, format }, config);
  
  return {
    author: AUTHOR,
    title: apiData.title,
    thumbnail: apiData.thumbnail,
    channel: apiData.channel,
    published: apiData.published,
    views: apiData.views,
    duration: apiData.duration,
    url: apiData.url,
    status: true
  };
};
