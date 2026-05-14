import type { AnimeItem } from '../../types'
import { Link } from 'react-router-dom'
import FavouriteButton from '../FavouriteButton/FavouriteButton'

interface animeCardProps {
    anime: AnimeItem
    onClick?: () => void
}

export default function AnimeCard({anime, onClick}: animeCardProps) {
    return (
        <>
            <div className="relative h-full w-full max-w-50 cursor-pointer">
                <Link to={`/anime/${anime.id}`} onClick={onClick} >
                    <img src={anime.posterUrl} alt={anime.title} className="w-full aspect-2/3 object-cover rounded" />
                    <FavouriteButton animeId={anime.id}/>
                    <p className="text-md text-[#818181] truncate pt-1">{anime.originalTitle}</p>
                    <p className="text-xl text-[#bbbbbb] hover:text-[#d1d1d1] transition-all duration-150 truncate">{anime.title}</p>
                </Link>
                <FavouriteButton animeId={anime.id}/>
            </div>
        </>
    )
}