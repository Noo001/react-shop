import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import App from './App';
import './App.css';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <ConfigProvider
                locale={ruRU}
                theme={{
                    token: {
                        colorPrimary: '#1890ff',
                        borderRadius: 6,
                    },
                }}
            >
                <App />
            </ConfigProvider>
        </BrowserRouter>
    </React.StrictMode>
);