import { useNavigate } from "react-router-dom";
import Catalog from "../components/Catalog/Catalog";
import { useAuth } from "../contexts/AuthContext";
import ShowNewSite from "../components/NewSite/ShowNewSite";
import LiveChat from "../components/LiveChat/LiveChat";

export default function HomePage() {
    const navigate = useNavigate();
    const {user} = useAuth();

    if (user?.isBlocked) {
            navigate('/blocked')
    }
    return (
        <>
            <div className="layout-shell py-6 sm:py-8">

                <ShowNewSite />

                <h3 className="font-mono text-[#d1d1d1] text-2xl font-black pb-4 mt-10">Каталог:</h3>
                <Catalog />

                <LiveChat propertyId="6a038c852f319e1c3199c92a/1joetpre4"/>
            </div>

        </>
    )
}