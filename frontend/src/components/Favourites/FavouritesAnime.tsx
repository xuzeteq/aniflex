import { useEffect, useState } from "react"
import { type AnimeItem } from "../../types"
import { animeApi } from "../../api";
import AnimeCard from "../AnimeCard/AnimeCard";

export default function FavouritesAnime() {
    
    const [animeList, setAnimeList] = useState<AnimeItem[]>([]);

    useEffect(() => {
        animeApi.getFavorites().then(res => setAnimeList(res));
    }, [])

    return (
        <>
        <h1 className="font-mono text-[#d1d1d1] text-2xl font-black pb-4">Любимое:</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
            {animeList.map(fav => (
                <div key={fav.id} className="flex justify-center">
                    <AnimeCard anime={fav}/>
                </div>
            ))}
        </div>
        </>
    )
}