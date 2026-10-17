import './Panel.css';

interface PanelProps {
    children: React.ReactNode;
    border?: 'all' | 'horizontal' | 'none';
    shadow?: boolean;
    hoverEffect?: boolean;
    clickable?: boolean;
    theme?: 'light' | 'dark' | 'alert';
    onClick?: (e: React.MouseEvent<HTMLElement>) => void;
    className?: string; 
}

export default function Panel({
    children,
    border = 'all',
    shadow = false,
    hoverEffect = false,
    clickable = false,
    theme = 'light',
    onClick,
    className = '',
}: PanelProps) {
    const classes = [
        'panel',
        `panel-border-${border}`,
        shadow ? 'panel-shadow' : '',
        hoverEffect ? 'panel-hover' : '',
        clickable ? 'panel-clickable' : '',
        `panel-theme-${theme}`,
        className,
    ].filter(Boolean).join(' ');

    return (
        <div className={classes} onClick={clickable ? onClick : undefined}>
            {children}
        </div>
    );
}