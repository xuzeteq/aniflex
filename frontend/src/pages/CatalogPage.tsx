import { useNavigate } from "react-router-dom";
import Catalog from "../components/Catalog/Catalog";
import ShowCurrentSeason from "../components/CurrentSeason/ShowCurrentSeason";
import { useAuth } from "../contexts/AuthContext";

export default function CatalogPage() {
    const navigate = useNavigate();
    const {user} = useAuth();

    if (user?.isBlocked) {
            navigate('/blocked')
    }
    return (
        <>
            <div className="layout-shell py-6 sm:py-8">

                <ShowCurrentSeason />

                <h3 className="font-mono text-[#d1d1d1] text-2xl font-black pb-4 mt-10">Каталог:</h3>
                <Catalog />
            </div>
        </>
    )
}