import { AUTHOR, SocialResult, HeavstalConfig } from '../types';

async function fetchFromBackend(endpoint: string, url: string, config?: HeavstalConfig): Promise<SocialResult[]> {
  const apiKey = config?.apiKey || process.env.HEAVSTAL_API_KEY;

  if (!apiKey) {
    throw new Error("Missing API Key. Please provide it in the function options or set 'HEAVSTAL_API_KEY' in your environment variables.");
  }

  try {
    const response = await fetch(`https://heavstal.com.ng/api/v1/${endpoint}`, {
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
      throw new Error(`Heavstal API Error: ${serverMsg} - ${responseData?.details || ''}`);
    }

    // Map the array of results back to the SDK format
    return responseData.data.map((item: any) => ({
      author: AUTHOR,
      status: true,
      type: item.type,
      title: item.title,
      thumbnail: item.thumbnail,
      url: item.url
    }));

  } catch (error: any) {
    throw new Error(error.message);
  }
}

/**
 * Facebook Video Downloader
 */
export const fbdl = async (url: string, config?: HeavstalConfig): Promise<SocialResult[]> => {
  return fetchFromBackend('facebook', url, config);
};

/**
 * Instagram Downloader
 */
export const igdl = async (url: string, config?: HeavstalConfig): Promise<SocialResult[]> => {
  return fetchFromBackend('instagram', url, config);
};
