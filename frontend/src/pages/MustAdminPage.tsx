import { Link } from "react-router-dom";

export default function MustAdminPage() {
    return (
        <>
            <div className="layout-shell flex min-h-[60vh] items-center justify-center px-4 py-8">
                <div className="text-center">
                    <div className="text-4xl mb-4">🔒</div>
                    <p className="text-gray-400">Доступ запрещён. Только для администраторов.</p>
                    <Link to="/" className="inline-block mt-4 px-4 py-2 bg-gray-700 rounded-lg">
                        На главную
                    </Link>
                </div>
            </div>
        </>
    )
}