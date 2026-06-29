import { animeApi } from '../../api'
import { useEffect, useState } from "react"
import type { AnimeItem } from '../../types';
import AnimeCard from '../AnimeCard/AnimeCard';

export default function Catalog() {
    const [animeList, setAnimeList] = useState<AnimeItem[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const pageSize = 18;

    const loadAnime = async (currentPage: number) => {
        setLoading(true);
        try {
            const response = await animeApi.getListAnime(currentPage, pageSize) as any;
            
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
        loadAnime(1);
    }, []);

    const goToPage = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            loadAnime(newPage);
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
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
                {animeList.map(anime => (
                    <div key={anime.id} className="flex justify-center">
                        <AnimeCard anime={anime} />
                    </div>
                ))}
            </div>

            {/* Пагинация */}
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