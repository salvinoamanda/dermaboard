import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser } from 'react-icons/fi';
import Button from './Button';
import Panel from './Panel';
import NoteWidget from './NoteWidget';
import { clearSession } from '../utils/auth';
import './UserMenu.css';

export default function UserMenu() {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const menuRef = useRef<HTMLDivElement>(null);
    const [noteOpen, setNoteOpen] = useState(false);
    const currentUser = JSON.parse(localStorage.getItem('user') ?? 'null');

    useEffect(() => {
        if (!menuOpen) return;
        
        function handleClickOutside(e: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(false);
            }
        }

        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === 'Escape') setMenuOpen(false);
        }

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [menuOpen]);

    function handleLogout() {
        clearSession();
        setMenuOpen(false);
        navigate('/login');
    }

    function openNote() {
        setMenuOpen(false);
        setNoteOpen(true);
    }

    return (
        <div className="user-menu" ref={menuRef}>
            <Panel
                clickable
                hoverEffect
                border="none"
                className="user-icon"
                onClick={() => setMenuOpen(!menuOpen)}
            >
                <FiUser />
            </Panel>
            {menuOpen && (
                <Panel
                    shadow
                    border="none"
                    className="user-menu-panel"
                    onClick={(e) => {
                        if ((e.target as HTMLElement).closest('button')) setMenuOpen(false);
                    }}
                >
                    <Button label="Editar perfil" color="outline" size="small" path="/user" />
                    <Button label="Anotar" color="outline" size="small" action={openNote} />
                    <Button label="Minhas anotações" color="outline" size="small" path="/queries" />
                    {currentUser?.is_admin && (<Button label="Gerenciar usuários" color="outline" size="small" path="/users" />)}
                    <Button label="Sair" color="danger" size="small" action={handleLogout} />
                </Panel>
            )}
            {noteOpen && <NoteWidget onClose={() => setNoteOpen(false)} />}
        </div>
    );
}