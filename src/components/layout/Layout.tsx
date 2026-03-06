import React from 'react';
import { Layout as AntLayout, Menu, Avatar, Space, Typography, Dropdown } from 'antd';
import { UserOutlined, LogoutOutlined, ShopOutlined, DownOutlined } from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import { User } from '../../types/auth.types';
import styles from './Layout.module.css';

const { Header, Content, Footer } = AntLayout;
const { Text } = Typography;

interface LayoutProps {
    children: React.ReactNode;
    isAuthenticated: boolean;
    user: User | null;
    onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, isAuthenticated, user, onLogout }) => {
    const location = useLocation();

    const menuItems = [
        {
            key: '/products',
            icon: <ShopOutlined />,
            label: <Link to="/products">Товары</Link>,
        },
    ];

    const userMenu = {
        items: [
            {
                key: 'logout',
                label: 'Выйти',
                icon: <LogoutOutlined />,
                onClick: onLogout,
            },
        ],
    };

    return (
        <AntLayout className={styles.layout}>
            <Header className={styles.header}>
                <div className={styles.logo}>
                    <ShopOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                    <Text strong style={{ fontSize: 18, marginLeft: 8, color: '#fff' }}>
                        МАГАЗИНИЩЕ
                    </Text>
                </div>

                <Space size="large">
                    {isAuthenticated && (
                        <>
                            <Menu
                                theme="dark"
                                mode="horizontal"
                                selectedKeys={[location.pathname]}
                                items={menuItems}
                                className={styles.menu}
                            />
                            <Dropdown menu={userMenu} placement="bottomRight">
                                <Space style={{ cursor: 'pointer', color: '#fff' }}>
                                    <Avatar
                                        src={user?.image}
                                        icon={!user?.image && <UserOutlined />}
                                        size="small"
                                    />
                                    <Text style={{ color: '#fff' }}>
                                        {user?.firstName || user?.username || 'Пользователь'}
                                    </Text>
                                    <DownOutlined style={{ fontSize: 12, color: '#fff' }} />
                                </Space>
                            </Dropdown>
                        </>
                    )}
                </Space>
            </Header>

            <Content className={styles.content}>
                {children}
            </Content>

            <Footer className={styles.footer}>
                МАГАЗИНИЩЕ © {new Date().getFullYear()} Андрей Николаевич Ефремцев
            </Footer>
        </AntLayout>
    );
};

export default Layout;