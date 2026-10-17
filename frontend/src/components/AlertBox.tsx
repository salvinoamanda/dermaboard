import { useState } from 'react';
import { FiAlertCircle, FiChevronDown } from 'react-icons/fi';
import Panel from './Panel';
import Button from './Button';
import './AlertBox.css';

interface AlertBoxProps {
    message: string;
    references?: React.ReactNode[];
}

export default function AlertBox({ message, references }: AlertBoxProps) {
    const [open, setOpen] = useState(false);

    return (
        <div className="alert-box-wrapper">
            <Panel theme="alert" className="alert-box">
                <div className="content">
                    <FiAlertCircle className="icon" />
                    <p>
                        <strong>Importante:</strong> {message}
                    </p>
                </div>

                {references && references.length > 0 && (
                    <>
                        <Button
                            label="Clique aqui para ver as referências"
                            action={() => setOpen(!open)}
                            icon={<FiChevronDown className={open ? 'rotated' : ''} />}
                            color="outline"
                            size="large"
                        />
                    </>
                )}
            </Panel>

            {open && references && references.length > 0 && (
                <ul className="references">
                    {references.map((ref, index) => (
                        <li key={index}>{ref}</li>
                    ))}
                </ul>
            )}
        </div>
    );
}
