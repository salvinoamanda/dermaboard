import { useState } from 'react';
import Panel from './Panel';
import Textarea from './Textarea';
import Button from './Button';
import './NoteWidget.css';

interface NoteWidgetProps {
    onClose: () => void;
}

export default function NoteWidget({ onClose }: NoteWidgetProps) {
    const [text, setText] = useState('');
    const [error, setError] = useState('');

        async function handleSave() {
            if (!text.trim()) {
                setError('Escreva a anotação antes de salvar');
                return;
            }

            try {
                const res = await fetch('<url-da-api>/search-history', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                    body: JSON.stringify({ searchTerm: text }),
                });

                if (!res.ok) {
                    const data = await res.json();
                    setError(data.message ?? 'Erro ao salvar consulta');
                    return;
                }

                onClose();
            } catch {
                setError('Erro ao conectar com o servidor');
            }
        }

            return (
            <Panel shadow border="none" className="note-widget">
                <Textarea
                    label="Nova anotação"
                    name="note"
                    placeholder="Escreva sua observação sobre o dashboard..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                {error && <span className="input-error">{error}</span>}
                <div className="note-widget-actions">
                    <Button label="Cancelar" color="secondary" size="small" action={onClose} />
                    <Button label="Salvar" size="small" action={handleSave} />
                </div>
            </Panel>
        );
}