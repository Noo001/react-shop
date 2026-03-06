export interface LoginFormValues {
    username: string;
    password: string;
    remember: boolean;
}

export interface User {
    id?: number;
    username: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    gender?: string;
    image?: string;
}

export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    loading: boolean;
    error: string | null;
}

export interface LoginResponse {
    success: boolean;
    user?: User;
    message?: string;
    token?: string;
}