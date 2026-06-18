import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { adminApi, type UserDto } from '../../adminApi';
import { useNavigate } from 'react-router-dom';

export default function UsersPage() {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const [users, setUsers] = useState<UserDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [filterRole, setFilterRole] = useState<string>('all');
    const [filterStatus, setFilterStatus] = useState<string>('all');

    if (!isAuthenticated || user?.role !== 'Admin') {
        navigate('/not-allowed');
    }

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await adminApi.getAllUsers();
            setUsers(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ошибка загрузки');
        } finally {
            setLoading(false);
        }
    };

    const handleBan = async (userId: number, currentStatus: boolean) => {
        try {
            await adminApi.banUser(userId, { isBlocked: !currentStatus });
            setUsers(users.map(u => 
                u.id === userId ? { ...u, isBlocked: !currentStatus } : u
            ));
        } catch (err) {
            alert('Ошибка при изменении статуса: ' + (err instanceof Error ? err.message : 'Неизвестная ошибка'));
        }
    };

    const handleVerify = async (userId: number, currentStatus: boolean) => {
        try {
            await adminApi.verifyUser(userId, { isVerify: !currentStatus });
            setUsers(users.map(u => 
                u.id === userId ? { ...u, isVerify: !currentStatus } : u
            ));
        } catch (err) {
            alert('Ошибка при изменении верификации: ' + (err instanceof Error ? err.message : 'Неизвестная ошибка'));
        }
    };

    // Фильтрация
    const filteredUsers = users.filter(u => {
        const matchesSearch = 
            u.username.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase());
        const matchesRole = filterRole === 'all' || u.role === filterRole;
        const matchesStatus = 
            filterStatus === 'all' ||
            (filterStatus === 'blocked' && u.isBlocked) ||
            (filterStatus === 'active' && !u.isBlocked);
        
        return matchesSearch && matchesRole && matchesStatus;
    });

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="layout-shell space-y-6 py-4 sm:py-6">

            {/* Заголовок */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">👥 Управление пользователями</h1>
                    <p className="text-gray-400 text-sm mt-1">
                        Всего: {filteredUsers.length} из {users.length}
                    </p>
                </div>
                
                {/* Кнопка обновления */}
                <button
                    onClick={loadUsers}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition flex items-center gap-2 self-start"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Обновить
                </button>
            </div>

            <div className="bg-[#1e1e1e] p-4 rounded-xl border border-gray-800 space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="🔍 Поиск по нику или email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-green-500 transition"
                        />
                    </div>
                    
                    <select
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                        className="w-full min-w-0 bg-[#2a2a2a] text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-green-500 sm:w-auto sm:min-w-40"
                    >
                        <option value="all">Все роли</option>
                        <option value="User">Пользователь</option>
                        <option value="Admin">Администратор</option>
                        <option value="Moderator">Модератор</option>
                    </select>

                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="w-full min-w-0 bg-[#2a2a2a] text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-green-500 sm:w-auto sm:min-w-40"
                    >
                        <option value="all">Все статусы</option>
                        <option value="active">Активные</option>
                        <option value="blocked">Заблокированные</option>
                    </select>
                </div>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg">
                    ❌ {error}
                </div>
            )}

            <div className="bg-[#1e1e1e] rounded-xl border border-gray-800 overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-700 border-t-green-500"></div>
                        <p className="text-gray-400 mt-4">Загрузка пользователей...</p>
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="p-12 text-center text-gray-400">
                        <div className="text-4xl mb-2">😕</div>
                        <p>Пользователи не найдены</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-800/50 text-gray-300 uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-4">Пользователь</th>
                                    <th className="px-6 py-4">Роль</th>
                                    <th className="px-6 py-4 text-center">Статус</th>
                                    <th className="px-6 py-4 text-center">Дата регистрации</th>
                                    <th className="px-6 py-4 text-center">Действия</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {filteredUsers.map((u) => (
                                    <tr key={u.id} className="hover:bg-gray-800/30 transition">
                                        {/* Пользователь */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <img 
                                                    src={u.avatarUrl || '/default-avatar.png'} 
                                                    alt={u.username}
                                                    className="w-10 h-10 rounded-full object-cover bg-gray-700"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = '/default-avatar.png';
                                                    }}
                                                />
                                                <div>
                                                    <div className="font-medium text-white inline-flex items-center gap-1">
                                                        {u.username}
                                                        {u.isVerify && (
                                                            <span className="inline-flex items-center justify-center w-4 h-4 bg-green-500 rounded-full">
                                                                <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-xs text-gray-500">{u.email}</div>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                                u.role === 'Admin' 
                                                    ? 'bg-green-500/10 border-green-500/30 text-green-400 shadow-[0_0_8px_rgba(34,197,94,0.2)]'
                                                    : u.role === 'Moderator'
                                                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                                    : 'bg-gray-800/50 border-gray-700 text-gray-400'
                                            }`}>
                                                {u.role === 'Admin' ? 'Администратор' : u.role === 'Moderator' ? 'Модератор' : 'Пользователь'}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 text-center">
                                            {u.isBlocked ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-red-500/20 text-red-400 border border-red-500/30">
                                                    <span></span> Заблокирован
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-green-500/20 text-green-400 border border-green-500/30">
                                                    <span></span> Активен
                                                </span>
                                            )}
                                        </td>

                                        <td className="px-6 py-4 text-center text-gray-400">
                                            {formatDate(u.createdAt)}
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleBan(u.id, u.isBlocked)}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                                                        u.isBlocked
                                                            ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30'
                                                            : 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30'
                                                    }`}
                                                    title={u.isBlocked ? 'Разблокировать' : 'Заблокировать'}
                                                >
                                                    {u.isBlocked ? '🔓 Разбан' : '🔒 Бан'}
                                                </button>

                                                <button
                                                    onClick={() => handleVerify(u.id, u.isVerify)}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                                                        u.isVerify
                                                            ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 border border-yellow-500/30'
                                                            : 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30'
                                                    }`}
                                                    title={u.isVerify ? 'Снять верификацию' : 'Верифицировать'}
                                                >
                                                    {u.isVerify ? '✗ Снять ✓' : '✓ Вериф.'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}