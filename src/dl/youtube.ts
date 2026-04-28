// youtube.ts
// © Heavstal Tech™
// modify before re-use - bugs may occur

import ytdl from '@distube/ytdl-core';
import yts from 'yt-search';
import crypto from 'crypto';
import { AUTHOR, YouTubeResult, HeavstalConfig, YouTubeSearchResult } from '../types'
import { verifyApiKey } from '../../auth'

var BASE = "https://embed.dlsrv.online";
var FP = "edacb371e53d99bcdf84a2d97381139625d3d2cef69f912ba296e78247233c68";

function buildHeaders(videoId: string, extra: Record<string, string> = {}) {
  return {
    "Content-Type": "application/json",
    "Origin": BASE,
    "Referer": `${BASE}/v1/full?videoId=${videoId}`,
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "accept": "*/*",
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
  try { return JSON.parse(text); } 
  catch { throw new Error(`${path} returned unexpected response`); }
}

async function runDlsrvFallback(videoId: string, format: "mp3" | "mp4"): Promise<YouTubeResult> {
  const info = await fallbackRequest("/api/info", videoId, { videoId }).then(r => r.info);
  const token = await fallbackRequest("/api/verify", videoId, { fp: FP }).then(r => r.token);
  if (!info || !token) throw new Error("DLSRV failed");

  const ts = Date.now().toString();
  const sig = crypto.createHmac("sha256", token.slice(-32)).update(`${ts}:${videoId}`).digest("hex");
  const path = format === "mp4" ? "/api/download/mp4" : "/api/download/mp3";

  const res: any = await fallbackRequest(path, videoId, { videoId, format, quality: format === "mp4" ? "720" : "320" }, {
    "Authorization": `Bearer ${token}`, "x-fp": FP, "x-ts": ts, "x-sig": sig,
  });

  if (!res.url) throw new Error("DLSRV URL generation failed");

  return {
    author: AUTHOR,
    title: info.title || "Unknown Title",
    thumbnail: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
    channel: info.author || "Unknown Channel",
    published: "Unknown", 
    views: "0", 
    duration: "0",
    url: res.url
  };
}

async function fetchVreden(url: string, type: 'mp3' | 'mp4'): Promise<string> {
  const res: any = await (await fetch(`https://api.vreden.my.id/api/yt${type}?url=${encodeURIComponent(url)}`)).json();
  if (!res?.result?.download?.url) throw new Error("Vreden failed");
  return res.result.download.url;
}

async function fetchKyyOkatsu(url: string, type: 'mp3' | 'mp4'): Promise<string> {
  const res: any = await (await fetch(`https://kyyokatsurestapi.my.id/downloader/yt${type}?url=${encodeURIComponent(url)}`)).json();
  const dlUrl = type === 'mp3' ? res?.dl : res?.result?.mp4;
  if (!dlUrl) throw new Error("KyyOkatsu failed");
  return dlUrl;
}

async function fetchKord(url: string, type: 'mp3' | 'mp4'): Promise<string> {
  if (type === 'mp3') {
    const res: any = await (await fetch(`https://api.kord.live/api/yt-song?url=${encodeURIComponent(url)}`)).json();
    if (!res?.url) throw new Error("Kord mp3 failed");
    return res.url;
  } else {
    const res: any = await (await fetch(`https://api.kord.live/api/ytdl?url=${encodeURIComponent(url)}`)).json();
    const dlUrl = res?.videos?.find((v: any) => v.urls?.length)?.urls?.[0];
    if (!dlUrl) throw new Error("Kord mp4 failed");
    return dlUrl;
  }
}

async function fetchPrexzy(url: string, type: 'mp3' | 'mp4'): Promise<string> {
  const res: any = await (await fetch(`https://apis.prexzyvilla.site/download/ytdownload?url=${encodeURIComponent(url)}&type=${type === 'mp3' ? 'audio' : 'video'}`)).json();
  if (!res?.download_url) throw new Error("Prexzy failed");
  return res.download_url;
}

async function runDeepFallback(url: string, type: "mp3" | "mp4", videoId: string): Promise<YouTubeResult> {
  let dlUrl = "";
  
  try { dlUrl = await fetchVreden(url, type); } 
  catch {
    try { dlUrl = await fetchKyyOkatsu(url, type); } 
    catch {
      try { dlUrl = await fetchKord(url, type); } 
      catch {
        try { dlUrl = await fetchPrexzy(url, type); } 
        catch { throw new Error("All external APIs exhausted"); }
      }
    }
  }

  return {
    author: AUTHOR,
    title: "Video Download",
    thumbnail: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
    channel: "YouTube",
    published: "Unknown",
    views: "0", 
    duration: "0",
    url: dlUrl
  };
}

export const search = async (query: string, config?: HeavstalConfig): Promise<YouTubeSearchResult[]> => {
  try {
    await verifyApiKey(config?.apiKey)
    const result = await yts(query);
    if (!result.all || result.all.length === 0) throw new Error("No results found on YouTube.");
    
    return result.all.map((item: any) => ({
      type: item.type as 'video' | 'channel' | 'list' | 'live',
      url: item.url,
      title: item.title, description: item.description,
      image: item.image, thumbnail: item.thumbnail,
      seconds: item.seconds, timestamp: item.timestamp,
      views: item.views, ago: item.ago,
      author: item.author ? { name: item.author.name, url: item.author.url } : undefined
    }));
  } catch (error: any) {
    throw { message: error.message || "YouTube Search Failed" };
  }
};

export const ytmp3 = async (url: string): Promise<YouTubeResult> => {
  if (!ytdl.validateURL(url)) throw { author: AUTHOR, status: false, message: "Invalid YouTube URL" };
  const videoId = ytdl.getURLVideoID(url);

  try {
    const info = await ytdl.getInfo(url);
    const format = ytdl.chooseFormat(info.formats, { quality: 'highestaudio', filter: 'audioonly' });
    if (!format) throw new Error("No audio stream found");

    return {
      author: AUTHOR,
      title: info.videoDetails.title,
      thumbnail: info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1].url,
      channel: info.videoDetails.ownerChannelName,
      published: info.videoDetails.publishDate,
      views: info.videoDetails.viewCount,
      duration: info.videoDetails.lengthSeconds,
      url: format.url
    };
  } catch (error: any) {
    const msg = error.message?.toLowerCase() || "";
    if (msg.includes("!res.ok") || msg.includes("sign in") || msg.includes("bot") || msg.includes("stream")) {
      try {
        return await runDlsrvFallback(videoId, "mp3");
      } catch {
        try { 
          return await runDeepFallback(url, "mp3", videoId); 
        } catch (e: any) { 
          throw { author: AUTHOR, status: false, message: `All download chains failed: ${e.message}` }; 
        }
      }
    }
    throw { author: AUTHOR, status: false, message: error.message || "YouTube MP3 Failed" };
  }
};

export const ytmp4 = async (url: string): Promise<YouTubeResult> => {
  if (!ytdl.validateURL(url)) throw { author: AUTHOR, status: false, message: "Invalid YouTube URL" };
  const videoId = ytdl.getURLVideoID(url);

  try {
    const info = await ytdl.getInfo(url);
    const format = ytdl.chooseFormat(info.formats, { quality: 'highest', filter: (f) => f.hasAudio && f.hasVideo && f.container === 'mp4' }) || 
                   ytdl.chooseFormat(info.formats, { quality: 'highest', filter: (f) => f.hasAudio && f.hasVideo });
    if (!format) throw new Error("No video stream found");

    return {
      author: AUTHOR,
      title: info.videoDetails.title,
      thumbnail: info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1].url,
      channel: info.videoDetails.ownerChannelName,
      published: info.videoDetails.publishDate,
      views: info.videoDetails.viewCount,
      duration: info.videoDetails.lengthSeconds,
      url: format.url
    };
  } catch (error: any) {
    const msg = error.message?.toLowerCase() || "";
    if (msg.includes("!res.ok") || msg.includes("sign in") || msg.includes("bot") || msg.includes("stream")) {
      try {
        return await runDlsrvFallback(videoId, "mp4");
      } catch {
        try { 
          return await runDeepFallback(url, "mp4", videoId); 
        } catch (e: any) { 
          throw { author: AUTHOR, status: false, message: `All download chains failed: ${e.message}` }; 
        }
      }
    }
    throw { author: AUTHOR, status: false, message: error.message || "YouTube MP4 Failed" };
  }
};

export const play = async (query: string, type: 'mp3' | 'mp4' = 'mp3'): Promise<YouTubeResult> => {
  try {
    const searchResults = await yts(query);
    const videos = searchResults.all.filter((v: any) => v.type === 'video');
    if (videos.length === 0) throw new Error(`No video results found for: ${query}`);
    return type === 'mp4' ? await ytmp4(videos[0].url) : await ytmp3(videos[0].url);
  } catch (error: any) {
    throw new Error(`Play Failed: ${error.message}`);
  }
};
