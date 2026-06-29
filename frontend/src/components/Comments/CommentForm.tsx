import axios from "axios";
import { useState, type FormEvent } from "react"

export default function CommentForm({animeId, onCommentAdded}: {animeId: number, onCommentAdded: (newComment: any) => void}) {

    const [text, setText] = useState('');

    const handleSubmit = async (e:FormEvent) => {
        e.preventDefault();
        if (!text.trim()) return;

        try {
            const response = await axios.post(`/api/Comments/addComment?animeId=${animeId}&text=${text}`);
            setText("");

            onCommentAdded(response.data);
        } catch (err) {
        console.error(err);
    }
    }   

    return (
        <>
            <form onSubmit={handleSubmit} className="mt-6">
                <textarea
                className="w-full h-20 bg-[#1e1e1e] outline-0 rounded-xl text-white p-2 resize-none"
                onChange={(e) => setText(e.target.value)}
                value={text}
                placeholder="Напишите комментарий"/>

                <button type="submit" className="py-2 px-6 text-white font-bold bg-green-400 rounded my-2">Отправить</button>
            </form>
        </>
    )
}