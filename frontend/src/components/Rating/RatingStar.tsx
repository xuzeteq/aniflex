import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface RatingStarsProps {
    animeId?: number;
    onRated?: () => void;
}

export default function RatingStars({ animeId, onRated }: RatingStarsProps) {
    const { isAuthenticated } = useAuth();
    const [userRating, setUserRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [averageRating, setAverageRating] = useState(0);
    const [ratingsCount, setRatingsCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const displayRating = userRating > 0 ? userRating : Math.round(averageRating);

    useEffect(() => {
        if (animeId) {
            fetchUserRating();
            fetchAverageRating();
        }
    }, [animeId]);

    const fetchUserRating = async () => {
        if (!isAuthenticated || !animeId) return;
        try {
            const res = await fetch(`/api/Rating/user-rating?animeId=${animeId}`, { credentials: 'include' });
            const data = await res.json();
            setUserRating(data.rating);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchAverageRating = async () => {
        if (!animeId) return;
        try {
            const res = await fetch(`/api/AnimeItem/get-anime/${animeId}`, { credentials: 'include' });
            const data = await res.json();
            setAverageRating(data.averageRating);
            setRatingsCount(data.ratingsCount);
        } catch (err) {
            console.error(err);
        }
    };

const rate = async (value: number) => {
    if (!isAuthenticated) {
        window.location.href = '/auth';
        return;
    }
    if (!animeId) return;

    setLoading(true);
    try {
        const response = await fetch(`/api/rating/rate-anime?animeId=${animeId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ value }),
            credentials: 'include'
        });
        
        if (!response.ok) throw new Error('Ошибка');
        
        const data = await response.json();
        
        setUserRating(value);
        setAverageRating(data);
        
        onRated?.();
        
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
};

    return (
        <div className="flex flex-col gap-1 mt-2">
            <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                        <button
                            key={star}
                            onClick={() => rate(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            disabled={loading}
                            className={`text-xl transition ${
                                (hoverRating ? star <= hoverRating : star <= displayRating)
                                    ? 'text-green-400'
                                    : 'text-gray-600'
                            } ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}`}
                        >
                            ★
                        </button>
                    ))}
                </div>
                <span className="text-sm text-gray-400">
                    {averageRating ? averageRating.toFixed(1) : '0.0'} / 10 ({ratingsCount})
                </span>
            </div>
            {userRating > 0 && (
                <p className="text-xs text-gray-500">Ваша оценка: {userRating}</p>
            )}
        </div>
    );
}