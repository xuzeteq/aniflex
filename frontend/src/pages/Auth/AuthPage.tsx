import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";

export default function AuthPage() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const noAccount = () => {
        navigate('/register');
    }

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            await login(username, password);
            navigate("/");
        } catch (err: any) {
            setError(true);
            console.error(err);
        }
    }


    return (
        <> 
            <div className="layout-shell flex justify-center py-8 sm:py-12">
                <div className="w-full max-w-xl min-h-0 bg-[#1e1e1e] p-6 sm:p-8 rounded-xl sm:mt-15">
                    <h2 className="text-3xl font-bold text-white text-center">Авторизация</h2>
                    <p className="text-md font-normal text-[#a09f9f] text-center">Авторизуйтесь чтобы открыть доступ <br /> ко всем возможностям сайта</p>

                    <div className="py-2">
                        <h2 className="text-xl font-bold text-white py-2">Имя пользователя</h2>
                        <input
                            type="text"
                            autoFocus
                            required
                            value={username}
                            placeholder="admin"
                            onChange={(e) => setUsername(e.target.value)}
                            className={`w-full bg-[#2a2a2a] text-white h-10 rounded-md focus:outline-none text-xl px-4
                                ${error ? 'border-2 border-red-400' : ''}`}
                        />

                        <h2 className="text-xl font-bold text-white py-2">Пароль</h2>
                        <input
                            type="password"
                            autoFocus
                            required
                            value={password}
                            placeholder="password"
                            onChange={(e) => setPassword(e.target.value)}
                            className={`w-full bg-[#2a2a2a] text-white h-10 rounded-md focus:outline-none text-xl px-4
                                ${error ? 'border-2 border-red-400' : ''}`}
                        />
                        <Link to={'/forgot'}>
                            <p className="w-auto flex justify-end text-[#444444] cursor-pointer hover:text-[#a09f9f] transition-all duration-150">Забыли пароль?</p>
                        </Link>
                    </div>

                    <button onClick={handleAuth} className="bg-green-400 mt-1 w-full h-10 text-xl font-bold text-[#ffffff] rounded
                        hover:bg-[#ffffff] hover:text-green-400 transition-all duration-150 cursor-pointer">Авторизоваться</button>
                    <p className="text-md font-normal text-[#a09f9f] text-center pt-2">Нет аккаунта?
                        <span onClick={noAccount} className="text-green-300 hover:text-green-500 transition-colors duration-150 cursor-pointer"> Зарегистрируйся!</span></p>
                </div>
            </div>
            {error && (
                        <p className="text-md font-normal text-red-400 text-center pt-2">Неверный логин или пароль!</p>
            )}
        </>
    )
}