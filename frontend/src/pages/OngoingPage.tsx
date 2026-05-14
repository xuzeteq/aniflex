import Ongoing from "../components/Ongoing/Ongoing";
import LiveChat from "../components/LiveChat/LiveChat";

export default function OngoingPage() {
    return (
        <>
            <div className="layout-shell py-6 sm:py-8">
                <h3 className="font-mono text-[#d1d1d1] text-2xl font-black pb-8">Онгоинги:</h3>
                <Ongoing />

                <LiveChat propertyId="6a038c852f319e1c3199c92a/1joetpre4"/>
            </div>
        </>
    )
}