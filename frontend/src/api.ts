import axios from "axios";
import type { AnimeItem, Episode } from './types'
const API_BASE = '/api';

const api = axios.create({
    baseURL: API_BASE,
    withCredentials: true,
    headers: {
        "Content-Type": 'application/json',
    },
});

// 403 error obrabotka
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 403) {
            // Не редиректим если уже на /blocked
            if (window.location.pathname !== '/blocked') {
                console.log('403 detected, redirecting to /blocked');
                window.location.href = '/blocked';
            } else {
                console.log('403 on /blocked, ignoring');
            }
        }
        return Promise.reject(error);
    }
)

export const animeApi = {
    getAll: (): Promise<AnimeItem[]> =>
        api.get('/AnimeItem/all-anime').then(res => res.data),

    getById: (id: number): Promise<AnimeItem> =>
        api.get(`/AnimeItem/get-anime/${id}`).then(res => res.data),

    getEpisodeById: (id: number): Promise<Episode> =>
        api.get(`/Episode/episode/${id}`).then(res => res.data),

    getEpisodesByAnime: (animeId: number): Promise<Episode[]> =>
        api.get(`/Episode/episodes-by-anime?animeId=${animeId}`).then(res => res.data),

    getOngoingAnime: (): Promise<AnimeItem[]> =>
        api.get('/AnimeItem/ongoing-anime').then(res => res.data),

    getPrevYear: (): Promise<AnimeItem[]> =>
        api.get('/AnimeItem/prev-year').then(res => res.data),

    getThisYear: (): Promise<AnimeItem[]> =>
        api.get('/AnimeItem/this-year').then(res => res.data),

    getCurrentSeasonAnime: (): Promise<AnimeItem[]> =>
        api.get('/AnimeItem/current-season').then(res => res.data),

    getRelatedAnime: (animeId: number): Promise<AnimeItem[]> =>
        api.get(`/Related/related-animes?animeId=${animeId}`).then(res => res.data),

    getRandomAnime: (): Promise<AnimeItem> =>
        api.get('/AnimeItem/random').then(res => res.data),
    
    getListAnime: (page = 1, pageSize = 20): Promise<AnimeItem[]> =>
        api.get('/AnimeItem/get-list', {
            params: {page, pageSize}
        }).then(res => res.data),

    getNewAnime: (): Promise<AnimeItem[]> =>
        api.get('/AnimeItem/new').then(res => res.data),
    
    getFavorites: () => api.get('/Favourite').then(res => res.data),

    getFavoriteIds: () => api.get('/Favourite/ids').then(res => res.data),

    addFavourite: (animeId: number) => api.post(`/Favourite/${animeId}`).then(res => res.data),

    removeFavourite: (animeId: number) => api.delete(`/Favourite/${animeId}`).then(res => res.data),
}
