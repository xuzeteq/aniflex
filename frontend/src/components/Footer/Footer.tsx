export default function Footer() {
    return (
        <>
            <div className="w-full bg-[#1e1e1e] border-t border-t-[#333333]">
                <div className="layout-shell py-6 sm:p-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-8">
                        <h2 className="font-bold text-3xl text-green-400 font-mono">aniflex</h2>
                        <p className="text-[#818181] text-md">Спасибо что вы с нами!</p>
                    </div>
                    <div>
                        <p className="text-[#818181] text-md">Джонни тестируй пидорас!</p>
                        <p className="text-[#818181] text-md">Это короче футер все дела бла бла бла!</p>
                    </div>
                </div>
            </div>
        </>
    )
}