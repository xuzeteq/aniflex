import CurrentSeason from "./CurrentSeason";

export default function ShowCurrentSeason() {
    return (
        <>
            <h2 className="font-mono text-[#d1d1d1] text-2xl font-black pb-4">Аниме текущего сезона:</h2>
            <CurrentSeason />
        </>
    )
}