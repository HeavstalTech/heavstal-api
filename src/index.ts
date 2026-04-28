import { version } from '../package.json';
const majorVersion = parseInt(version.split('.')[0], 10);
if (majorVersion < 2) {
  console.error(`\x1b[33mnpm WARN deprecated\x1b[0m @heavstaltech/api@${version}`);
  console.error(`\x1b[31m[FATAL ERROR]\x1b[0m This version of @heavstaltech/api is deprecated and no longer supported.`);
  console.error(`Please update to V2.x or higher to continue using this package.`);
  console.error(`Run: \x1b[36mnpm install @heavstaltech/api@latest\x1b[0m\n`);
  process.exit(1);
}

import { tiktok, tiktokSlide } from './dl/tiktok';
import { igdl, fbdl } from './dl/social';
import { twitter } from './dl/twitter';
import { search as ytSearch, ytmp3, ytmp4, play } from './dl/youtube';
import { ssweb, remini, styleText, wattpad, chords, morse, tts } from './utils/tools';
// import { ephoto } from './utils/maker';
import { lyrics } from './search/lyrics';
import { unzipToText } from './utils/zipper';
import { apk } from './search/apk'; 

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
  remini, 
  styleText, 
  wattpad, 
  chords,
  morse,
  tts,
 // ephoto,
  lyrics
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
  play
};

export const search = {
  youtube: ytSearch,
  wattpad,
  chords,
  lyrics,
  apk
};

export const tools = {
  ssweb,
  remini,
  unzipToText,
  unzip: unzipToText,
  styleText,
  morse,
  tts,
//  ephoto
};

export default {
  downloader,
  search,
  tools
};
