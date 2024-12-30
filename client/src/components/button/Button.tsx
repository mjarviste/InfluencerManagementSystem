import React from 'react';
import "./Button.scss";

interface ButtonProps {
    label: string;
    variant?: 'primary' | 'secondary' | 'tertiary';
    onClick?: (...args: any[]) => void;  
    icon?: string;
    className: string,
}

const Button: React.FC<ButtonProps> = ({ label, variant = 'primary', onClick, icon, className}) => {
    return (
        <button
            className={`${variant} button ${className}`}
            onClick={onClick}
        >
            {label}
            <img src={icon} />
        </button>
    );
};

export default Button;