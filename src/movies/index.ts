// src/movies/index.ts
import { AUTHOR, MoviesListResult, MovieGetResult, HeavstalConfig } from '../types';
import { heavstalFetch } from '../fetcher';

export interface MovieSearchParams {
  query?: string;
  page?: number;
  limit?: number;
  genre?: string;
  sort_by?: string;
  min_rating?: number;
}

export const get = async (id: number, config?: HeavstalConfig): Promise<MovieGetResult> => {
  const apiData = await heavstalFetch('movies/get', { id }, config);
  return { author: AUTHOR, status: true, data: apiData };
};

export const latest = async (limit?: number, page?: number, config?: HeavstalConfig): Promise<MoviesListResult> => {
  const apiData = await heavstalFetch('movies/latest', { limit, page }, config);
  return { author: AUTHOR, status: true, count: apiData.count, page: apiData.page, movies: apiData.movies };
};

export const search = async (params: MovieSearchParams, config?: HeavstalConfig): Promise<MoviesListResult> => {
  const apiData = await heavstalFetch('movies/search', params, config);
  return { author: AUTHOR, status: true, count: apiData.count, total: apiData.total, page: apiData.page, movies: apiData.movies };
};

export const trending = async (limit?: number, page?: number, config?: HeavstalConfig): Promise<MoviesListResult> => {
  const apiData = await heavstalFetch('movies/trending', { limit, page }, config);
  return { author: AUTHOR, status: true, count: apiData.count, page: apiData.page, movies: apiData.movies };
};
