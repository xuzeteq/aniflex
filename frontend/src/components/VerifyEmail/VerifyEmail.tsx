import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { authApiClient } from "../../authApi";

export default function VerifyEmail() {
    const { state } = useLocation();
    const navigate = useNavigate();
    
    const email = state?.email;
    const formData = state?.formData;

    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!email || !formData) navigate('/auth', { replace: true });
    }, [email, formData, navigate]);

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        if (code.length !== 6) {
            setError("Код должен содержать 6 цифр"); return;
        }

        setLoading(true);
        try {
            await authApiClient.verifyEmail(email, code);
            
            await authApiClient.register(formData);
            navigate("/");
        } catch (err: any) {
            setError("Неверный код или время вышло");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="layout-shell z-50 flex justify-center py-12 sm:py-16">
            <div className="h-auto w-full max-w-xl bg-[#1e1e1e] rounded-xl p-6 sm:p-8">
                <h1 className="font-bold text-3xl text-center text-white">Подтвердите почту</h1>
                <p className="text-gray-400 text-center mt-2">Код отправлен на {email}</p>
                
                <form onSubmit={handleVerify} className="pt-8">
                    <input
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        autoFocus
                        value={code}
                        placeholder="123456"
                        onChange={e => {
                            setCode(e.target.value.replace(/\D/g, ''));
                            if (error) setError('');
                        }}
                        className={`w-full bg-[#2a2a2a] text-white h-10 rounded text-center text-xl tracking-widest focus:outline-none ${error ? 'border-2 border-red-400' : ''}`}
                    />
                    {error && <p className="text-red-400 text-center mt-2">{error}</p>}
                    
                    <button disabled={loading} className="mt-4 w-full bg-green-400 h-10 rounded font-bold text-white hover:bg-green-500 transition disabled:opacity-50">
                        {loading ? "Проверка..." : "Подтвердить"}
                    </button>
                </form>
            </div>
        </div>
    );
}