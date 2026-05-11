// src/pages/ForgotPassword.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApiClient } from "../../authApi";

export default function ForgotPasswordPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleSendCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!isValidEmail(email)) {
            setError("Введите корректный email");
            return;
        }

        setLoading(true);
        try {
            await authApiClient.resetPasswordCode(email);
            setSent(true);
        } catch (err: any) {
            setError(err.message || "Не удалось отправить код");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="layout-shell flex justify-center py-10">
            <div className="w-full max-w-xl bg-[#1e1e1e] p-6 sm:p-8 rounded-xl shadow-lg">
                <h2 className="text-3xl font-bold text-white text-center">Восстановление пароля</h2>
                <p className="text-gray-400 text-center mt-2">
                    Введите почту, и мы пришлём код для сброса
                </p>

                {error && <p className="text-red-400 text-center mt-4 text-sm">{error}</p>}

                {sent ? (
                    <div className="text-center mt-6 space-y-4">
                        <p className="text-green-400 font-medium">✅ Код отправлен на {email}</p>
                        <button
                            onClick={() => navigate("/reset-password", { state: { email } })}
                            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold h-12 rounded-lg transition"
                        >
                            Ввести код
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSendCode} className="mt-6 space-y-4">
                        <input
                            type="email"
                            value={email}
                            placeholder="admin@gmail.com"
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (error) setError("");
                            }}
                            className="w-full bg-[#2a2a2a] text-white h-12 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                            required
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold h-12 rounded-lg transition disabled:opacity-50"
                        >
                            {loading ? "Отправка..." : "Отправить код"}
                        </button>
                    </form>
                )}

                <button
                    onClick={() => navigate("/auth")}
                    className="mt-6 text-gray-400 hover:text-white text-center w-full text-sm transition"
                >
                    ← Назад к входу
                </button>
            </div>
        </div>
    );
}