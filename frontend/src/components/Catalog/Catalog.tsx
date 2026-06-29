import { animeApi } from '../../api'
import { useEffect, useState } from "react"
import type { AnimeItem, Genre } from '../../types'; // Не забудь импорт Genre
import AnimeCard from '../AnimeCard/AnimeCard';

export default function Catalog() {
    const [animeList, setAnimeList] = useState<AnimeItem[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    
    const [genres, setGenres] = useState<Genre[]>([]);
    const [selectedGenreIds, setSelectedGenreIds] = useState<number[]>([]);
    
    const pageSize = 18;

    const loadAnime = async (currentPage: number, genreIds: number[]) => {
        setLoading(true);
        try {
            const response = await animeApi.getListAnime(currentPage, pageSize, genreIds);
            
            setAnimeList(response.items || response);
            setTotalPages(response.totalPages || 1);
            setPage(currentPage);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        animeApi.getGenre()
            .then(setGenres)
            .catch(err => console.error("Ошибка загрузки жанров:", err));
    }, []);

    useEffect(() => {
        loadAnime(1, selectedGenreIds);
    }, [selectedGenreIds]);

    const toggleGenre = (genreId: number) => {
        setSelectedGenreIds(prev => 
            prev.includes(genreId) 
                ? prev.filter(id => id !== genreId) 
                : [...prev, genreId]
        );
    };

    const resetFilters = () => {
        setSelectedGenreIds([]);
    };

    const goToPage = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            loadAnime(newPage, selectedGenreIds);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const delta = 2;

        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            if (page > delta + 2) pages.push('...');

            const start = Math.max(2, page - delta);
            const end = Math.min(totalPages - 1, page + delta);

            for (let i = start; i <= end; i++) pages.push(i);

            if (page < totalPages - delta - 1) pages.push('...');
            pages.push(totalPages);
        }

        return pages;
    };

    return (
        <>
            <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                    {selectedGenreIds.length > 0 && (
                        <button 
                            onClick={resetFilters}
                            className="text-sm text-red-400 hover:text-red-300 transition"
                        >
                            Сбросить фильтры
                        </button>
                    )}
                </div>
                
                <div className="flex flex-wrap gap-2">
                    {genres.map(genre => {
                        const isActive = selectedGenreIds.includes(genre.id);
                        return (
                            <button
                                key={genre.id}
                                onClick={() => toggleGenre(genre.id)}
                                disabled={loading}
                                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${
                                    isActive 
                                        ? 'bg-green-600 text-white border-green-500 shadow-lg shadow-green-600/20' 
                                        : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700 hover:border-gray-600'
                                }`}
                            >
                                {genre.name}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
                {loading && animeList.length === 0 ? (
                    <div className="col-span-full text-center text-gray-400 py-10">Загрузка...</div>
                ) : animeList.length > 0 ? (
                    animeList.map(anime => (
                        <div key={anime.id} className="flex justify-center">
                            <AnimeCard anime={anime} />
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center text-gray-400 py-10">
                        Аниме по выбранным жанрам не найдено
                    </div>
                )}
            </div>

            {totalPages > 1 && (
                <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
                    {getPageNumbers().map((p, index) => (
                        p === '...' ? (
                            <span key={`dots-${index}`} className="px-2 text-gray-400">...</span>
                        ) : (
                            <button
                                key={p}
                                onClick={() => goToPage(p as number)}
                                disabled={loading}
                                className={`px-4 py-2 rounded transition ${
                                    page === p
                                        ? 'bg-green-600 text-white font-bold'
                                        : 'bg-gray-700 text-white hover:bg-gray-600'
                                }`}
                            >
                                {p}
                            </button>
                        )
                    ))}
                </div>
            )}
        </>
    );
}