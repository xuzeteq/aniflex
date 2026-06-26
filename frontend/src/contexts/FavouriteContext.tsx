import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { animeApi } from '../api';

interface FavoriteContextType {
    favoriteIds: number[];
    refresh: () => Promise<void>;
    isFavorite: (animeId: number) => boolean;
}

const FavoriteContext = createContext<FavoriteContextType>({
    favoriteIds: [],
    refresh: async () => {},
    isFavorite: () => false
});

export const useFavorites = () => useContext(FavoriteContext);

export function FavoriteProvider({ children }: { children: ReactNode }) {
    const { isAuthenticated } = useAuth();
    const [favoriteIds, setFavoriteIds] = useState<number[]>([]);

    const refresh = async () => {
        if (isAuthenticated) {
            try {
                const ids = await animeApi.getFavoriteIds();
                setFavoriteIds(ids);
            } catch (error) {
                console.error('Ошибка загрузки избранного:', error);
            }
        } else {
            setFavoriteIds([]);
        }
    };

    useEffect(() => {
        refresh();
    }, [isAuthenticated]);

    const isFavorite = (animeId: number) => favoriteIds.includes(animeId);

    return (
        <FavoriteContext.Provider value={{ favoriteIds, refresh, isFavorite }}>
            {children}
        </FavoriteContext.Provider>
    );
}