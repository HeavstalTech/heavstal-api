import axios from 'axios';
import AdmZip from 'adm-zip';
import { AUTHOR } from '../types';

const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
];

const TEXT_EXTENSIONS = [
  'js', 'ts', 'jsx', 'tsx', 'json', 'html', 'css', 'scss', 'less', 
  'md', 'txt', 'yml', 'yaml', 'sql', 'py', 'java', 'c', 'cpp', 'h', 
  'cs', 'php', 'rb', 'go', 'rs', 'swift', 'kt', 'xml', 'svg', 'env', 
  'gitignore', 'dockerfile', 'sh', 'bat', 'conf', 'ini', 'properties',
  'toml', 'prisma', 'lock', 'package'
];

const BINARY_EXTENSIONS = [
  'png', 'jpg', 'jpeg', 'gif', 'webp', 'ico', 'bmp', 'tiff', 
  'mp3', 'wav', 'ogg', 'mp4', 'webm', 'mov', 'mkv', 'zip', 'tar', 'gz', '7z', 'rar',
  'pdf', 'docx', 'doc', 'xlsx', 'pptx', 'exe', 'bin', 'dll', 'so', 'dylib'
];

export interface UnzipOptions {
  includeBinary?: boolean;
}

export const unzipToText = async (url: string, options: UnzipOptions = { includeBinary: false }): Promise<{ author: typeof AUTHOR, buffer: Buffer, filename: string }> => {
  try {
    const response = await axios.get(url, { 
        responseType: 'arraybuffer',
        headers: {
            'User-Agent': USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)]
        }
    });

    const zipBuffer = Buffer.from(response.data);
    const zip = new AdmZip(zipBuffer);
    const zipEntries = zip.getEntries();

    let output = `EXTRACTED BY HEAVSTAL TECH\nSOURCE: ${url}\nDATE: ${new Date().toISOString()}\n`;
    output += `OPTIONS: Include Binary = ${options.includeBinary}\n\n`;

    for (const entry of zipEntries) {
      if (entry.isDirectory) continue;

      const path = entry.entryName;
      const ext = path.split('.').pop()?.toLowerCase() || '';
      
      output += `================================================================================\n`;
      output += `FILE: ${path}\n`;
      output += `================================================================================\n`;

      try {
        if (BINARY_EXTENSIONS.includes(ext)) {
          if (options.includeBinary) {
             const b64 = entry.getData().toString('base64');
             const mime = ext === 'mp3' ? 'audio/mpeg' : `image/${ext}`;
             
             if (['pdf', 'docx', 'doc', 'xlsx', 'pptx'].includes(ext)) {
                 output += `data:application/octet-stream;base64,${b64}\n\n`;
             } else {
                 output += `data:${mime};base64,${b64}\n\n`;
             }
          } else {
             output += `[Binary File Skipped] (Type: ${ext}, Size: ${entry.header.size} bytes)\n\n`;
          }
        } 
        else if (TEXT_EXTENSIONS.includes(ext) || !ext) {
          const content = entry.getData().toString('utf8');
          output += `${content}\n\n`;
        } 
        else {
          const buffer = entry.getData();
          if (buffer.includes(0x00)) {
             if (options.includeBinary) {
                output += `data:application/octet-stream;base64,${buffer.toString('base64')}\n\n`;
             } else {
                output += `[Unknown Binary File Skipped]\n\n`;
             }
          } else {
             output += `${buffer.toString('utf8')}\n\n`;
          }
        }
      } catch (err) {
        output += `[Error reading file: ${(err as Error).message}]\n\n`;
      }
    }

    return {
      author: AUTHOR,
      buffer: Buffer.from(output, 'utf-8'),
      filename: 'extracted_codebase.txt'
    };

  } catch (error: any) {
    throw new Error(`Unzip Failed: ${error.message}`);
  }
};
