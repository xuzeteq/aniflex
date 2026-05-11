import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function BlockedPage() {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/auth');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4">
            <div className="bg-[#1e1e1e] border border-red-500/30 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Аккаунт заблокирован</h2>
                <p className="text-gray-400 mb-6">
                    Доступ к сайту ограничен. Если вы считаете это ошибкой, обратитесь в поддержку.
                </p>
                <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-lg transition font-medium"
                >
                    Выйти из аккаунта
                </button>
            </div>
        </div>
    );
}