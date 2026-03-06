import React from 'react';

export type IconName =
    'search' | 'refresh' | 'plus' | 'edit' | 'delete' | 'user' |
    'lock' | 'logout' | 'shop' | 'login-logo' | 'plus-circle' | 'menu-delete';

interface IconProps {
    name: IconName;
    size?: number;
    color?: string;
    className?: string;
    onClick?: () => void;
}

const Icon: React.FC<IconProps> = ({
                                       name,
                                       size = 20,
                                       color,
                                       className = '',
                                       onClick
                                   }) => {
    // Используем публичный URL вместо импорта
    const getIconPath = () => {
        return `/assets/icons/${name}.svg`;
    };

    return (
        <img
            src={getIconPath()}
            alt={name}
            width={size}
            height={size}
            className={className}
            onClick={onClick}
            style={{
                display: 'inline-block',
                verticalAlign: 'middle',
                cursor: onClick ? 'pointer' : 'default',
                filter: color ? `brightness(0) saturate(100%) invert(28%) sepia(95%) saturate(1916%) hue-rotate(206deg) brightness(97%) contrast(101%)` : 'none'
            }}
        />
    );
};

export default Icon;