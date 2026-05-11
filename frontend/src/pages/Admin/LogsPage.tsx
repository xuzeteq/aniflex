import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface LogEntry {
    timestamp: string;
    level: string;
    message: string;
    raw: string;
}

export default function LogsPage() {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [lines, setLines] = useState(100);

    if (!isAuthenticated || user?.role !== 'Admin') {
        navigate('/not-allowed');
    }

    useEffect(() => {
        fetchLogs();
    }, [lines]);

    const fetchLogs = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/Log/logs?lines=${lines}`, { credentials: 'include' });
            const data = await res.json();
            setLogs(data);
        } catch (err) {
            console.error('Ошибка загрузки логов:', err);
        } finally {
            setLoading(false);
        }
    };

    const getLevelStyle = (level: string) => {
        switch (level?.toUpperCase()) {
            case 'INF': return 'bg-green-500/10 text-green-400 border-green-500/30';
            case 'WRN': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
            case 'ERR': return 'bg-red-500/10 text-red-400 border-red-500/30';
            default: return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
        }
    };

    const filteredLogs = logs.filter(log => {
        if (filter === 'all') return true;
        if (filter === 'info') return log.level === 'INF';
        if (filter === 'warn') return log.level === 'WRN';
        if (filter === 'error') return log.level === 'ERR';
        return true;
    });

    return (
        <div className="layout-shell space-y-4 py-4 sm:py-6">
            {/* Заголовок */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-xl font-bold text-white shrink-0">📋 Системные логи</h1>
                <div className="flex flex-wrap gap-2">
                    <select
                        value={lines}
                        onChange={(e) => setLines(Number(e.target.value))}
                        className="bg-[#1e1e1e] text-white text-sm px-3 py-1 rounded-lg border border-gray-700"
                    >
                        <option value={50}>50 строк</option>
                        <option value={100}>100 строк</option>
                        <option value={200}>200 строк</option>
                        <option value={500}>500 строк</option>
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
                {['all', 'info', 'warn', 'error'].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-3 py-1 rounded-lg text-sm transition ${
                            filter === f
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }`}
                    >
                        {f === 'all' ? 'Все' : f === 'info' ? 'INFO' : f === 'warn' ? 'WARN' : 'ERROR'}
                    </button>
                ))}
            </div>

            {/* Список логов */}
            {loading ? (
                <div className="text-center py-8 text-gray-400">Загрузка логов...</div>
            ) : filteredLogs.length === 0 ? (
                <div className="text-center py-8 text-gray-500">Логи не найдены</div>
            ) : (
                <div className="space-y-1 font-mono text-xs max-h-[70vh] overflow-auto">
                    {filteredLogs.map((log, i) => (
                        <div
                            key={i}
                            className={`p-2 rounded border ${getLevelStyle(log.level)}`}
                        >
                            <div className="flex gap-2 items-start">
                                <span className="text-gray-500 shrink-0 whitespace-nowrap">
                                    {new Date(log.timestamp).toLocaleTimeString()}
                                </span>
                                <span className="shrink-0">[{log.level}]</span>
                                <span className="break-all">{log.message}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}