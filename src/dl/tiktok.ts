import { AUTHOR, TikTokResult, HeavstalConfig } from '../types';
import axios from 'axios'
import * as cheerio from 'cheerio'

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

    // Parse the JSON response first to see if the server returned custom error details
    let responseData;
    try {
      responseData = await response.json();
    } catch {
      throw new Error(`Server returned a non-JSON response with status: ${response.status}`);
    }

    // Handle HTTP errors manually (fetch doesn't throw on 4xx/5xx like Axios does)
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

    // Map your API response back into the SDK TypeScript format
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
    // If it's already an error we formatted above, rethrow it
    if (error.message.includes('Heavstal') || error.message.includes('Auth') || error.message.includes('Rate Limit')) {
        throw error;
    }
    // Otherwise, it was a fundamental network failure (e.g. DNS issue, no internet)
    throw new Error(`Network Error: Could not reach Heavstal servers. Details: ${error.message}`);
  }
};

/**
 * TikTok Slide Downloader
 */
export const tiktokSlide = async (url: string): Promise<TikTokResult> => {
  try {
    const response = await axios.post("https://api.ttsave.app/", {
      id: url,
      hash: '1e3a27c51eb6370b0db6f9348a481d69',
      mode: 'slide',
      locale: 'en',
      loading_indicator_url: 'https://ttsave.app/images/slow-down.gif',
      unlock_url: 'https://ttsave.app/en/unlock'
    }, {
      headers: getRandomHeaders()
    });

    const $ = cheerio.load(response.data);
    const $element = $('div.flex.flex-col.items-center.justify-center.mt-2.mb-5');
    if ($element.length === 0) throw new Error("Slide not found or service unavailable");
    const statsDiv = $element.find('div.flex.flex-row.items-center.justify-center');
    return {
      author: AUTHOR,
      status: true,
      uniqueId: $element.find('input#unique-id').attr('value'),
      title: $element.find('div.flex.flex-row.items-center.justify-center h2').text().trim(),
      profileImage: $element.find('a').first().find('img').attr('src'),
      profileUrl: $element.find('a').first().attr('href'),
      hashtags: $element.find('p.text-gray-600').text().split(' ').filter(Boolean),
      likes: statsDiv.eq(0).find('span').text().trim(),
      comments: statsDiv.eq(1).find('span').text().trim(),
      shares: statsDiv.eq(2).find('span').text().trim(),
      downloads: statsDiv.eq(3).find('span').text().trim(),
      views: statsDiv.eq(4).find('span').text().trim()
    };
  } catch (error: any) {
     return {
        author: AUTHOR,
        status: false,
        title: "Error",
        views: error.message
     } as TikTokResult;
  }
};
