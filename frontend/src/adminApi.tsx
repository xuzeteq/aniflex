export interface UserDto {
  id: number;
  username: string;
  email: string;
  avatarUrl: string | null;
  isVerify: boolean;
  isBlocked: boolean;
  role: string;
  createdAt: string;
}

export interface BanRequest {
  isBlocked: boolean;
}

export interface VerifyRequest {
  isVerify: boolean;
}

const API_BASE = '/api/admin';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP ${response.status}`);
  }
  if (response.status === 204) return {} as T;
  return response.json();
}

export const adminApi = {
  /** Получить всех пользователей */
  async getAllUsers(): Promise<UserDto[]> {
    const res = await fetch(`${API_BASE}/users/get-all`, {
      credentials: 'include' // 🔥 Обязательно для кук/JWT
    });
    return handleResponse<UserDto[]>(res);
  },

  async banUser(userId: number, data: BanRequest): Promise<void> {
    const res = await fetch(`${API_BASE}/users/ban/${userId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include'
    });
    await handleResponse<void>(res);
  },

  async verifyUser(userId: number, data: VerifyRequest): Promise<void> {
    const res = await fetch(`${API_BASE}/users/verify/${userId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include'
    });
    await handleResponse<void>(res);
  }
};