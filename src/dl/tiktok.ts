import { AUTHOR, TikTokResult, HeavstalConfig } from '../types';

/**
 * Main TikTok Function (SDK Wrapper)
 * Supports: URL Download & Search Query
 */
export const tiktok = async (input: string, config?: HeavstalConfig): Promise<TikTokResult> => {
  const apiKey = config?.apiKey || process.env.HEAVSTAL_API_KEY;

  if (!apiKey) {
    throw new Error("Missing API Key. Please provide it in the function options or set 'HEAVSTAL_API_KEY' in your environment variables. Get your key at: https://heavstal.com.ng/credentials");
  }

  try {
    const response = await fetch("https://heavstal.com.ng/api/v1/tiktok", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey
      },
      body: JSON.stringify({ url: input, query: input })
    });
    
    let responseData;
    try {
      responseData = await response.json();
    } catch {
      throw new Error(`Server returned a non-JSON response with status: ${response.status}`);
    }
    
    if (!response.ok) {
      const serverMsg = responseData?.error || "Unknown Error";
      const serverDetails = responseData?.details || "";
      
      if (response.status === 429) {
        throw new Error(`Rate Limit Exceeded (${serverMsg}). Upgrade plan at https://heavstal.com.ng/pricing`);
      }
      if (response.status === 401 || response.status === 403) {
        throw new Error(`Auth Failed (${serverMsg}). Check your API Key.`);
      }
      
      throw new Error(`Heavstal API Error: ${serverMsg} ${serverDetails ? `- ${serverDetails}` : ''}`);
    }

    const apiData = responseData.data;
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

  } catch (error: any) {
    if (error.message.includes('Heavstal') || error.message.includes('Auth') || error.message.includes('Rate Limit')) {
        throw error;
    }
    throw new Error(`Network Error: Could not reach Heavstal servers. Details: ${error.message}`);
  }
};

/**
 * TikTok Slide Downloader (SDK Wrapper)
 */
export const tiktokSlide = async (url: string, config?: HeavstalConfig): Promise<TikTokResult> => {
  const apiKey = config?.apiKey || process.env.HEAVSTAL_API_KEY;

  if (!apiKey) {
    throw new Error("Missing API Key. Please provide it in the function options or set 'HEAVSTAL_API_KEY' in your environment variables.");
  }

  try {
    const response = await fetch("https://heavstal.com.ng/api/v1/tiktok-slide", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey
      },
      body: JSON.stringify({ url })
    });

    let responseData;
    try { responseData = await response.json(); } catch { throw new Error(`Server Error: ${response.status}`); }

    if (!response.ok) {
      const serverMsg = responseData?.error || "Unknown Error";
      if (response.status === 429) throw new Error(`Rate Limit Exceeded (${serverMsg}).`);
      if (response.status === 401 || response.status === 403) throw new Error(`Auth Failed (${serverMsg}).`);
      throw new Error(`Heavstal API Error: ${serverMsg}`);
    }

    const apiData = responseData.data;

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
