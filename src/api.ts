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

export const useMultipleQuery = () => {
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
