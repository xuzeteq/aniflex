import { useEffect, useState } from "react"
import type { AnimeItem } from "../../types";
import { animeApi } from "../../api";
import AnimeCard from "../AnimeCard/AnimeCard";

export default function ThisYear() {

    const [animeList, setAnimeList] = useState<AnimeItem[]>([]);

    useEffect(() => {
        animeApi.getThisYear()
            .then(data => setAnimeList(data))
            .catch(err => console.error(err));
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