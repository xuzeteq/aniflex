import axios from "axios";
import { type LoginRequest, type RegisterRequest, type User } from "./types";

const API_BASE = '/api';

const authApi = axios.create({
    baseURL: API_BASE,
    withCredentials: true,
    headers: {
        "Content-Type": 'application/json',
    },
});

export const authApiClient = {
    login: (data: LoginRequest) => 
        authApi.post<User>("/Auth/login", data)
            .then(res => res.data)
            .catch(err => {
                throw err.response?.data || { message: "Ошибка соединения" };
            }),

    register: (data: RegisterRequest) =>
        authApi.post<User>("/Auth/register", data)
            .then(res => res.data)
            .catch(err => {
                throw err.response?.data || { message: "Ошибка соединения" };
            }),

    sendCode: (email: string) =>
        authApi.post("/Auth/send-code", { email }),

    verifyEmail: (email: string, code: string) => 
        authApi.post("/Auth/verify-email", {email, code}),

    resetPasswordCode: (email: string) =>
        authApi.post("/Auth/reset-code", {email}),

    resetPassword: (email: string, code: string, newPassword: string) =>
        authApi.post("/Auth/reset-password", {email, code, newPassword}),

    logout: () => 
        authApi.post("/Auth/logout")
            .catch(err => console.error("Logout error:", err)),

    getCurrentUser: () => 
        authApi.get<User>("/Auth/me")
            .then(res => res.data)
            .catch(() => null),
};