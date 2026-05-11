import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { animeApi } from '../../api';

interface FavoriteButtonProps {
    animeId: number;
    onToggle?: () => void;
}

export default function FavoriteButton({ animeId, onToggle }: FavoriteButtonProps) {
    const { isAuthenticated } = useAuth();
    const [isFavorite, setIsFavorite] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            checkFavorite();
        }
    }, [animeId, isAuthenticated]);

    const checkFavorite = async () => {
        try {
            const ids = await animeApi.getFavoriteIds();
            setIsFavorite(ids.includes(animeId));
        } catch (err) {
            console.error(err);
        }
    };

    const toggleFavorite = async (e: React.MouseEvent) => {
        e.stopPropagation();
        
        if (!isAuthenticated) {
            window.location.href = '/auth';
            return;
        }

        setLoading(true);
        try {
            if (isFavorite) {
                await animeApi.removeFavourite(animeId);
                setIsFavorite(false);
            } else {
                await animeApi.addFavourite(animeId);
                setIsFavorite(true);
            }
            onToggle?.();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={toggleFavorite}
            disabled={loading}
            className="cursor-pointer absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center backdrop-blur-sm hover:scale-110 transition z-10"
        >
            {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
                <span className="text-xl">
                    {isFavorite ? '❤️' : '🖤'}
                </span>
            )}
        </button>
    );
}