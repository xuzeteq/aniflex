import { createContext, useContext, useState, useLayoutEffect, type ReactNode } from 'react';
import { authApiClient } from '../authApi';

interface User {
    id: number;
    username: string;
    email: string;
    avatarUrl: string;
    isBlocked: boolean;
    favouritesCount: number;
    ratingsCount: number;
    isVerify: boolean;
    role: string;
    createdAt: Date;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isInitialized: boolean;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isInitialized, setIsInitialized] = useState(false);

useLayoutEffect(() => {
    authApiClient.getCurrentUser()
        .then(userData => {
            if (userData) {
                setUser(userData);
                setIsAuthenticated(true);
            }
        })
        .catch(() => {})
        .finally(() => {
            setLoading(false);
            setIsInitialized(true);
        });
}, []);

    const login = async (username: string, password: string) => {
        const userData = await authApiClient.login({ username, password });
        setUser(userData);
        setIsAuthenticated(true);
    };

    const register = async (username: string, email: string, password: string) => {
        const userData = await authApiClient.register({username, email, password});
        setUser(userData);
        setIsAuthenticated(true);
    }

    const logout = async () => {
        await authApiClient.logout();
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, loading, login, register, logout, isInitialized }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};