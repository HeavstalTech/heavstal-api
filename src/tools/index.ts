import { heavstalFetch } from '../fetcher';
import { HeavstalConfig, Web2ApkResult, Web2ApkOptions, AUTHOR } from '../types';

export async function web2apk(
  website_url: string, 
  app_name: string, 
  icon_url: string, 
  options?: Web2ApkOptions, 
  config?: HeavstalConfig
): Promise<Web2ApkResult> {
  
  const payload = { website_url, app_name, icon_url, ...options };
  const data = await heavstalFetch('tools/web2apk', payload, config);
  
  return { author: AUTHOR, status: true, ...data };
}
