import { useNavigate } from "react-router-dom";
import Ongoing from "../components/Ongoing/Ongoing";
import { useAuth } from "../contexts/AuthContext";

export default function OngoingPage() {

    const navigate = useNavigate();
    const {user} = useAuth();

    if (user?.isBlocked) {
            navigate('/blocked')
    }

    return (
        <>
            <div className="layout-shell py-6 sm:py-8">
                <h3 className="font-mono text-[#d1d1d1] text-2xl font-black pb-8">Онгоинги:</h3>
                <Ongoing />
            </div>
        </>
    )
}