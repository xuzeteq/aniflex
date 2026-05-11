import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface AuditLog {
    id: number;
    adminUsername: string;
    action: string;
    targetUsername: string;
    details: string;
    createdAt: string;
}

export default function AuditLogsPage() {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [limit, setLimit] = useState(100);

    if (!isAuthenticated || user?.role !== 'Admin') {
        navigate('/not-allowed');
    }

    useEffect(() => {
        fetchLogs();
    }, [limit]);

    const fetchLogs = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/AuditLogs/audit-logs?take=${limit}`, { credentials: 'include' });
            const data = await res.json();
            setLogs(data);
        } catch (err) {
            console.error('Ошибка загрузки логов аудита:', err);
        } finally {
            setLoading(false);
        }
    };

    const getActionStyle = (action: string) => {
        if (action.includes('заблокировал') || action === 'BlockUser') 
            return 'bg-red-500/10 text-red-400 border-red-500/30';
        if (action.includes('разблокировал') || action === 'BlockUser') 
            return 'bg-green-500/10 text-green-400 border-green-500/30';
        if (action.includes('выдал верификацию') || action === 'VerifyUser') 
            return 'bg-green-500/10 text-green-400 border-green-500/30';
        if (action.includes('снял верификацию') || action === 'UnverifyUser') 
            return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
        return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    };

    const filteredLogs = logs.filter(log => {
        if (filter === 'all') return true;
        if (filter === 'block') return log.action.includes('блокировал') || log.action === 'BlockUser';
        if (filter === 'verify') return log.action.includes('верификацию') || log.action === 'VerifyUser';
        if (filter === 'unverify') return log.action.includes('Снятие') || log.action === 'UnverifyUser';
        return true;
    });

    return (
        <div className="layout-shell space-y-4 py-4 sm:py-6">
            {/* Заголовок */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-xl font-bold text-white shrink-0">📋 Логи аудита</h1>
                <div className="flex flex-wrap gap-2">
                    <select
                        value={limit}
                        onChange={(e) => setLimit(Number(e.target.value))}
                        className="bg-[#1e1e1e] text-white text-sm px-3 py-1 rounded-lg border border-gray-700"
                    >
                        <option value={50}>50 записей</option>
                        <option value={100}>100 записей</option>
                        <option value={200}>200 записей</option>
                        <option value={500}>500 записей</option>
                    </select>
                    <button
                        onClick={fetchLogs}
                        className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-sm hover:bg-green-500/30"
                    >
                        🔄 Обновить
                    </button>
                </div>
            </div>

            {/* Фильтры */}
            <div className="flex flex-wrap gap-2">
                {['all', 'block', 'verify', 'unverify'].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-3 py-1 rounded-lg text-sm transition ${
                            filter === f
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }`}
                    >
                        {f === 'all' ? 'Все' : f === 'block' ? 'Блокировки' : f === 'verify' ? 'Верификации' : 'Снятия'}
                    </button>
                ))}
            </div>

            {/* Список логов */}
            {loading ? (
                <div className="text-center py-8 text-gray-400">Загрузка логов...</div>
            ) : filteredLogs.length === 0 ? (
                <div className="text-center py-8 text-gray-500">Логи не найдены</div>
            ) : (
                <div className="space-y-2 max-h-[70vh] overflow-auto">
                    {filteredLogs.map((log) => (
                        <div
                            key={log.id}
                            className={`p-3 rounded border ${getActionStyle(log.action)}`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className="text-sm font-medium">
                                    Администратор {log.adminUsername} {log.action} пользователя {log.targetUsername}
                                </span>
                                <span className="text-xs text-gray-500 shrink-0 ml-4">
                                    {new Date(log.createdAt).toLocaleString()}
                                </span>
                            </div>
                            {log.details && (
                                <div className="text-xs text-gray-400 mt-1">
                                    📝 {log.details}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}