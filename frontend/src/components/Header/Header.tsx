import { useState, useEffect } from 'react';
import './Header.css';
import { animeApi } from "../../api";
import type { AnimeItem } from "../../types";
import AnimeCard from "../AnimeCard/AnimeCard";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import UserMenu from '../UserMenu/UserMenu';

export default function Header() {

    const navigate = useNavigate();

    const {isAuthenticated} = useAuth();

    const [activeSearch, setActiveSearch] = useState(false);
    const [text, setText] = useState('');
    const [animeList, setAnimeList] = useState<AnimeItem[]>([]);

    useEffect(() => {
        animeApi.getAll().then(setAnimeList);
    }, [])

    const filteredAnime = animeList?.filter(anime => 
        anime.title.toLowerCase().includes(text.toLowerCase())
    );

    const handleRandom = async () => {
        try {
            const randomAnime = await animeApi.getRandomAnime();

            if (randomAnime.id)
                navigate(`/anime/${randomAnime.id}`);
        } catch (err) {
            console.error(err);
        }
    }

    const headerActions = (
        <>
            <button type="button" className="text-xl sm:text-2xl" onClick={() => setActiveSearch(true)} aria-label="Поиск">🔎</button>
            {isAuthenticated ? (
                <UserMenu />
            ) : (
                <Link to={"/auth"}>
                    <button className="text-lg sm:text-2xl font-bold text-[#d1d1d1]">Войти</button>
                </Link>
            )}
        </>
    );

    return (
        <> 
                    <div className={`fixed inset-0 bg-[#141414] z-50 overflow-auto p-4 sm:p-8 transition-all duration-300
                ${activeSearch ? 'translate-y-0 visible' : 'opacity-0 translate-y-full invisible'} `}>

                <div className="layout-shell">
                    <div className="flex justify-between items-center gap-4 mb-6 sm:mb-8">
                        <h2 className="text-xl sm:text-3xl font-semibold text-[#d1d1d1]">Поиск аниме</h2>
                        <button
                            onClick={() => {
                                setActiveSearch(false);
                                setText('');
                            }}
                            className="text-4xl text-[#d1d1d1] hover:text-white transition"
                        >
                            ✕
                        </button>
                    </div>

                    <input
                        type="text"
                        value={text}
                        autoFocus
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Название аниме..."
                        className="w-full bg-[#2a2a2a] text-white h-12 rounded-md focus:outline-none text-xl px-4"
                    />

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mt-8">
                        {filteredAnime.map(anime => (
                            <AnimeCard key={anime.id} anime={anime} onClick={() => {
                                setActiveSearch(false);
                                setText('')
                            }} />
                        ))}
                    </div>
                </div>
            </div>



                <div className="border-b border-b-[#333333] bg-[#1e1e1e]">
                    <div className="layout-shell flex flex-col gap-4 py-3 md:flex-row md:items-center md:justify-between md:gap-6 md:py-2 md:min-h-16">
                        <div className="flex w-full items-center justify-between gap-4 md:w-auto md:shrink-0">
                            <div className="logo shrink-0">
                                <Link to={`/`}>
                                    <h2 className="font-bold text-2xl sm:text-3xl text-green-400 font-mono">aniflex</h2>
                                </Link>
                            </div>
                            <div className="flex items-center gap-3 text-[#dddddd] md:hidden">
                                {headerActions}
                            </div>
                        </div>

                        <nav className="w-full min-w-0 md:flex-1">
                            <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-[#bbbbbb] text-sm sm:text-base md:justify-start">
                                <li><a className="hover:text-[#dbd8d8] transition-all duration-250" href="/catalog">Каталог</a></li>
                                <li><a className="hover:text-[#dbd8d8] transition-all duration-250" href="/ongoing">Онгоинг</a></li>
                                <li><a className="hover:text-[#dbd8d8] transition-all duration-250" href="/anime/year/2025">2025</a></li>
                                <li><a className="hover:text-[#dbd8d8] transition-all duration-250" href="/anime/year/2026">2026</a></li>
                                <li><a onClick={handleRandom} className="hover:text-[#dbd8d8] transition-all duration-250 cursor-pointer">Случайное аниме</a></li>
                            </ul>
                        </nav>

                        <div className="hidden md:flex items-center gap-4 text-[#dddddd] shrink-0">
                            {headerActions}
                        </div>
                    </div>
                </div>

        </>
    )
}