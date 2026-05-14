import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

export interface User {
    id: number;
    username: string;
    email: string;
    avatarUrl: string;
    isBlocked: boolean;
    isVerify: boolean;
    favouritesCount: number;
    ratingsCount: number;
    role: string;
    createdAt: Date | string;
}

export default function ProfilePage() {
    const { id } = useParams<{ id: string }>();
    const { user: currentUser } = useAuth();
    
    const navigate = useNavigate();
    const [profileUser, setProfileUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const handleOpenLogsPage = () => {
        navigate('/audit-logs');
    }
    const handleOpenUsersPage = () => {
        navigate('/users')
    }

    useEffect(() => {
        const fetchUser = async () => {
            if (!id) {
                setProfileUser(currentUser);
                setLoading(false);
                return;
            }
            
            try {
                setLoading(true);
                const { data } = await axios.get(`https://localhost:7068/api/User/get-user-${id}`);
                setProfileUser(data);
                setError(null);
            } catch (err: any) {
                console.error("Ошибка загрузки профиля:", err);
                setError(err.response?.data?.message || "Не удалось загрузить профиль");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [id, currentUser]);

    const user = profileUser;
    const isOwnProfile = currentUser?.id === user?.id;

    if (loading) {
        return (
            <div className="layout-shell flex min-h-[60vh] items-center justify-center py-8">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin"></div>
                    <p className="text-gray-500 text-sm animate-pulse">Загрузка...</p>
                </div>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="layout-shell flex min-h-[60vh] items-center justify-center py-8">
                <div className="w-full bg-[#0a0a0a] border border-red-900/30 rounded-2xl p-6 text-center space-y-4 shadow-2xl">
                    <div className="text-4xl mb-2">⚠️</div>
                    <h2 className="text-lg font-bold text-white">Ошибка</h2>
                    <p className="text-gray-400 text-sm">{error || "Пользователь не найден"}</p>
                    <Link to="/" className="inline-block px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition text-sm font-medium border border-gray-700">
                        На главную
                    </Link>
                </div>
            </div>
        );
    }


    const regDate = new Date(user.createdAt).toLocaleDateString('ru-RU', {
        day: 'numeric', month: 'long', year: 'numeric'
    });

    const stats = [
        // { label: 'Просмотрено', value: '—', icon: '▶️' },
        { label: 'Избранное', value: user?.favouritesCount || '—', icon: '❤️‍🔥' },
        { label: 'Оценки', value: user?.ratingsCount || '—', icon: '⭐' },
        // { label: 'Комменты', value: '—', icon: '💬' },
    ];

    const infoItems = [
        { label: 'ID', value: `#${user.id}`, icon: '🆔' },
        { label: 'Роль', value: user.role === 'Admin' ? 'Администратор' : user.role === 'Moderator' ? 'Модератор' : 'Пользователь', icon: '👤' },
        { label: 'Верификация', value: user.isVerify ? 'Подтверждён' : 'Нет', icon: '🛡️' },
        { label: 'Статус', value: user.isBlocked ? 'Заблокирован' : 'Активен', icon: '📡' },
    ];

    return (
        <div className="layout-shell space-y-4 py-6 sm:py-8">
            
            {/* HERO СЕКЦИЯ */}
            <div className="relative bg-[#0a0a0a] border border-gray-800 rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(34,197,94,0.12)_0%,transparent_70%)]"></div>
                
                <div className="relative p-5 flex flex-col items-center text-center space-y-3">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-green-500/20 rounded-full blur-md group-hover:bg-green-500/30 transition-all duration-300"></div>
                        <img
                            src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.username}&background=064e3b&color=22c55e`}
                            alt={user.username}
                            className="relative w-24 h-24 rounded-full border-2 border-gray-800 object-cover bg-gray-900"
                        />
                        {user.isVerify && (
                            <div className="absolute bottom-0 right-0 bg-green-500 text-white p-1 rounded-full border-2 border-[#0a0a0a] shadow-lg">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        )}
                    </div>
                    
                    <div>
                        <h1 className="text-xl font-bold text-white tracking-tight">{user.username}</h1>
                        <p className="text-gray-400 text-sm mt-0.5 truncate max-w-50 mx-auto">{user.email}</p>
                        <div className="flex items-center justify-center gap-2 mt-2">
                            <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold uppercase tracking-wide border ${
                                user.role?.toLowerCase() === 'admin' 
                                ? 'bg-green-500/10 border-green-500/30 text-green-400 shadow-[0_0_8px_rgba(34,197,94,0.2)]' 
                                : 'bg-gray-800/50 border-gray-700 text-gray-400'
                            }`}>
                                {user.role === 'Admin' ? 'Администратор' : 'Участник'}
                            </span>
                            <span className="text-[10px] text-gray-600">•</span>
                            <span className="text-[11px] text-gray-500">{regDate}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* АДМИН-ПАНЕЛЬ */}
            {isOwnProfile && user.role?.toLowerCase() === 'admin' && (
                <div className="bg-[#0b100e] border border-green-500/20 rounded-2xl p-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/5 blur-3xl rounded-full"></div>
                    <div className="relative z-10 space-y-3">
                        <h3 className="text-xs font-bold text-green-400 uppercase tracking-widest flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                            Панель управления
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                            <button onClick={handleOpenUsersPage} className="py-2 px-3 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 text-green-300 rounded-lg text-xs font-medium transition active:scale-95 text-center">
                                👥 Юзеры
                            </button>
                            
                                <button onClick={handleOpenLogsPage} className="py-2 px-3 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 text-green-300 rounded-lg text-xs font-medium transition active:scale-95 text-center">
                                    📊 Логи
                                </button>
                            <button className="py-2 px-3 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 text-gray-300 rounded-lg text-xs font-medium transition active:scale-95 text-center col-span-2">
                                ⚙️ Настройки
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* СТАТИСТИКА */}
            <div className='grid grid-cols-2 gap-2.5'>
                {stats.map((stat, i) => (
                    <div key={i} className="bg-[#0a0a0a] border border-gray-800 hover:border-green-500/30 rounded-xl p-3 transition-all duration-200 group cursor-default">
                        <div className="text-lg mb-1 filter drop-shadow-[0_0_6px_rgba(0,0,0,0.5)] transition-transform">{stat.icon}</div>
                        <div className="text-lg font-bold text-white">{stat.value}</div>
                        <div className="text-[10px] uppercase tracking-wider text-gray-500 group-hover:text-green-400/70 transition-colors mt-0.5">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* ИНФОРМАЦИЯ */}
            <div className="bg-[#0a0a0a] border border-gray-800 rounded-2xl overflow-hidden">
                {infoItems.map((item, i) => (
                    <div key={i} className={`flex items-center justify-between px-4 py-3 ${i !== infoItems.length - 1 ? 'border-b border-gray-800/50' : ''} hover:bg-gray-900/30 transition-colors`}>
                        <div className="flex items-center gap-3">
                            <span className="text-base opacity-80">{item.icon}</span>
                            <span className="text-sm text-gray-400">{item.label}</span>
                        </div>
                        <span className={`text-sm font-medium ${
                            item.label === 'Статус' 
                                ? (user.isBlocked ? 'text-red-400' : 'text-green-400')
                            : item.label === 'Верификация' 
                                ? (user.isVerify ? 'text-green-400' : 'text-yellow-400')
                            : item.label === 'Роль'
                                ? (user.role === 'Admin' ? 'text-red-400' : user.role === 'Moderator' ? 'text-blue-400' : 'text-gray-300')
                            : 'text-gray-200'
                        }`}>
                            {item.value}
                        </span>
                    </div>
                ))}
            </div>

        </div>
    );
}