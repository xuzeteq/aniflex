import Ongoing from "../components/Ongoing/Ongoing";

export default function OngoingPage() {
    return (
        <>
            <div className="layout-shell py-6 sm:py-8">
                <h3 className="font-mono text-[#d1d1d1] text-2xl font-black pb-8">Онгоинги:</h3>
                <Ongoing />

            </div>
        </>
    )
}