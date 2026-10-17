import Panel from './Panel';
import Button from './Button';
import PageHeader from './PageHeader';
import './ConfirmDialog.css';

interface ConfirmDialogProps {
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmDialog({ title, message, onConfirm, onCancel }: ConfirmDialogProps) {
    return (
        <div className="confirm-overlay">
            <Panel shadow border="none" className="confirm-dialog">
                <PageHeader title={title} align="left" level="h4" />
                <p>{message}</p>
                <div className="confirm-actions">
                    <Button label="Cancelar" color="secondary" size="small" action={onCancel} />
                    <Button label="Excluir" color="danger" size="small" action={onConfirm} />
                </div>
            </Panel>
        </div>
    );
}