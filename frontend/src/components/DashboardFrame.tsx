import './DashboardFrame.css';

interface DashboardFrameProps {
    title: string;
    src: string;
}

export default function DashboardFrame({ title, src }: DashboardFrameProps) {
    return (
        <iframe
            className="dashboard-frame"
            title={title}
            src={src}
            allowFullScreen
        />
    );
}