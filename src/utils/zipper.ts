import { AUTHOR, HeavstalConfig } from '../types';
import { heavstalFetch } from '../fetcher';

export interface UnzipOptions {
  includeBinary?: boolean;
}

export const unzipToText = async (url: string, options: UnzipOptions = { includeBinary: false }, config?: HeavstalConfig): Promise<{ author: typeof AUTHOR, buffer: Buffer, filename: string }> => {
  const apiData = await heavstalFetch('unzip', { url, includeBinary: options.includeBinary }, config);
  
  const textResponse = await fetch(apiData.result_file);
  const arrayBuffer = await textResponse.arrayBuffer();
  
  return {
    author: AUTHOR,
    buffer: Buffer.from(arrayBuffer),
    filename: 'extracted_codebase.txt'
  };
}
