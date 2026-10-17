import { useNavigate } from 'react-router-dom';
import Panel from './Panel';
import './ExploreCard.css';

interface ExploreCardProps {
    icon: React.ReactNode;
    iconColor: string;
    title: string;
    description: string;
    path: string;
}

export default function ExploreCard({
    icon,
    iconColor, 
    title, 
    description, 
    path 
}: ExploreCardProps) {
    const navigate = useNavigate();

    return (
        <Panel border="none" shadow hoverEffect clickable onClick={() => navigate(path)} className="explore-card">
            <div className="header" style={{ borderBottomColor: iconColor }}>
                <div className="icon" style={{ backgroundColor: iconColor }}>
                    {icon}
                </div>
                <h3>{title}</h3>
            </div>
            <p className="description">{description}</p>
        </Panel>
    );
}