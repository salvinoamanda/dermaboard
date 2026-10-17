import Panel from './Panel';
import './Input.css';

interface TextareaProps {
    label: string;
    placeholder?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    name?: string;
    rows?: number;
}

export default function Textarea({
    label,
    placeholder,
    value,
    onChange,
    name,
    rows = 5,
}: TextareaProps) {
    const id = name ?? label;

    return (
        <div className="input">
            <label htmlFor={id}>{label}</label>
            <Panel border="none" className="field">
                <textarea
                    id={id}
                    name={name}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    rows={rows}
                />
            </Panel>
        </div>
    );
}