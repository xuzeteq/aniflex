import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { authApiClient } from "../../authApi";

export default function AuthPage() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    const [error, setError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [errorText, setErrorText] = useState('');


    const navigate = useNavigate();

    const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const haveAccount = () => {
        navigate('/auth');
    }

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!username || !password) {
            setError(true);
            setErrorText('Не все поля заполнены!');
            return;
        }

        if (!isValidEmail(email)) {
            setEmailError(true);
            setErrorText('Неверный формат почты!');
            return;
        } 

        try {
            setError(false);
            await authApiClient.sendCode(email);
            navigate('/test', {
                state: { email, formData: { username, email, password } }
            })
        } catch (err: any) {
            setError(true);
            console.error(err);
        }
    }

    return (
        <> 
        
            <div className="layout-shell flex justify-center py-8 sm:py-12">
                <div className="w-full max-w-xl min-h-0 bg-[#1e1e1e] p-6 sm:p-8 rounded-xl sm:mt-[3.75rem]">
                    <h2 className="text-3xl font-bold text-white text-center">Регистрация</h2>
                    <p className="text-md font-normal text-[#a09f9f] text-center">Зарегистрируйтесь для получения <br /> всех возможностей сайта</p>

                    <div className="py-6">
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
                        
                        <h2 className="text-xl font-bold text-white py-2">Электронная почта</h2>
                        <input
                            type="email"
                            autoFocus
                            required
                            value={email}
                            placeholder="admin@gmail.com"
                            onChange={(e) => setEmail(e.target.value)}
                            className={`w-full bg-[#2a2a2a] text-white h-10 rounded-md focus:outline-none text-xl px-4
                                ${emailError ? 'border-2 border-red-400' : ''}`}
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
                    </div>

                    <button onClick={handleRegister} className="bg-green-400 w-full mt-5 h-10 text-xl font-bold text-[#ffffff] rounded
                        hover:bg-[#ffffff] hover:text-green-400 transition-all duration-150 cursor-pointer">Зарегистрироваться</button>
                    <p className="text-md font-normal text-[#a09f9f] text-center pt-2">Есть аккаунт?
                        <span onClick={haveAccount} className="text-green-300 hover:text-green-500 transition-colors duration-150 cursor-pointer"> Войдите!</span></p>
                </div>
            </div>
                    {error && (
                        <p className="text-md font-normal text-red-400 text-center pt-2">{errorText}</p>
                    )}
        </>
    )
}