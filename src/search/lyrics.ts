import { AUTHOR, LyricsResult, HeavstalConfig } from '../types';
import { heavstalFetch } from '../fetcher';

export const lyrics = async (query: string, config?: HeavstalConfig): Promise<LyricsResult> => {
  const apiData = await heavstalFetch('lyrics', { query }, config);
  
  return {
    author: AUTHOR,
    status: true,
    title: apiData.title,
    artist: apiData.artist,
    image: apiData.image || "https://ibb.co/fVyg0TN6",
    url: apiData.url,
    lyrics: apiData.lyrics
  };
};
