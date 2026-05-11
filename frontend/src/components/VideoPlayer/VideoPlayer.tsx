import { useEffect, useRef } from 'react';
import Artplayer from 'artplayer';

interface VideoPlayerProps {
    url: string;
    poster?: string;
}

export default function VideoPlayer({ url, poster }: VideoPlayerProps) {
    const playerRef = useRef<HTMLDivElement>(null);
    const instanceRef = useRef<Artplayer | null>(null);

    useEffect(() => {
        if (!playerRef.current || !url) return;

        instanceRef.current = new Artplayer({
            container: playerRef.current,
            url: url,
            poster: poster || '',
            autoplay: false,
            theme: '#e50914',
            setting: true,
            playbackRate: true,
            aspectRatio: true,
            fullscreen: true,
            mutex: true,
        });

        return () => {
            if (instanceRef.current) {
                instanceRef.current.destroy();
                instanceRef.current = null;
            }
        };
    }, [url, poster]);

    return <div ref={playerRef} className="w-full aspect-video rounded-lg overflow-hidden" />;
}