<div align="center">
  <img src="https://heavstal.com.ng/ht_icon.svg" width="120" alt="Heavstal Tech Logo" />
  <h1>@heavstaltech/api</h1>

  <p>
    <img alt="NPM Version" src="https://img.shields.io/npm/v/@heavstaltech/api?style=flat-square">
    <img alt="Build Status" src="https://img.shields.io/github/actions/workflow/status/HeavstalTech/heavstaltech-api/test.yml?style=flat-square&label=tests">
    <img alt="License" src="https://img.shields.io/npm/l/@heavstaltech/api?style=flat-square">
  </p>
</div>

A powerful, zero-dependency multi-purpose SDK client for interacting with Heavstal Tech API Utilities. Supports ESM and CJS.

This module provides streamlined programmatic access to media parsing, search engines, file compilation, and AI utility tools without requiring external dependencies like Puppeteer or Axios.

---

## Installation

Install via npm:

```bash
npm install @heavstaltech/api
```

Install via yarn:

```bash
yarn add @heavstaltech/api
```

---

## Authentication

To use this SDK, you must have a valid API Key from [Heavstal Tech Credentials](https://heavstal.com.ng/credentials). The SDK supports two methods of authentication:

### 1. Environment Variable (Recommended)
The SDK will automatically detect your API key if it is set in your environment variables.

```env
# .env
HEAVSTAL_API_KEY=ht_live_your_api_key_here
```

### 2. Manual Configuration Object
If you prefer not to use environment variables, or need to switch keys dynamically, you can pass a configuration object as the final argument to any function.

```javascript
const config = { apiKey: "ht_live_your_api_key_here" };

// Example passing the config
const result = await downloader.tiktok("https://vt.tiktok.com/...", config);
```

---

## Usage

This library is a hybrid module, meaning it seamlessly supports both **CommonJS (`require`)** and **ES Modules (`import`)**.

### ES Modules / TypeScript (`import`)
```typescript
import { downloader, search, tools } from '@heavstaltech/api';

// Or import specific standalone methods
import { tiktok, remini, unzipToText } from '@heavstaltech/api';
```

### CommonJS (`require`)
```javascript
const { downloader, search, tools } = require('@heavstaltech/api');

// Or require specific standalone methods
const { tiktok, remini, unzipToText } = require('@heavstaltech/api');
```

---

## API Documentation

### 1. Social Media Utilities

**TikTok (Video & Slides)**
Extract videos without watermarks, audio tracks, and slide images.
```javascript
// Video Extraction
const video = await downloader.tiktok("https://vt.tiktok.com/..."); 
console.log(video.no_watermark);

// Image Slides Extraction
const slide = await downloader.tiktokSlide("https://vt.tiktok.com/...");
console.log(slide.slideImages);
```

**Instagram (Reels, Images, Videos)**
Extract media from public Instagram posts.
```javascript
const ig = await downloader.igdl("https://www.instagram.com/p/...");
console.log(ig);
```

**Facebook**
Extract public Facebook Watch and post videos.
```javascript
const fb = await downloader.fbdl("https://fb.watch/...");
```

**Twitter / X**
Extract media from X.com (Twitter). Returns standard and high-definition video links.
```javascript
const tweet = await downloader.xdl("https://x.com/user/status/...");
console.log(tweet.video_hd);
```

### 2. YouTube Search & Extraction

**Search**
```javascript
const results = await search.youtube("No Copyright Sounds");
console.log(results[0].url); 
```

**Extract Audio / Video**
```javascript
// Extract MP3 Audio
const audio = await downloader.ytmp3("https://youtu.be/...");

// Extract MP4 Video
const video = await downloader.ytmp4("https://youtu.be/...");

// Play (Search and instantly extract first result)
const song = await downloader.play("Adele Hello", "mp3");
```

### 3. Search Utilities

**APK Metadata & Downloads**
Search for Android applications and fetch high-speed download links.
```javascript
const app = await search.apk("WhatsApp");
console.log(`Version: ${app.version} | Link: ${app.dl_url}`);
```

**Song Lyrics (LRCLIB & Genius)**
Fetch accurate song metadata and lyrics.
```javascript
const song = await search.lyrics("Kendrick Lamar DNA");
console.log(song.lyrics);
```

**Wattpad & Chords**
```javascript
// Search Wattpad stories
const stories = await search.wattpad("Science Fiction");

// Fetch Guitar Chords
const chords = await search.chords("Ed Sheeran Perfect");
```

### 4. General & AI Tools

**Repository/ZIP to Text Extractor**
Downloads a remote ZIP file, recursively extracts it, and compiles it into a single text buffer. Highly optimized for feeding codebases into Large Language Models (LLMs).
```javascript
const fs = require('fs');

// includeBinary: false skips images/PDFs, perfect for text/code extraction
const codebase = await tools.unzip("https://github.com/user/repo/archive/main.zip", { 
  includeBinary: false 
});

fs.writeFileSync(codebase.filename, codebase.buffer);
```

**Remini (AI Image Enhancer)**
Enhances, dehazes, or recolors low-quality images.
```javascript
// Methods: 'enhance', 'recolor', 'dehaze'
const buffer = await tools.remini("https://example.com/blurry.jpg", "enhance");
fs.writeFileSync("enhanced.jpg", buffer);
```

**Text to Speech (Google TTS)**
Convert text into spoken audio buffer.
```javascript
// Second argument is the language code (e.g., 'en', 'ja', 'es')
const audioBuffer = await tools.tts("Hello World", "en");
```

**Website Screenshot**
Capture responsive screenshots of any given URL.
```javascript
// Device options: 'desktop', 'tablet', 'phone'
const imgBuffer = await tools.ssweb("https://google.com", "desktop");
```

**Text Styling & Morse Code**
```javascript
// Generate stylized text variations
const fonts = await tools.styleText("Heavstal Tech");

// Morse code encoding/decoding
const morseStr = await tools.morse("HELLO", "encode"); // Output: .... . .-.. .-.. ---
```

---

## Heavstal Tech Ecosystem

This package is part of the Heavstal Tech platform. For endpoint documentation, uptime status, and higher rate limits, please visit our official portals:

* **Documentation:** [https://docs.heavstal.com.ng](https://docs.heavstal.com.ng)
* **API Key:** [https://heavstal.com.ng/credentials](https://heavstal.com.ng/credentials)
* **Pricing:** [https://heavstal.com.ng/pricing](https://heavstal.com.ng/pricing)

---

## License

This project is licensed under the **MIT License**.

<div align="center">
  <p>Maintained by <a href="https://heavstal.com.ng">HEAVSTAL TECH</a></p>
  <p><i>Building Tomorrow's Web, Today.</i></p>
</div>
