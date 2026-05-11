import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext"
import clsx from "clsx";
import { useNavigate } from "react-router-dom";

export default function UserMenu() {

    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    const handleProfile = () => {
        navigate(`/profile/${user?.id}`)
    }

    return (
        <>
            <div className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)} 
                    className="flex items-center focus:outline-none">
                    <img src={user?.avatarUrl} alt="" title={`${user?.isVerify ? "Верифицирован" : ""}`}
                    className={clsx('w-12 h-12 rounded-4xl', user?.isVerify ? 'border-2 border-green-400' : '')}/>
                </button>

                {isOpen && (
                    <>
                    <div
                        className="fixed inset-0 z-10" 
                        onClick={() => setIsOpen(false)} />

                    <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg py-2 z-20">
                        <button className="block text-left w-full px-4 py-1 hover:bg-gray-600 transition-all duration-150" onClick={() => {
                            setIsOpen(false);
                            handleProfile();
                        }}>Профиль</button>
                        <button className="block text-left w-full px-4 py-1 text-red-400 hover:bg-gray-600 transition-all duration-150" onClick={() => {
                            setIsOpen(false);
                            logout();
                        }}>Выход</button>
                        
                    </div>
                    </>
                    
                    
                )}
            </div>
        </>
    )
}