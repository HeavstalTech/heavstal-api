import axios from 'axios';
import { AUTHOR, ApkResult } from '../types';

const formatSize = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const apk = async (query: string): Promise<ApkResult> => {
  return new Promise(async (resolve, reject) => {
    try {
      const searchUrl = `https://ws75.aptoide.com/api/7/apps/search?query=${encodeURIComponent(query)}&limit=1`;
      const { data } = await axios.get(searchUrl);
      if (!data || !data.datalist || data.datalist.list.length === 0) {
        throw new Error("App not found.");
      }

      const app = data.datalist.list[0];
      const result: ApkResult = {
        author: AUTHOR,
        status: true,
        name: app.name,
        package_id: app.package,
        version: app.file.vername,
        downloads: app.stats.downloads,
        size: formatSize(app.file.filesize),
        icon: app.icon,
        dl_url: app.file.path,
        last_updated: app.updated
      };
      resolve(result);
    } catch (error: any) {
      reject({
        author: AUTHOR,
        status: false,
        message: error.message || "APK Search Failed"
      });
    }
  });
};
