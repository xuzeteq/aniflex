import { animeApi } from '../../api'
import { useEffect, useState } from "react"
import type { AnimeItem } from '../../types';
import AnimeCard from '../AnimeCard/AnimeCard';

export default function Catalog() {

    const [animeList, setAnimeList] = useState<AnimeItem[]>([]);

    useEffect(() => {
        animeApi.getAll().then(data => setAnimeList(data)).catch(error => console.error(error))
    }, [])

    return (
        <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
                {animeList.map(anime => (
                    <div key={anime.id} className="flex justify-center">
                        <AnimeCard anime={anime}/>
                    </div>
                ))}
            </div>
        </>
    )
}