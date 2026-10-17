import { FiX } from 'react-icons/fi';
import Panel from './Panel';
import Button from './Button';
import './NoteView.css';

interface NoteViewProps {
    text: string;
    onClose: () => void;
}

export default function NoteView({ text, onClose }: NoteViewProps) {
    return (
        <div className="note-overlay">
            <Panel shadow border="none" className="note-view">
                <div className="note-view-header">
                    <Button label={<FiX />} color="outline" size="small" action={onClose} />
                </div>
                <p className="note-view-text">{text}</p>
            </Panel>
        </div>
    );
}