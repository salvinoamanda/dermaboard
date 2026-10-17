import './StatCard.css';

interface StatCardProps {
    icon: React.ReactNode;
    value: string;
    label: string;
}

export default function StatCard({ icon, value, label }: StatCardProps) {
    return (
        <div className="stat-card">
            <div className="icon">{icon}</div>
            <span className="value">{value}</span>
            <p className="label">{label}</p>
        </div>
    );
}