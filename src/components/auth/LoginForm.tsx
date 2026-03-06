import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Checkbox, Typography } from 'antd';
import { LoginFormValues } from '../../types/auth.types';
import Icon from '../ui/Icon';
import styles from './LoginForm.module.css';

const { Title, Text } = Typography;

interface LoginFormProps {
    onLogin: (values: LoginFormValues) => void;
    loading: boolean;
    error: string | null;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, loading, error }) => {
    const [form] = Form.useForm<LoginFormValues>();
    const [usernameValue, setUsernameValue] = useState<string>('');

    // Следим за изменениями поля логина
    const username = Form.useWatch('username', form);

    useEffect(() => {
        setUsernameValue(username || '');
    }, [username]);

    const clearField = () => {
        form.setFieldValue('username', '');
    };

    return (
        <div className={styles.container}>
            <div className={styles.formBox}>
                <div className={styles.logoContainer}>
                    <Icon name="login-logo" size={52}  />
                </div>

                <Title level={2} className={styles.title}>
                    Добро пожаловать!
                </Title>
                <Text type="secondary" className={styles.subtitle}>
                    Пожалуйста, авторизируйтесь
                </Text>

                {error && (
                    <div className={styles.error}>
                        {error}
                    </div>
                )}

                <Form
                    form={form}
                    name="login"
                    initialValues={{
                        remember: true,
                        username: 'emilys',
                        password: 'emilyspass'
                    }}
                    onFinish={onLogin}
                    layout="vertical"
                    className={styles.form}
                >
                    <Form.Item
                        label="Логин"
                        name="username"
                        rules={[{ required: true, message: 'Введите логин!' }]}
                    >
                        <Input
                            placeholder="test"
                            className={styles.input}
                            prefix={<Icon name="user" />}
                            suffix={
                                usernameValue ? (
                                    <Icon
                                        name="delete"
                                        size={16}
                                        onClick={clearField}
                                        className={styles.clearIcon}
                                    />
                                ) : null
                            }
                        />
                    </Form.Item>

                    <Form.Item
                        label="Пароль"
                        name="password"
                        rules={[{ required: true, message: 'Введите пароль!' }]}
                    >
                        <Input.Password
                            prefix={<Icon name="lock" />}
                            placeholder="**********"
                            className={styles.input}
                        />
                    </Form.Item>

                    <Form.Item name="remember" valuePropName="checked">
                        <Checkbox className={styles.checkbox}>Запомнить данные</Checkbox>
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            loading={loading}
                            className={styles.button}
                        >
                            Войти
                        </Button>
                    </Form.Item>

                    <div className={styles.divider}>или</div>

                    <div className={styles.register}>
                        <span>Нет аккаунта? </span>
                        <Button type="link" className={styles.link}>
                            Создать
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default LoginForm;