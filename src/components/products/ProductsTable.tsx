import React, { useState, useEffect, useCallback } from 'react';
import { Table, Space, Input, Typography, message, Modal, Form, Image, Button, Checkbox } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import type { ColumnsType } from 'antd/es/table';
import type { TablePaginationConfig } from 'antd/es/table';
import type { FilterValue, SorterResult } from 'antd/es/table/interface';
import { fetchProducts } from '../../services/api';
import { Product } from '../../types';
import Icon from '../ui/Icon';
import styles from './ProductsTable.module.css';

const { Title, Text } = Typography;

// Типы для параметров таблицы
interface TableParams {
    pagination: TablePaginationConfig;
    sortField?: keyof Product;
    sortOrder?: 'asc' | 'desc';
}

// Типы для формы добавления товара
interface AddProductForm {
    name: string;
    price: number;
    vendor: string;
    sku: string;
    category: string;
    image?: string;
}

// Тип для сортировки из Ant Design
type AntDSorter = SorterResult<Product> | SorterResult<Product>[];

const ProductsTable: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchText, setSearchText] = useState<string>('');
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [addForm] = Form.useForm<AddProductForm>();
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    const [tableParams, setTableParams] = useState<TableParams>({
        pagination: {
            current: 1,
            pageSize: 20,
            total: 0,
            showSizeChanger: false,
            showQuickJumper: false,
        },
    });

    const loadProducts = useCallback(async (): Promise<void> => {
        setLoading(true);
        try {
            const data = await fetchProducts({
                page: tableParams.pagination.current as number,
                pageSize: 20,
                search: searchText,
                category: 'all',
                sortBy: tableParams.sortField,
                sortOrder: tableParams.sortOrder,
            });

            setProducts(data.products);
            setTableParams((prev: TableParams) => ({
                ...prev,
                pagination: {
                    ...prev.pagination,
                    total: data.total,
                },
            }));
        } catch (error) {
            void message.error('Ошибка при загрузке товаров');
        } finally {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tableParams.pagination.current, tableParams.sortField, tableParams.sortOrder, searchText]);

    useEffect(() => {
        void loadProducts();
    }, [loadProducts]);

    const handleTableChange = (
        pagination: TablePaginationConfig,
        filters: Record<string, FilterValue | null>,
        sorter: AntDSorter
    ): void => {
        let sortField: keyof Product | undefined;
        let sortOrder: 'asc' | 'desc' | undefined;

        if (!Array.isArray(sorter) && sorter.field && sorter.order) {
            sortField = sorter.field as keyof Product;
            sortOrder = sorter.order === 'ascend' ? 'asc' : 'desc';
        }

        setTableParams({
            pagination: {
                ...pagination,
                showSizeChanger: false,
                showQuickJumper: false,
            },
            sortField,
            sortOrder,
        });
    };

    const handleAddProduct = (values: AddProductForm): void => {
        const newProduct: Product = {
            id: Date.now(),
            name: values.name,
            category: values.category,
            vendor: values.vendor,
            sku: values.sku,
            rating: 0,
            price: Number(values.price),
            thumbnail: values.image || 'https://via.placeholder.com/48',
        };

        setProducts((prev: Product[]) => [newProduct, ...prev]);
        void message.success('Товар успешно добавлен!');
        setIsModalVisible(false);
        addForm.resetFields();
    };

    const handleRefresh = (): void => {
        setTableParams((prev: TableParams) => ({
            ...prev,
            pagination: { ...prev.pagination, current: 1 },
        }));
        setSearchText('');
        void message.success('Данные обновлены');
    };

    const clearSearch = (): void => {
        setSearchText('');
        setTableParams((prev: TableParams) => ({
            ...prev,
            pagination: { ...prev.pagination, current: 1 },
        }));
    };

    const handleEdit = (record: Product): void => {
        void message.info(`Редактирование товара "${record.name}" (демо-режим)`);
    };

    const handleDelete = (record: Product): void => {
        Modal.confirm({
            title: 'Подтверждение удаления',
            content: `Вы уверены, что хотите удалить товар "${record.name}"?`,
            okText: 'Да',
            cancelText: 'Нет',
            onOk: (): void => {
                setProducts((prev: Product[]) => prev.filter((p: Product) => p.id !== record.id));
                void message.success('Товар удален');
            },
        });
    };

    const getRatingColor = (rating: number): string => {
        return rating < 3 ? '#ff4d4f' : '#000000';
    };

    const columns: ColumnsType<Product> = [
        {
            title: '',
            key: 'selection',
            width: '5%',
            render: (_: unknown, record: Product): React.ReactNode => (
                <Checkbox
                    checked={selectedRowKeys.includes(record.id)}
                    onChange={(e: CheckboxChangeEvent): void => {
                        if (e.target.checked) {
                            setSelectedRowKeys((prev: React.Key[]) => [...prev, record.id]);
                        } else {
                            setSelectedRowKeys((prev: React.Key[]) => prev.filter((key: React.Key) => key !== record.id));
                        }
                    }}
                />
            ),
        },
        {
            title: 'Наименование',
            dataIndex: 'name',
            key: 'name',
            width: '30%',
            sorter: true,
            render: (text: string, record: Product): React.ReactNode => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Image
                        src={record.thumbnail || 'https://via.placeholder.com/48'}
                        alt={record.name}
                        width={48}
                        height={48}
                        style={{
                            borderRadius: '8px',
                            objectFit: 'cover',
                            backgroundColor: '#f5f5f5'
                        }}
                        preview={false}
                    />
                    <div>
                        <div style={{ fontWeight: 600 }}>{record.name}</div>
                        <Text type="secondary" style={{ fontSize: 12 }}>{record.category}</Text>
                    </div>
                </div>
            ),
        },
        {
            title: 'Вендор',
            dataIndex: 'vendor',
            key: 'vendor',
            width: '12%',
            sorter: true,
            render: (text: string): React.ReactNode => text || '—',
        },
        {
            title: 'Артикул',
            dataIndex: 'sku',
            key: 'sku',
            width: '12%',
            render: (text: string): React.ReactNode => text || '—',
        },
        {
            title: 'Оценка',
            dataIndex: 'rating',
            key: 'rating',
            width: '10%',
            sorter: true,
            render: (rating: number): React.ReactNode => (
                <span style={{
                    color: getRatingColor(rating),
                    fontWeight: rating < 3 ? 600 : 400
                }}>
          {rating.toFixed(1)}/5
        </span>
            ),
        },
        {
            title: 'Цена, ₽',
            dataIndex: 'price',
            key: 'price',
            width: '12%',
            sorter: true,
            render: (price: number): React.ReactNode => (
                <span style={{ fontWeight: 500 }}>
          {price.toLocaleString('ru-RU')} ₽
        </span>
            ),
        },
        {
            title: '',
            key: 'actions',
            width: '10%',
            render: (_: unknown, record: Product): React.ReactNode => (
                <Space size="middle" className={styles.actionIcons}>
                    <Icon
                        name="edit"
                        size={18}
                        color="#595959"
                        onClick={(): void => handleEdit(record)}
                        className={styles.actionIcon}
                    />
                    <Icon
                        name="delete"
                        size={18}
                        color="#ff4d4f"
                        onClick={(): void => handleDelete(record)}
                        className={styles.actionIcon}
                    />
                </Space>
            ),
        },
    ];

    return (
        <div className={styles.container}>
            <div className={styles.topRow}>
                <Title level={2} className={styles.mainTitle}>Товары</Title>
                <div className={styles.searchWrapper}>
                    <Input
                        placeholder="Найти"
                        value={searchText}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setSearchText(e.target.value)}
                        onPressEnter={(): void => {
                            setTableParams((prev: TableParams) => ({
                                ...prev,
                                pagination: { ...prev.pagination, current: 1 },
                            }));
                        }}
                        className={styles.searchInput}
                        prefix={<Icon name="search" size={24} />}
                        suffix={searchText ? (
                            <Icon
                                name="delete"
                                size={24}
                                onClick={clearSearch}
                                className={styles.clearIcon}
                            />
                        ) : null}
                    />
                </div>
            </div>

            {/* Строка с заголовком таблицы и кнопками */}
            <div className={styles.tableHeader}>
                <Text className={styles.allPositions}>Все позиции</Text>
                <Space size="middle">
                    <Button
                        onClick={handleRefresh}
                        className={styles.iconButton}
                        icon={<Icon name="refresh" size={22} />}
                    />
                    <Button
                        type="primary"
                        onClick={(): void => setIsModalVisible(true)}
                        className={styles.addButton}
                        icon={<Icon name="plus" size={22} />}
                    >
                        Добавить
                    </Button>
                </Space>
            </div>

            <Table
                columns={columns}
                dataSource={products}
                rowKey="id"
                loading={loading}
                pagination={{
                    ...tableParams.pagination,
                    showTotal: (total: number, range: [number, number]): string =>
                        `Показано ${range[0]}-${range[1]} из ${total}`,
                }}
                onChange={handleTableChange}
                className={styles.table}
            />

            <Modal
                title="Добавить товар"
                open={isModalVisible}
                onCancel={(): void => {
                    setIsModalVisible(false);
                    addForm.resetFields();
                }}
                footer={null}
            >
                <Form
                    form={addForm}
                    layout="vertical"
                    onFinish={handleAddProduct}
                >
                    <Form.Item
                        name="name"
                        label="Наименование"
                        rules={[{ required: true, message: 'Введите наименование' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="price"
                        label="Цена"
                        rules={[{ required: true, message: 'Введите цену' }]}
                    >
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item
                        name="vendor"
                        label="Вендор"
                        rules={[{ required: true, message: 'Введите вендора' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="sku"
                        label="Артикул"
                        rules={[{ required: true, message: 'Введите артикул' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="category"
                        label="Категория"
                        rules={[{ required: true, message: 'Введите категорию' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="image"
                        label="URL изображения"
                    >
                        <Input placeholder="https://example.com/image.jpg" />
                    </Form.Item>
                    <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
                        <Space>
                            <Button onClick={(): void => setIsModalVisible(false)}>Отмена</Button>
                            <Button type="primary" htmlType="submit">Добавить</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ProductsTable;