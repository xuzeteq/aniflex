import Catalog from "../components/Catalog/Catalog";
import ShowCurrentSeason from "../components/CurrentSeason/ShowCurrentSeason";

export default function CatalogPage() {


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