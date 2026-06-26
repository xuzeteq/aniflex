import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useFavorites } from '../../contexts/FavouriteContext';
import { animeApi } from '../../api';

interface FavoriteButtonProps {
    animeId: number;
    onToggle?: () => void;
}

export default function FavoriteButton({ animeId, onToggle }: FavoriteButtonProps) {
    const { isAuthenticated } = useAuth();
    const { isFavorite, refresh } = useFavorites();
    const [loading, setLoading] = useState(false);

    const toggleFavorite = async (e: React.MouseEvent) => {
        e.stopPropagation();
        
        if (!isAuthenticated) {
            window.location.href = '/auth';
            return;
        }

        setLoading(true);
        try {
            if (isFavorite(animeId)) {
                await animeApi.removeFavourite(animeId);
            } else {
                await animeApi.addFavourite(animeId);
            }
            await refresh();  // Обновляем список
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
                    {isFavorite(animeId) ? '❤️' : '🖤'}
                </span>
            )}
        </button>
    );
}