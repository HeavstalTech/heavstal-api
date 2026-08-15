<div align="center">
  <img src="https://heavstal.com.ng/ht_icon.svg" width="120" alt="Heavstal Tech Logo" />
  <h1>@heavstal/api</h1>

  <p>
    <img alt="NPM Version" src="https://img.shields.io/npm/v/@heavstal/api?style=flat-square">
    <img alt="Build Status" src="https://img.shields.io/github/actions/workflow/status/HeavstalTech/heavstal-api/test.yml?style=flat-square&label=tests">
    <img alt="License" src="https://img.shields.io/npm/l/@heavstal/api?style=flat-square">
  </p>
</div>

> [!WARNING]
> **Migration Notice:** `@heavstaltech/api` has been renamed to **[@heavstal/api](https://www.npmjs.com/package/@heavstal/api)**. 
> The legacy `@heavstaltech/api` package is now deprecated. Please update your dependencies to continue receiving security updates and new features.


A powerful, zero-dependency multi-purpose SDK client for interacting with Heavstal Tech API Utilities. Supports ESM and CJS.

This module provides streamlined programmatic access to media parsing, search engines, file compilation, and AI utility tools without requiring external dependencies like Puppeteer or Axios.

---

## Installation

Install via npm:

```bash
npm install @heavstal/api
```

Install via yarn:

```bash
yarn add @heavstal/api
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
import { downloader, search, tools } from '@heavstal/api';

// Or import specific standalone methods
import { tiktok, apk, unzipToText } from '@heavstal/api';
```

### CommonJS (`require`)
```javascript
const { downloader, search, tools } = require('@heavstal/api');

// Or require specific standalone methods
const { tiktok, apk, unzipToText } = require('@heavstal/api');
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

### 5. AI Tools

**Conversational AI**
Access Heavstal's customized LLM engines. Inject personas for dynamic responses.
```javascript
// AI ChatBots
const chat = await ai.chat("Explain quantum physics like I'm 5", "A friendly wizard");
console.log(chat.response);

const data = await ai.jeden("Write a haiku about code");
console.log(data.response);
```

**AI Image Generation**
Generate images using high-speed latent diffusion models.
```javascript
const img = await ai.image("A cyberpunk city in rain, neon lights");
console.log(img.url); // Returns hosted catbox link
```

**Sentinel (AI Text Detector)**
Analyze text to determine if it was AI-generated or human-written.
```javascript
const scan = await ai.sentinel("The quick brown fox jumps over the lazy dog.");
console.log(`Score: ${scan.score}% | Verdict: ${scan.verdict}`);
```
### 6. Movies 

**Movies**
Access a massive database of movies, including torrents, cast details, and images.
```javascript
// Get trending movies
const hotMovies = await movies.trending(10); // Number = results per page (Max 50, Default 20).
console.log(hotMovies.movies[0].title);

// Get lastest movies
const newMovies = await movies.latest(10); // Number = results per page (Max 50, Default 20).
console.log(newMovies.movies[0].title);

// Search movies
const results = await movies.search({ query: "Inception", min_rating: 8.0 });

// Get detailed movie info by ID
const detail = await movies.get(11);
```

**Live Data & Web Scraping**
```javascript
// Hacker News Top 10
const news = await search.hackerNews();

// Live Crypto Prices
const btc = await search.crypto(1, "BTC");
console.log(btc.data[0].price_usd);

// Smart Web Scraper (Extracts main content from websites)
const article = await search.webSearch("https://example.com/blog", true); // true = summarize with AI
```

### 7. Security, Intelligence & Utilities

Access a vast array of extra tools including IP locators, weather data, password generators, and URL metadata extraction.

```javascript
// Generate a secure 24-character password
const pass = await tools.passwordGenerator({ length: 24, symbols: true });
console.log(`Password: ${pass.data.password} | Entropy: ${pass.data.entropy_bits}`);
```

**GitHub Developer Info**
Fetches the info of a GitHub user/dev
```
const dev = await search.github("vercel");
console.log(`Followers: ${dev.data.followers} | Repos: ${dev.data.public_repos}`);
```

**Markdown to HTML**
coverts Markdown code to html
```javascript
const html = await tools.markdownToHtml("# Hello **World**");
```

**Weather Forecast**
Fetches the weather information of any city
```javascript
const weather = await search.weather("London");
console.log(`Temp: ${weather.data.temp_c}°C | Condition: ${weather.data.condition}`);
```

**MediaFire Downloader**
Bypasses the landing page and returns the raw file link.
```javascript
const file = await downloader.mediafire("https://www.mediafire.com/file/...");
console.log(`Name: ${file.data.filename} | Link: ${file.data.link}`);
```

### 8. Search & Information

**GitHub Developer Info**
Fetch detailed developer profiles from GitHub.
```javascript
const dev = await search.github("torvalds");
console.log(`Name: ${dev.data.name} | Repos: ${dev.data.public_repos}`);
```

**TikTok Profile Info**
Retrieve public profile information, followers, and engagement stats.
```javascript
const profile = await search.tiktokInfo("khaby.lame");
console.log(`Followers: ${profile.data.followers} | Bio: ${profile.data.description}`);
```

**Global Weather**
Get real-time atmospheric data and forecasts for any city.
```javascript
const weather = await search.weather("Lagos");
console.log(`Temp: ${weather.data.temp_c}°C | Condition: ${weather.data.condition}`);
```

**URL Metadata Fetcher**
Extract Open Graph (OG) tags, titles, and descriptions from any website.
```javascript
const meta = await search.metadata("https://youtube.com/watch?v=dQw4w9WgXcQ");
console.log(`Title: ${meta.data.title} | Image: ${meta.data.image}`);
```

### 9. Security & Cryptography

**CODE-X Encryption**
Enterprise-grade code obfuscation for JavaScript, Python, and Java.
```javascript
const obfuscated = await tools.codex("console.log('Secret');", "js");
console.log(obfuscated.data.encrypted_code);
```

**Secure Password Generator**
Generate cryptographically secure passwords with custom criteria.
```javascript
const pass = await tools.passwordGenerator({ 
  length: 24, 
  uppercase: true, 
  numbers: true, 
  symbols: true 
});
console.log(pass.data.password);
```

**Password Strength Auditor**
Analyze password strength, crack time, and get security suggestions.
```javascript
const audit = await tools.passwordStrength("password123");
console.log(`Score: ${audit.data.score}/4 | Time to crack: ${audit.data.crack_time}`);
```

### 10. Document & Text Utilities

**Universal Document Extractor**
Extract raw text from PDF, DOCX, TXT, and Code files via URL.
```javascript
const doc = await tools.docExtract("https://example.com/contract.pdf");
console.log(doc.data.content);
```

**Markdown to HTML**
Convert Markdown syntax into secure, sanitized HTML.
```javascript
const html = await tools.markdownToHtml("# Hello **World**");
console.log(html.data.html); // <h1>Hello <strong>World</strong></h1>
```

**Universal Encoder (Base64/Base32)**
Smart encoder/decoder. Automatically detects and hosts binary files on decode.
```javascript
const encoded = await tools.encoder("Heavstal Tech", "base64", "encode");
console.log(encoded.data.output);
```

**Image to Text (OCR)**
Extract text from images using advanced Optical Character Recognition.
```javascript
const ocr = await tools.ocr("https://example.com/image-with-text.jpg", "eng");
console.log(ocr.data.text);
```

**Universal Translator**
Auto-detects source language and translates text to English.
```javascript
const translation = await tools.translate("Bonjour tout le monde");
console.log(translation.data.translated); // "Hello everyone"
```

### 11. Development & Network Utilities

**Math Calculator**
Evaluate complex mathematical expressions securely.
```javascript
const math = await tools.calc("sqrt(16) + 5^2");
console.log(`Result: ${math.data.result}`); // "29"
```

**HTTP Status Checker**
Check website uptime, latency, and status codes.
```javascript
const status = await tools.httpStatus("https://github.com");
console.log(`Status: ${status.data.status} | Latency: ${status.data.latency}`);
```

**IP Geo-Locator**
Get location, ISP, and timezone info for any IP or Domain.
```javascript
const ip = await tools.ipInfo("8.8.8.8");
console.log(`City: ${ip.data.city}, ${ip.data.country} | ISP: ${ip.data.org}`);
```

**QR Code Generator**
Create customizable QR codes and return a direct image link.
```javascript
const qr = await tools.qrcode("https://heavstal.com.ng", "#000000", "#ffffff");
console.log(qr.data.link);
```

### 12. Fun, Games & Education

**Academic Quiz Engine**
Generate random multiple-choice questions for STEM subjects.
```javascript
const quiz = await tools.quiz("computer", 5); // Fetch 5 computer science questions
console.log(quiz.data[0].question);
```

**Fun Facts**
Get random, interesting facts from history, science, and nature.
```javascript
const fact = await tools.funfact();
console.log(fact.data.fact);
```

**Religion (Bible/Quran)**
Retrieve sacred texts, translations, and audio.
```javascript
const verse = await tools.religion("bible", "John 3:16", "kjv");
console.log(verse.data.text);
```

**Truth or Dare**
Get random Truth questions or Dare challenges with thematic images.
```javascript
const game = await tools.truthDare("dare");
console.log(`Dare: ${game.data.result} | Image: ${game.data.image}`);
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
