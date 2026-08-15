// src/ai/index.ts
import { AUTHOR, AIResult, ImageResult, SentinelResult, HeavstalConfig } from '../types';
import { heavstalFetch } from '../fetcher';

export const chat = async (prompt: string, persona?: string, config?: HeavstalConfig): Promise<AIResult> => {
  const apiData = await heavstalFetch('ai', { prompt, persona }, config);
  return {
    author: AUTHOR,
    status: true,
    model: apiData.model,
    response: apiData.response
  };
};

export const jeden = async (prompt: string, persona?: string, config?: HeavstalConfig): Promise<AIResult> => {
  const apiData = await heavstalFetch('jeden', { prompt, persona }, config);
  return {
    author: AUTHOR,
    status: true,
    model: apiData.model,
    response: apiData.response
  };
};

export const image = async (prompt: string, count?: number, config?: HeavstalConfig): Promise<ImageResult> => {
  const payload: any = { prompt };
  if (count) payload.count = count;
  
  const apiData = await heavstalFetch('image', payload, config);
  return {
    author: AUTHOR,
    status: true,
    prompt: apiData.prompt,
    url: apiData.url,
    model: apiData.model,
    note: apiData.note
  };
};

export const sentinel = async (text: string, config?: HeavstalConfig): Promise<SentinelResult> => {
  const apiData = await heavstalFetch('sentinel', { text }, config);
  return {
    author: AUTHOR,
    status: true,
    score: apiData.score,
    verdict: apiData.verdict,
    analysis: apiData.analysis
  };
};
