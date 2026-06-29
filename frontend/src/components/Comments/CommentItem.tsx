interface CommentProps {
    userId: number,
    animeId: number,
    text: string,
    username: string,
    avatarUrl: string,
    userRole: string,
    createdAt: string
}

export default function CommentItem({userId, text, username, avatarUrl, userRole}: CommentProps) {

    const getRoleColor = (role: string) => {

        if (!role) return "text-[#4e4e4e] hover:text-[#d1d1d1]";

        switch (role.toLowerCase()) {
            case "admin":
                return "text-red-400 hover:text-red-300";
            case "moderator":
                return "text-blue-500 hover:text-blue-400";
            case "vip":
                return "text-yellow-400 hover:text-yellow-300";
            default:
                return "text-[#4e4e4e] hover:text-[#d1d1d1]"
        }
    }

    const colorClass = getRoleColor(userRole);
    return (
        <>
            <div>
                <div className="w-full h-20 bg-[#1e1e1e] rounded-xl">
                    <div className="flex gap-2 items-center p-2">
                        <div>
                            <img src={avatarUrl} alt=""  className="w-15 h-15 rounded-4xl border border-[#4e4e4e]"/>
                        </div>

                        <div>
                            <a href={`/profile/${userId}`} className={`font-mono ${colorClass} duration-150 transition-colors`}>
                                {username}
                            </a>

                            <p className="font-semibold text-[#d1d1d1]">{text}</p>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}