import { AUTHOR, Author, HeavstalConfig } from '../types';
import { heavstalFetch } from '../fetcher';

export const ssweb = async (url: string, device: 'desktop' | 'tablet' | 'phone' = 'desktop', config?: HeavstalConfig): Promise<Buffer> => {
  const apiData = await heavstalFetch('screenshot', { url, type: device }, config);
  const imgResponse = await fetch(apiData.link);
  const arrayBuffer = await imgResponse.arrayBuffer();
  return Buffer.from(arrayBuffer);
};


export const styleText = async (text: string, config?: HeavstalConfig): Promise<{ author: Author, name: string, result: string }[]> => {
  const apiData = await heavstalFetch('style-text', { text }, config);
  return apiData.map((item: any) => ({
    author: AUTHOR,
    name: item.name,
    result: item.result
  }));
};

export const wattpad = async (query: string, config?: HeavstalConfig): Promise<any[]> => {
  const apiData = await heavstalFetch('wattpad', { query }, config);
  return apiData.map((item: any) => ({
    author: AUTHOR,
    ...item
  }));
};

export const morse = async (input: string, mode: 'encode' | 'decode' = 'encode', config?: HeavstalConfig): Promise<string> => {
  const apiData = await heavstalFetch('morse', { text: input, mode }, config);
  return apiData.output;
};

export const tts = async (text: string, lang: string = 'en', config?: HeavstalConfig): Promise<Buffer> => {
  const apiData = await heavstalFetch('tts', { text, lang }, config);
  const audioResponse = await fetch(apiData.url);
  const arrayBuffer = await audioResponse.arrayBuffer();
  return Buffer.from(arrayBuffer);
};

export const chords = async (query: string, config?: HeavstalConfig): Promise<any> => {
  const apiData = await heavstalFetch('chords', { query }, config);
  return {
    author: AUTHOR,
    title: apiData.title,
    artist: apiData.artist,
    url: apiData.url,
    chord: apiData.chord
  };
};
