// YouTube.ts
// © Heavstal Tech™
//
import ytdl from '@distube/ytdl-core';
import yts from 'yt-search';
import crypto from 'crypto';
import { AUTHOR, YouTubeResult, YouTubeSearchResult } from '../types';

// Fallback Api
var BASE = "https://embed.dlsrv.online";
var FP = "edacb371e53d99bcdf84a2d97381139625d3d2cef69f912ba296e78247233c68";

function buildHeaders(videoId: string, extra: Record<string, string> = {}) {
  return {
    "Content-Type": "application/json",
    "Origin": BASE,
    "Referer": `${BASE}/v1/full?videoId=${videoId}`,
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36",
    "accept": "*/*",
    "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
    "sec-fetch-site": "same-origin",
    "sec-fetch-mode": "cors",
    "sec-fetch-dest": "empty",
    "sec-ch-ua": '"Google Chrome";v="147", "Not.A/Brand";v="8", "Chromium";v="147"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
    ...extra
  };
}

async function fallbackRequest(path: string, videoId: string, body: any, extra?: Record<string, string>) {
  const res = await fetch(BASE + path, {
    method: "POST",
    headers: buildHeaders(videoId, extra),
    body: JSON.stringify(body),
  });

  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`${path} returned unexpected response: ${text.slice(0, 150)}`);
  }
}

async function fallbackFetchInfo(videoId: string) {
  const res = await fallbackRequest("/api/info", videoId, { videoId });
  if (!res.info) throw new Error(JSON.stringify(res));
  return res.info;
}

async function fallbackFetchToken(videoId: string) {
  const res = await fallbackRequest("/api/verify", videoId, { fp: FP });
  if (!res.token) throw new Error(JSON.stringify(res));
  return res.token;
}

async function fallbackSign(videoId: string, token: string) {
  const ts = Date.now().toString();
  const key = token.slice(-32);
  const sig = crypto.createHmac("sha256", key).update(`${ts}:${videoId}`).digest("hex");
  return { ts, sig };
}

async function fallbackFetchDownloadUrl(videoId: string, format: "mp3" | "mp4", quality: string, token: string) {
  const { ts, sig } = await fallbackSign(videoId, token);
  const path = format === "mp4" ? "/api/download/mp4" : "/api/download/mp3";

  const res = await fallbackRequest(path, videoId, { videoId, format, quality }, {
    "Authorization": `Bearer ${token}`,
    "x-fp": FP,
    "x-ts": ts,
    "x-sig": sig,
  });

  if (!res.url) throw new Error(JSON.stringify(res));
  return res;
}

// Main Fallback Handler
async function runFallback(videoId: string, format: "mp3" | "mp4"): Promise<YouTubeResult> {
  const info = await fallbackFetchInfo(videoId);
  const token = await fallbackFetchToken(videoId);
  
  const quality = format === "mp4" ? "720" : "320"; // Sensible defaults
  const { url } = await fallbackFetchDownloadUrl(videoId, format, quality, token);

  return {
    author: AUTHOR,
    title: info.title || "Unknown Title",
    thumbnail: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
    channel: info.author || "Unknown Channel",
    published: "Unknown", 
    views: 0,
    duration: 0,
    url: url
  };
}


// ytSearch
export const search = async (query: string): Promise<YouTubeSearchResult[]> => {
  try {
    const result = await yts(query);
    if (!result.all || result.all.length === 0) {
      throw new Error("No results found on YouTube.");
    }
    
    return result.all.map((item: any) => ({
      type: item.type as 'video' | 'channel' | 'list' | 'live',
      url: item.url,
      title: item.title,
      description: item.description,
      image: item.image,
      thumbnail: item.thumbnail,
      seconds: item.seconds,
      timestamp: item.timestamp,
      views: item.views,
      ago: item.ago,
      author: item.author ? {
        name: item.author.name,
        url: item.author.url
      } : undefined
    }));
  } catch (error: any) {
    throw { message: error.message || "YouTube Search Failed" };
  }
};


// ytdl (mp3) // ytmp3
export const ytmp3 = async (rl: string): Promise<YouTubeResult> => {
  if (!ytdl.validateURL(url)) throw { author: AUTHOR, status: false, message: "Invalid YouTube URL" };
  const videoId = ytdl.getURLVideoID(url);

  try {
    const info = await ytdl.getInfo(url);
    const format = ytdl.chooseFormat(info.formats, { 
      quality: 'highestaudio',
      filter: 'audioonly' 
    });
    if (!format) throw new Error("No audio stream found");

    return {
      author: AUTHOR,
      title: info.videoDetails.title,
      thumbnail: info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1].url,
      channel: info.videoDetails.ownerChannelName,
      published: info.videoDetails.publishDate,
      views: Number(info.videoDetails.viewCount),
      duration: Number(info.videoDetails.lengthSeconds),
      url: format.url
    };
  } catch (error: any) {
    const msg = error.message?.toLowerCase() || "";
    if (msg.includes("!res.ok") || msg.includes("sign in") || msg.includes("bot") || msg.includes("stream")) {
      try {
        return await runFallback(videoId, "mp3");
      } catch (fallbackError: any) {
        throw { author: AUTHOR, status: false, message: `ytdl and fallback both failed: ${fallbackError.message}` };
      }
    }
    throw { author: AUTHOR, status: false, message: error.message || "YouTube MP3 Failed" };
  }
};


// ytdl (mp4) // ytmp4
export const ytmp4 = async (url: string): Promise<YouTubeResult> => {
  if (!ytdl.validateURL(url)) throw { author: AUTHOR, status: false, message: "Invalid YouTube URL" };
  const videoId = ytdl.getURLVideoID(url);

  try {
    const info = await ytdl.getInfo(url);
    const format = ytdl.chooseFormat(info.formats, { 
      quality: 'highest',
      filter: (f) => f.hasAudio === true && f.hasVideo === true && f.container === 'mp4'
    });
    
    const finalFormat = format || ytdl.chooseFormat(info.formats, { 
      quality: 'highest',
      filter: (f) => f.hasAudio === true && f.hasVideo === true
    });
    
    if (!finalFormat) throw new Error("No video stream found");

    return {
      author: AUTHOR,
      title: info.videoDetails.title,
      thumbnail: info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1].url,
      channel: info.videoDetails.ownerChannelName,
      published: info.videoDetails.publishDate,
      views: Number(info.videoDetails.viewCount),
      duration: Number(info.videoDetails.lengthSeconds),
      url: finalFormat.url
    };
  } catch (error: any) {
    const msg = error.message?.toLowerCase() || "";
    if (msg.includes("!res.ok") || msg.includes("sign in") || msg.includes("bot") || msg.includes("stream")) {
      try {
        return await runFallback(videoId, "mp4");
      } catch (fallbackError: any) {
        throw { author: AUTHOR, status: false, message: `ytdl and fallback both failed: ${fallbackError.message}` };
      }
    }
    throw { author: AUTHOR, status: false, message: error.message || "YouTube MP4 Failed" };
  }
};


// ytSearch + ytmp3 (play - simplified for bot developers)
export const play = async (query: string, type: 'mp3' | 'mp4' = 'mp3'): Promise<YouTubeResult> => {
  try {
    const searchResults = await yts(query);
    const videos = searchResults.all.filter((v: any) => v.type === 'video');
    
    if (videos.length === 0) {
      throw new Error(`No video results found for: ${query}`);
    }
    
    const firstVideo = videos[0];
    if (type === 'mp4') {
      return await ytmp4(firstVideo.url);
    } else {
      return await ytmp3(firstVideo.url);
    }
  } catch (error: any) {
    throw new Error(`Play Failed: ${error.message}`);
  }
};
