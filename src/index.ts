import { version } from '../package.json';
const majorVersion = parseInt(version.split('.')[0], 10);
if (majorVersion < 2) {
  console.error(`\x1b[33mnpm WARN deprecated\x1b[0m @heavstaltech/api@${version}`);
  console.error(`\x1b[31m[FATAL ERROR]\x1b[0m This version of @heavstaltech/api is deprecated and no longer supported.`);
  console.error(`Please update to V2.x or higher to continue using this package.`);
  console.error(`Run: \x1b[36mnpm install @heavstaltech/api@latest\x1b[0m\n`);
  process.exit(1);
}

/* // Migration Notice for Heavstal Api Sdk
if (process.env.NODE_ENV !== 'production' || typeof window === 'undefined') {
  console.warn(
    "\x1b[33m%s\x1b[0m",
    "\n[HEAVSTAL TECH]  DEPRECATION NOTICE:",
    "\nThe package '@heavstaltech/api' has been moved to '@heavstal/api'.",
    "\nThis version is no longer maintained and will not receive security updates.",
    "\n\nRun: npm install @heavstal/api",
    "\nVisit: https://www.npmjs.com/package/@heavstal/api\n"
  );
} */

import { tiktok, tiktokSlide } from './dl/tiktok';
import { igdl, fbdl } from './dl/social';
import { twitter } from './dl/twitter';
import { search as ytSearch, ytmp3, ytmp4, play } from './dl/youtube';
import { ssweb, styleText, wattpad, chords, morse, tts } from './utils/tools';
import { hackerNews, crypto, webSearch } from './search/data'; 
import { github, tiktokInfo, weather, metadata } from './search/misc';
import { ephoto } from './utils/maker';
import { lyrics } from './search/lyrics';
import { unzipToText } from './utils/zipper';
import { apk } from './search/apk'; 
import { mediafire } from './dl/mediafire';
import * as extraTools from './utils/extra';
import * as aiModule from './ai/index';
import * as moviesModule from './movies/index';
import * as tvModule from './tv/index';

export * from './types';

export { 
  tiktok, 
  tiktokSlide, 
  igdl, 
  fbdl, 
  apk,
  twitter,
  unzipToText,
  twitter as xdl,
  ytSearch, 
  ytmp3, 
  ytmp4, 
  play,
  ssweb, 
  styleText, 
  wattpad, 
  chords,
  morse,
  tts,
  ephoto,
  lyrics,
  hackerNews,
  crypto,
  webSearch
};

export const downloader = {
  tiktok,
  tiktokSlide,
  igdl,
  fbdl,
  twitter,
  xdl: twitter,
  ytmp3,
  ytmp4,
  play,
  mediafire
};

export const search = {
  youtube: ytSearch,
  wattpad,
  chords,
  lyrics,
  apk,
  hackerNews, 
  crypto,   
  webSearch,
  github, 
  tiktokInfo,
  weather, 
  metadata 
};

export const tools = {
  ssweb,
  unzipToText,
  unzip: unzipToText,
  styleText,
  morse,
  tts,
  ephoto,
  ...extraTools
};

export const ai = aiModule;
export const movies = moviesModule;
export const tv = tvModule;

export default {
  downloader,
  search,
  tools,
  ai,
  movies,
  tv
};
