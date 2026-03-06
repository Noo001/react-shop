import { User, LoginFormValues, LoginResponse } from '../types/auth.types';

const AUTH_KEY = 'isAuthenticated';
const USER_KEY = 'user';
const TOKEN_KEY = 'token';

export const checkAuth = (): boolean => {
    return localStorage.getItem(AUTH_KEY) === 'true';
};

export const logout = (): void => {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
};

export const getUser = (): User | null => {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
};

export const getToken = (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
};

// Реальная авторизация через DummyJSON
export const login = async (values: LoginFormValues): Promise<LoginResponse> => {
    try {
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: values.username,
                password: values.password,
                expiresInMins: 30, // опционально
            }),
            credentials: 'include'
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Ошибка авторизации');
        }

        const data = await response.json();

        // Сохраняем данные пользователя и токен
        const user: User = {
            id: data.id,
            username: data.username,
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            gender: data.gender,
            image: data.image,
        };

        localStorage.setItem(USER_KEY, JSON.stringify(user));
        localStorage.setItem(AUTH_KEY, 'true');
        localStorage.setItem(TOKEN_KEY, data.token);

        return {
            success: true,
            user,
        };
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Неизвестная ошибка',
        };
    }
};

// Получение текущего пользователя (с токеном)
export const fetchCurrentUser = async (): Promise<User | null> => {
    const token = getToken();

    if (!token) {
        return null;
    }

    try {
        const response = await fetch('https://dummyjson.com/auth/me', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Не удалось получить данные пользователя');
        }

        const data = await response.json();

        return {
            id: data.id,
            username: data.username,
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            gender: data.gender,
            image: data.image,
        };
    } catch (error) {
        console.error('Ошибка получения пользователя:', error);
        return null;
    }
};