import { AUTHOR, ApkResult, HeavstalConfig } from '../types';
import { heavstalFetch } from '../fetcher';

export const apk = async (query: string, config?: HeavstalConfig): Promise<ApkResult> => {
  const apiData = await heavstalFetch('apk', { query }, config);
  
  return {
    author: AUTHOR,
    status: true,
    name: apiData.name,
    package_id: apiData.package,
    version: apiData.version,
    downloads: apiData.downloads,
    size: apiData.size,
    icon: apiData.icon,
    dl_url: apiData.download_link,
    last_updated: apiData.last_updated
  };
};
