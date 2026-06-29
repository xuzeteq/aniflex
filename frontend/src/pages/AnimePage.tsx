import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import type { AnimeItem, Episode, Comment } from "../types";
import { animeApi } from "../api";
import RatingStars from "../components/Rating/RatingStar";
import AnimeCard from "../components/AnimeCard/AnimeCard";
import axios from "axios";
import CommentItem from "../components/Comments/CommentItem";
import CommentForm from "../components/Comments/CommentForm";


export default function AnimePage() {

    const { id } = useParams<{id: string}>();
    const [anime, setAnime] = useState<AnimeItem | null>(null);
    const [episodes, setEpisodes] = useState<Episode[] | null>(null);
    const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
    const [relatedAnime, setRelatedAnime] = useState<AnimeItem[]>([]);
    const [comments, setComments] = useState<Comment[]>([]);

    const loadRelated = async () => {
        try {
            const data = await animeApi.getRelatedAnime(Number(id));
            setRelatedAnime(data);
        }
        catch (err) {
            console.error(err);
        }
    }

    const handleNewComment = (newComment: Comment) => {
        setComments((prev) => [newComment, ...prev] );
    }

    useEffect(() => {
        try {
            axios.get(`/api/Comments/anime-comments/${id}`).then(res => setComments(res.data));
        }
        catch (err) {
            console.error(err);
        }
        
    }, [id])

    useEffect(() => {
        if (!id) return;
        animeApi.getById(Number(id)).then(data => setAnime(data));
        loadRelated();
    }, [id])

    useEffect(() => {
        if (!anime?.id) return;
        animeApi.getEpisodesByAnime(anime.id).then(data => {
            setEpisodes(data);
            if (data.length > 0) {
                setSelectedEpisode(data[0]);
            }
        });
    }, [anime?.id]);

        const handleEpisodeClick = (episode: Episode) => {
        setSelectedEpisode(episode);
        document.getElementById('player-container')?.scrollIntoView({ behavior: 'smooth' });
    };

    if (!anime) {
        return (
            <div className="layout-shell py-6 sm:py-8">
                <div className="text-[#d1d1d1] text-lg">Загрузка...</div>
            </div>
        )
    };

    return (
        <>
        <div className="layout-shell py-6 sm:py-8">
            <div className="min-w-0">
                <h3 className="text-[#d1d1d1] font-bold text-2xl leading-tight sm:text-4xl">{anime?.title}</h3>
                <h4 className="text-[#bbbbbb]">{anime?.originalTitle}</h4>
            </div>

            {anime && <RatingStars animeId={anime.id} onRated={() => animeApi.getById(anime.id).then(setAnime)} />}

            <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-start">
                <div className="mx-auto w-full shrink-0 max-w-56 sm:max-w-xs lg:mx-0">
                    <img src={anime?.posterUrl} loading="lazy" alt="" className="w-70 rounded-xl object-cover aspect-2/3 max-h-112" />
                </div>
                
                <div className="grid min-w-0 flex-1 grid-cols-2 gap-x-4 gap-y-4 sm:gap-x-12 lg:gap-x-20 sm:gap-y-5">
                    <div className="text-base sm:text-lg text-[#666666]">Тип</div>
                    <div className="text-base sm:text-lg text-[#bbbbbb] wrap-break-words">{anime?.typeName}</div>

                    <div className="text-base sm:text-lg text-[#666666]">Эпизоды</div>
                    <div className="text-base sm:text-lg text-[#bbbbbb] wrap-break-words">{anime?.episodes} / {anime?.maxEpisodes}</div>

                    <div className="text-base sm:text-lg text-[#666666]">Год выхода</div>
                    <div className="text-base sm:text-lg text-[#bbbbbb] wrap-break-words">{anime?.releaseYear}</div>

                    <div className="text-base sm:text-lg text-[#666666]">Рейтинг</div>
                    <div className="text-base sm:text-lg text-[#bbbbbb] wrap-break-words">{anime?.averageRating}</div>

                    <div className="text-base sm:text-lg text-[#666666]">Количество оценок</div>
                    <div className="text-base sm:text-lg text-[#bbbbbb] wrap-break-words">{anime?.ratingsCount}</div>

                    <div className="text-base sm:text-lg text-[#666666]">Студия</div>
                    <div className="text-base sm:text-lg text-[#bbbbbb] wrap-break-words">{anime?.studio}</div>

                    <div className="text-base sm:text-lg text-[#666666]">Сезон</div>
                    <div className="text-base sm:text-lg text-[#bbbbbb] wrap-break-words">{anime?.seasonName}</div>

                    <div className="text-base sm:text-lg text-[#666666]">Статус</div>
                    <div className="text-base sm:text-lg text-[#bbbbbb] wrap-break-words">{anime?.statusName}</div>

                    <div className="text-base sm:text-lg text-[#666666]">Жанры</div>
                    <div className="text-base sm:text-lg text-[#bbbbbb] min-w-0 wrap-break-words">{anime?.genres.join(', ')}</div>
                </div>    
            </div>

            <div>
                <p className="text-base sm:text-lg text-[#d1d1d1] my-8 sm:my-10 wrap-break-words">{anime?.description}</p>
            </div>

            {selectedEpisode && (
                <div>
                    <div className="relative w-full mx-auto overflow-hidden rounded-2xl bg-black aspect-video">
                        <iframe 
                            src={selectedEpisode.videoUrl}
                            title={`Серия ${selectedEpisode.episodeNumber}`}
                            className="absolute inset-0 h-full w-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" 
                            allowFullScreen
                        />
                    </div>

                {episodes && episodes.length > 0 && (
                    <div className="bg-[#1e1e1e] p-4 rounded-xl mt-4">
                        <h4 className="text-[#d1d1d1] mb-3 font-semibold">Список серий:</h4>
                        <div className="flex flex-wrap gap-2">
                            {episodes.map((ep) => (
                                <button
                                    key={ep.id}
                                    onClick={() => handleEpisodeClick(ep)}
                                    className={`px-4 py-2 rounded-md transition-colors ${
                                        selectedEpisode?.id === ep.id 
                                            ? 'bg-green-600 text-white font-bold' 
                                            : 'bg-green-900 text-[#bbbbbb] hover:bg-green-700'
                                    }`}
                                >
                                    {ep.episodeNumber}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                {relatedAnime.length > 0 && (
                    <div className="mt-6">
                        <h1 className="font-mono text-[#d1d1d1] text-2xl font-black pb-4">Связанное:</h1>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
                            {relatedAnime.map(rel => (
                                <AnimeCard anime={rel} key={rel.id}/>
                            ))}
                        </div>
                    </div>
                )}
              </div>
            )}

            <div>
                <div>
                    <h2 className="font-mono text-[#d1d1d1] text-2xl font-black py-2 pt-6">Комментарии ({comments.length})</h2>

                    <div className="grid grid-cols-1 gap-2">
                        {comments.length > 0 ? (
                            comments.map((comm) => (
                                    <CommentItem
                                    text={comm.text}
                                    userId={comm.userId}
                                    animeId={comm.animeId}
                                    userRole={comm.userRole}
                                    avatarUrl={comm.avatarUrl}
                                    username={comm.username}
                                    createdAt={comm.createdAt}
                                />
                            )))
                        :
                        <p className="py-2 text-xl text-[#d1d1d1]">Комментариев пока что нет. Напишите первый!</p>
                        }
                    </div>

                    <CommentForm animeId={anime!.id} onCommentAdded={handleNewComment}/>
                </div>
            </div>
        </div>
        </>
    )
}