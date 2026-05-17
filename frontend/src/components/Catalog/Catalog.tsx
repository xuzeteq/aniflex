import { animeApi } from '../../api'
import { useEffect, useState } from "react"
import type { AnimeItem } from '../../types';
import AnimeCard from '../AnimeCard/AnimeCard';

export default function Catalog() {

    const [animeList, setAnimeList] = useState<AnimeItem[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);

    const loadAnime = async (currentPage: number, append = false) => {
        try {
            const response = await animeApi.getListAnime(currentPage, 24);
            
            const newAnime = response || response;
            
            if (append) {
                setAnimeList([...animeList, ...newAnime]);
            } else {
                setAnimeList(newAnime);
            }
            
            setHasMore(newAnime.length === 24);
            setPage(currentPage);
            
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        loadAnime(1, false);
    }, [])

    const loadMore = () => {
        if (hasMore) {
            loadAnime(page + 1, true);
        }
    }

    return (
        <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
                {animeList.map(anime => (
                    <div key={anime.id} className="flex justify-center">
                        <AnimeCard anime={anime}/>
                    </div>
                ))}
            </div>

            {hasMore && (
                <div className="flex justify-center mt-8">
                    <button 
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-all duration-150 cursor-pointer"
                        onClick={loadMore}
                    >
                        Загрузить ещё
                    </button>
                </div>
            )}
        </>
    )
}