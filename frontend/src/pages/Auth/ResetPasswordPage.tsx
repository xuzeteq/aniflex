// src/pages/ResetPassword.tsx
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { authApiClient } from "../../authApi";

export default function ResetPasswordPage() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const email = state?.email;

    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!email) navigate("/forgot", { replace: true });
    }, [email, navigate]);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (code.length !== 6) { setError("Код должен содержать 6 цифр"); return; }
        if (newPassword.length < 6) { setError("Пароль должен быть не менее 6 символов"); return; }
        if (newPassword !== confirmPassword) { setError("Пароли не совпадают"); return; }

        setLoading(true);
        try {
            await authApiClient.resetPassword(email, code, newPassword);
            alert("Пароль успешно изменён!");
            navigate("/auth");
        } catch (err: any) {
            setError(err.message || "Ошибка сброса пароля");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="layout-shell flex justify-center py-10">
            <div className="w-full max-w-xl bg-[#1e1e1e] p-6 sm:p-8 rounded-xl shadow-lg">
                <h2 className="text-3xl font-bold text-white text-center">Новый пароль</h2>
                <p className="text-gray-400 text-center mt-2">Для {email}</p>

                {error && <p className="text-red-400 text-center mt-4 text-sm">{error}</p>}

                <form onSubmit={handleReset} className="mt-6 space-y-4">
                    <div>
                        <label className="text-white font-bold block mb-2">Код из письма</label>
                        <input
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            value={code}
                            placeholder="123456"
                            onChange={(e) => {
                                setCode(e.target.value.replace(/\D/g, ""));
                                if (error) setError("");
                            }}
                            className="w-full bg-[#2a2a2a] text-white h-12 rounded-lg px-4 text-center text-2xl tracking-[0.3em] focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                            autoFocus
                            required
                        />
                    </div>

                    <div>
                        <label className="text-white font-bold block mb-2">Новый пароль</label>
                        <input
                            type="password"
                            value={newPassword}
                            placeholder="••••••••"
                            minLength={6}
                            onChange={(e) => {
                                setNewPassword(e.target.value);
                                if (error) setError("");
                            }}
                            className="w-full bg-[#2a2a2a] text-white h-12 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                            required
                        />
                    </div>

                    <div>
                        <label className="text-white font-bold block mb-2">Повторите пароль</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            placeholder="••••••••"
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                if (error) setError("");
                            }}
                            className="w-full bg-[#2a2a2a] text-white h-12 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold h-12 rounded-lg transition disabled:opacity-50"
                    >
                        {loading ? "Сохранение..." : "Сменить пароль"}
                    </button>
                </form>

                <button
                    onClick={() => navigate("/forgot")}
                    className="mt-4 text-gray-400 hover:text-white text-center w-full text-sm transition"
                >
                    ← Отправить код повторно
                </button>
            </div>
        </div>
    );
}