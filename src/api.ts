import { useQuery } from "@tanstack/react-query";

const API_KEY = "009053f3a8257666a8c22cdce3c3c5ff";
const BASE_PATH = "https://api.themoviedb.org/3";

interface IMovie {
    id: number;
    backdrop_path: string;
    poster_path: string;
    title: string;
    overview: string;
}

export interface IGetMoviesResult {
    dates: {
        maximum: string;
        minimum: string;
    };
    page: number;
    results: IMovie[];
    total_pages: number;
    total_results: number;
    title?: string;
}

export function getLatestMovies() {
    return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(
        (response) => response.json(),
    );
}

export function getTopRatedMovies() {
    return fetch(`${BASE_PATH}/movie/top_rated?api_key=${API_KEY}`).then(
        (response) => response.json(),
    );
}

export function getUpcomingMovies() {
    return fetch(`${BASE_PATH}/movie/upcoming?api_key=${API_KEY}`).then(
        (response) => response.json(),
    );
}

export const useMultipleMovieQuery = () => {
    const latest = useQuery<IGetMoviesResult>({
        queryKey: ["movies", "latest"],
        queryFn: getLatestMovies,
    });
    const topRated = useQuery<IGetMoviesResult>({
        queryKey: ["movies", "topRated"],
        queryFn: getTopRatedMovies,
    });
    const upCommning = useQuery<IGetMoviesResult>({
        queryKey: ["movies", "upComming"],
        queryFn: getUpcomingMovies,
    });
    return [latest, topRated, upCommning];
};

interface ITv {
    id: number;
    backdrop_path: string;
    poster_path: string;
    name: string;
    overview: string;
}

export interface IGetTvResult {
    dates: {
        maximum: string;
        minimum: string;
    };
    page: number;
    results: ITv[];
    total_pages: number;
    total_results: number;
    title?: string;
}

export function getLatestTv() {
    return fetch(`${BASE_PATH}/tv/on_the_air?api_key=${API_KEY}`).then(
        (response) => response.json(),
    );
}

export function getAiringTodayTv() {
    return fetch(`${BASE_PATH}/tv/airing_today?api_key=${API_KEY}`).then(
        (response) => response.json(),
    );
}

export function getPopularTv() {
    return fetch(`${BASE_PATH}/tv/popular?api_key=${API_KEY}`).then(
        (response) => response.json(),
    );
}

export function getTopRatedTv() {
    return fetch(`${BASE_PATH}/tv/top_rated?api_key=${API_KEY}`).then(
        (response) => response.json(),
    );
}

export const useMultipleTvQuery = () => {
    const latest = useQuery<IGetTvResult>({
        queryKey: ["tv", "latest"],
        queryFn: getLatestTv,
    });
    const airingToday = useQuery<IGetTvResult>({
        queryKey: ["tv", "airingToday"],
        queryFn: getAiringTodayTv,
    });
    const popular = useQuery<IGetTvResult>({
        queryKey: ["tv", "popular"],
        queryFn: getPopularTv,
    });
    const topRated = useQuery<IGetTvResult>({
        queryKey: ["tv", "topRated"],
        queryFn: getTopRatedTv,
    });
    return [latest, airingToday, popular, topRated];
};

export function getSearchMovies(keyword: string) {
    return fetch(
        `${BASE_PATH}/search/movie?api_key=${API_KEY}&query=${keyword}`,
    ).then((response) => response.json());
}

export function getSearchTvs(keyword: string) {
    return fetch(
        `${BASE_PATH}/search/tv?api_key=${API_KEY}&query=${keyword}`,
    ).then((response) => response.json());
}

export const useMultipleSearchQuery = (keyword: string) => {
    const movies = useQuery<IGetMoviesResult>({
        queryKey: ["search", "movies"],
        queryFn: () => getSearchMovies(keyword),
    });
    const tvs = useQuery<IGetTvResult>({
        queryKey: ["search", "tvs"],
        queryFn: () => getSearchTvs(keyword),
    });
    return [movies, tvs];
};
