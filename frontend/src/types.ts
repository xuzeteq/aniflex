export interface AnimeItem {
    id: number,
    title: string,
    originalTitle: string,
    description: string,
    episodes: number;
    maxEpisodes: number;
    rating: number;
    averageRating: number;
    ratingsCount: number;
    releaseYear: number;
    studio: string;
    posterUrl: string;
    season: string;
    seasonName: string;
    status: string;
    statusName: string;
    type: string;
    typeName: string;
    createdAt: string;
    genres: string[];
}

export interface Episode {
    id: number;
    animeId: number;
    title: string;
    episodeNumber: number;
    videoUrl: string;
}

export interface User {
    id: number;
    username: string;
    email: string;
    avatarUrl: string;
    isBlocked: boolean;
    isVerify: boolean;
    favouritesCount: number;
    ratingsCount: number;
    role: string;
    createdAt: Date;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
}

export interface Comment {
    id: number,
    userId: number,
    animeId: number,
    text: string,
    username: string,
    avatarUrl: string,
    userRole: string,
    isDeleted: boolean,
    createdAt: string
}