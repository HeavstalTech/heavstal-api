// src/utils/extra.ts
import { AUTHOR, GenericDataResult, HeavstalConfig } from '../types';
import { heavstalFetch } from '../fetcher';

export const calc = async (expr: string, config?: HeavstalConfig): Promise<GenericDataResult> => {
  const apiData = await heavstalFetch('calc', { expr }, config);
  return { author: AUTHOR, status: true, data: apiData };
};

export const codex = async (code: string, lang: string, config?: HeavstalConfig): Promise<GenericDataResult> => {
  const apiData = await heavstalFetch('codex', { code, lang }, config);
  return { author: AUTHOR, status: true, data: apiData };
};

export const docExtract = async (url: string, config?: HeavstalConfig): Promise<GenericDataResult> => {
  const apiData = await heavstalFetch('doc-extract', { url }, config);
  return { author: AUTHOR, status: true, data: apiData };
};

export const encoder = async (text: string, type: string = 'base64', mode: string = 'encode', config?: HeavstalConfig): Promise<GenericDataResult> => {
  const apiData = await heavstalFetch('encoder', { text, type, mode }, config);
  return { author: AUTHOR, status: true, data: apiData };
};

export const funfact = async (config?: HeavstalConfig): Promise<GenericDataResult> => {
  const apiData = await heavstalFetch('funfact', {}, config);
  return { author: AUTHOR, status: true, data: apiData };
};

export const httpStatus = async (url: string, config?: HeavstalConfig): Promise<GenericDataResult> => {
  const apiData = await heavstalFetch('http-status', { url }, config);
  return { author: AUTHOR, status: true, data: apiData };
};

export const ipInfo = async (ip: string, config?: HeavstalConfig): Promise<GenericDataResult> => {
  const apiData = await heavstalFetch('ip-info', { ip }, config);
  return { author: AUTHOR, status: true, data: apiData };
};

export const markdownToHtml = async (markdown: string, config?: HeavstalConfig): Promise<GenericDataResult> => {
  const apiData = await heavstalFetch('markdown', { markdown }, config);
  return { author: AUTHOR, status: true, data: apiData };
};

export const ocr = async (url: string, lang: string = 'eng', config?: HeavstalConfig): Promise<GenericDataResult> => {
  const apiData = await heavstalFetch('ocr', { url, lang }, config);
  return { author: AUTHOR, status: true, data: apiData };
};

export interface PasswordOptions {
  length?: number;
  uppercase?: boolean;
  numbers?: boolean;
  symbols?: boolean;
}

export const passwordGenerator = async (options?: PasswordOptions, config?: HeavstalConfig): Promise<GenericDataResult> => {
  const apiData = await heavstalFetch('password-generator', options || {}, config);
  return { author: AUTHOR, status: true, data: apiData };
};

export const passwordStrength = async (password: string, config?: HeavstalConfig): Promise<GenericDataResult> => {
  const apiData = await heavstalFetch('password-strength', { password }, config);
  return { author: AUTHOR, status: true, data: apiData };
};

export const qrcode = async (text: string, color?: string, bg?: string, config?: HeavstalConfig): Promise<GenericDataResult> => {
  const apiData = await heavstalFetch('qrcode', { text, color, bg }, config);
  return { author: AUTHOR, status: true, data: apiData };
};

export const quiz = async (subject?: string, count?: number, config?: HeavstalConfig): Promise<GenericDataResult> => {
  const apiData = await heavstalFetch('quiz', { subject, count }, config);
  return { author: AUTHOR, status: true, data: apiData };
};

export const religion = async (type: 'bible' | 'quran', reference: string, version?: string, config?: HeavstalConfig): Promise<GenericDataResult> => {
  const apiData = await heavstalFetch('religion', { type, reference, version }, config);
  return { author: AUTHOR, status: true, data: apiData };
};

export const translate = async (text: string, config?: HeavstalConfig): Promise<GenericDataResult> => {
  const apiData = await heavstalFetch('translate', { text }, config);
  return { author: AUTHOR, status: true, data: apiData };
};

export const truthDare = async (type: 'truth' | 'dare', config?: HeavstalConfig): Promise<GenericDataResult> => {
  const apiData = await heavstalFetch('truth-dare', { type }, config);
  return { author: AUTHOR, status: true, data: apiData };
};
