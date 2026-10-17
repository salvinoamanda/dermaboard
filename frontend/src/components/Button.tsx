import { useNavigate, useLocation } from 'react-router-dom';
import './Button.css';

interface ButtonProps {
    label: React.ReactNode;
    color?: 'primary' | 'secondary' | 'outline' | 'danger';
    size?: 'small' | 'large';
    path?: string;
    action?: () => void;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
    type?: 'button' | 'submit';
}

export default function Button({
    label,
    color = 'primary',
    size, 
    path, 
    action, 
    icon, 
    iconPosition = 'right',
    type = 'button',
}: ButtonProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const isActive = path === location.pathname;

    const content = (
        <>
            {icon && iconPosition === 'left' && <span className="icon">{icon}</span>}
            {label}
            {icon && iconPosition === 'right' && <span className="icon">{icon}</span>}
        </>
    );

    return(
        <button
            type={type}
            className={`btn ${color ?? ''} ${size ?? ''} ${isActive ? 'active' : ''}`} 
            onClick={() => path ? navigate(path) : action?.()}
        >
            {content}
        </button>
    );
}