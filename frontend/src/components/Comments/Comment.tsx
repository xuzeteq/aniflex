interface CommentProps {
    id: number,
    userId: number,
    animeId: number,
    text: string,
    isDeleted: boolean,
    createdAt: string
}

export default function Comment({userId, animeId, text}: CommentProps) {
    return (
        <>
            <div>
                <h1>{userId}</h1>
                <h4>{animeId}</h4>
                <p>{text}</p>
            </div>
        </>
    )
}