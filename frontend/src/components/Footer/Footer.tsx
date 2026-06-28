export default function Footer() {
    return (
        <>
            <div className="w-full bg-[#1e1e1e] border-t border-t-[#333333]">
                <div className="layout-shell py-6 sm:p-8">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-8">
                        <div>
                            <h2 className="font-bold text-3xl text-green-400 font-mono">aniflex</h2>
                            <p className="text-[#818181] text-md">Спасибо что вы с нами!</p>
                            <p className="text-[#818181] text-md">Это короче футер все дела бла бла бла!</p>
                        </div>
                        <div className="flex gap-4">
                            <a href="#" className="p-4 bg-[#333333] hover:bg-green-400 transition-colors duration-200 rounded-4xl">
                                <img src="tg_icon.svg" alt="" />
                            </a>
                            <a href="#" className="p-4 bg-[#333333] hover:bg-green-400 transition-colors duration-200 rounded-4xl">
                                <img src="vk_icon.svg" className="text-white" alt="" />
                            </a>
                        </div>
                    </div>

                    <div className="border rounded-xl text-[#818181] my-4"></div>
                    
                    <div className="flex items-center justify-between">
                        <div className="flex gap-2 items-center">
                            <span className="font-bold text-white p-1.25 bg-[#818181] rounded-xl">18+</span> 
                            <p className="text-[#818181] font-medium text-md">
                                Информация на сайте может не подходить лицам не достигшим 18 лет.
                            </p>
                        </div>
                        
                        <div className="font-mono text-lg text-green-400 hover:text-green-300 duration-150 transition-colors cursor-pointer">
                            admin@aniflex.com
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}