import axios from 'axios';
import AdmZip from 'adm-zip';
import { AUTHOR } from '../types';

const TEXT_EXTENSIONS = [
  'js', 'ts', 'jsx', 'tsx', 'json', 'html', 'css', 'scss', 'less', 
  'md', 'txt', 'yml', 'yaml', 'sql', 'py', 'java', 'c', 'cpp', 'h', 
  'cs', 'php', 'rb', 'go', 'rs', 'swift', 'kt', 'xml', 'svg', 'env', 
  'gitignore', 'dockerfile', 'sh', 'bat', 'conf', 'ini', 'properties'
];

const BINARY_EXTENSIONS = [
  'png', 'jpg', 'jpeg', 'gif', 'webp', 'ico', 'bmp', 'tiff', 
  'mp3', 'wav', 'ogg', 'mp4', 'webm', 'mov', 'mkv', 'zip', 'tar', 'gz', '7z', 'rar'
];

export const unzipToText = async (url: string): Promise<{ author: typeof AUTHOR, buffer: Buffer, filename: string }> => {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const zipBuffer = Buffer.from(response.data);
    const zip = new AdmZip(zipBuffer);
    const zipEntries = zip.getEntries();

    let output = `EXTRACTED BY HEAVSTAL TECH\nSOURCE: ${url}\nDATE: ${new Date().toISOString()}\n\n`;

    for (const entry of zipEntries) {
      if (entry.isDirectory) continue;

      const path = entry.entryName;
      const ext = path.split('.').pop()?.toLowerCase() || '';
      
      output += `================================================================================\n`;
      output += `FILE: ${path}\n`;
      output += `================================================================================\n`;

      try {
        if (ext === 'pdf') {
          output += `[File contents not extracted - PDF Document]\n\n`;
        } 
        else if (BINARY_EXTENSIONS.includes(ext)) {
          const b64 = entry.getData().toString('base64');
          const mime = ext === 'mp3' ? 'audio/mpeg' : `image/${ext}`;
          output += `data:${mime};base64,${b64}\n\n`;
        } 
        else if (TEXT_EXTENSIONS.includes(ext) || !ext) {
          const content = entry.getData().toString('utf8');
          output += `${content}\n\n`;
        } 
        else {
          // Fallback check: Try to read as text, if null bytes found, treat as binary
          const buffer = entry.getData();
          if (buffer.includes(0x00)) {
             output += `data:application/octet-stream;base64,${buffer.toString('base64')}\n\n`;
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
