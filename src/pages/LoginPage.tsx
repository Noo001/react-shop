import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import { LoginFormValues, User } from '../types/auth.types';
import { login } from '../services/auth';

interface LoginPageProps {
    onLogin: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleLogin = async (values: LoginFormValues): Promise<void> => {
        setLoading(true);
        setError(null);

        try {
            const result = await login(values);

            if (result.success && result.user) {
                onLogin(result.user);
                navigate('/products');
            } else {
                setError(result.message || 'Неверный логин или пароль');
            }
        } catch (err) {
            setError('Ошибка при входе в систему');
        } finally {
            setLoading(false);
        }
    };

    return (
        <LoginForm
            onLogin={handleLogin}
            loading={loading}
            error={error}
        />
    );
};

export default LoginPage;