import { useRef, useState } from 'react';
import { RiEyeLine, RiEyeCloseLine } from 'react-icons/ri';
import Panel from './Panel';
import Button from './Button';
import './Input.css';

interface InputProps {
    label: string;
    placeholder?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    type?: string;
    name?: string;
    error?: string;
}

export default function Input ({
    label,
    placeholder,
    value,
    onChange,
    onBlur,
    type = 'text',
    name,
    error, 
}: InputProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const id = name ?? label;
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;

    return (
        <div className="input">
            <label htmlFor={id}>{label}</label>
            <Panel clickable border="none" onClick={() => inputRef.current?.focus()} className="field">
                <div className="input-row">
                    <input
                        id={id}
                        name={name}
                        placeholder={placeholder}
                        value={value}
                        ref={inputRef}
                        onChange={onChange}
                        onBlur={onBlur}
                        type={inputType}
                    />
                    {isPassword && (
                        <Button
                            color="outline"
                            size="small"
                            label={showPassword ? <RiEyeCloseLine /> : <RiEyeLine />}
                            action={() => setShowPassword(!showPassword)}
                        />
                    )}
                </div>
            </Panel>
            {error && <span className="input-error">{error}</span>}
        </div>        
    )
}