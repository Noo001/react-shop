import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { message } from 'antd';
import Layout from './components/layout/Layout';
import LoginPage from './pages/LoginPage';
import ProductsPage from './pages/ProductsPage';
import { checkAuth, logout, getUser } from './services/auth';
import { User } from './types/auth.types';
import './App.css';

const App: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const initAuth = async () => {
            const authStatus = checkAuth();
            setIsAuthenticated(authStatus);

            if (authStatus) {
                const currentUser = getUser();
                setUser(currentUser);
            }

            setLoading(false);
        };

        initAuth();
    }, []);

    const handleLogin = (userData: User): void => {
        setIsAuthenticated(true);
        setUser(userData);
        message.success('Успешный вход!');
    };

    const handleLogout = (): void => {
        logout();
        setIsAuthenticated(false);
        setUser(null);
        message.info('Вы вышли из системы');
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                Загрузка...
            </div>
        );
    }

    return (
        <Layout
            isAuthenticated={isAuthenticated}
            user={user}
            onLogout={handleLogout}
        >
            <Routes>
                <Route
                    path="/login"
                    element={
                        isAuthenticated ?
                            <Navigate to="/products" replace /> :
                            <LoginPage onLogin={handleLogin} />
                    }
                />
                <Route
                    path="/products"
                    element={
                        isAuthenticated ?
                            <ProductsPage /> :
                            <Navigate to="/login" replace />
                    }
                />
                <Route path="/" element={<Navigate to="/products" replace />} />
            </Routes>
        </Layout>
    );
};

export default App;