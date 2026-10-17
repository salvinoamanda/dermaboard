import './PageHeader.css';

export interface PageHeaderProps {
    title: string;
    subtitle?: string;
    subtitleSize?: 'small' | 'large';
    align: 'center' | 'left';
    level?: 'h1'| 'h2' | 'h3' | 'h4';
}

export default function PageHeader({
    title, 
    subtitle, 
    subtitleSize, 
    align, 
    level = 'h1'
}: PageHeaderProps) {
    const Tag = level; 

    return (
        <header className={`page-header ${align}`}>
            <Tag>{title}</Tag>
            {subtitle && (
                <p className={`subtitle ${subtitleSize}`}>{subtitle}</p>
            )}
        </header>
    );    
}

