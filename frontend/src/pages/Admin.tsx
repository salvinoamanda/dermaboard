import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { MdDeleteOutline } from "react-icons/md";
import Navbar from '../components/Navbar';
import Section from '../components/Section';
import Footer from '../components/Footer';
import PageHeader from '../components/PageHeader';
import Panel from '../components/Panel';
import Button from '../components/Button';
import ConfirmDialog from '../components/ConfirmDialog';
import { isLoggedIn } from '../utils/auth';
import './Admin.css';

interface UserRecord {
    id: number;
    name: string;
    email: string;
    is_admin: boolean;
}

const API_URL = '<url-da-api>/users';

export default function Admin() {
    const token = isLoggedIn() ? localStorage.getItem('token') : null;
    const currentUser = JSON.parse(localStorage.getItem('user') ?? 'null');
    const [users, setUsers] = useState<UserRecord[]>([]);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [error, setError] = useState('');
    const headers = { Authorization: `Bearer ${token}` };

    async function loadUsers() {
        try {
            const res = await fetch(API_URL, { headers });

            if (!res.ok) {
                setError('Erro ao carregar usuários');
                return;
            }

            setUsers(await res.json());
        } catch {
            setError('Erro ao conectar com o servidor');
        }
    }

    useEffect(() => {
        if (token) loadUsers();
    }, []);

    async function handleDelete(id: number) {
        setError('');
        try {
            const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE', headers });

            if (!res.ok) {
                const data = await res.json();
                setError(data.message ?? 'Erro ao excluir usuário');
                return;
            }

            setUsers((current) => current.filter((user) => user.id !== id));
        } catch {
            setError('Erro ao conectar com o servidor');
        }
    }

    if (!token) return <Navigate to="/login" replace />;
    if (!currentUser?.is_admin) return <Navigate to="/" replace />;

    return (
        <>
            <Navbar />
            <Section>
                <PageHeader title="Usuários" subtitle="Gerencie as contas cadastradas no sistema." subtitleSize="small" align="left" />
                {error && <span className="input-error">{error}</span>}
                <div className="users-list">
                    {users.map((user) => (
                        <Panel key={user.id} border="none" className="user-item">
                            <div>
                                <p><strong>{user.name}</strong>{user.is_admin && ' (admin)'}</p>
                                <small>{user.email}</small>
                            </div>
                            {user.id !== currentUser.id && (
                                <Button label={<MdDeleteOutline />} color="outline" size="small" action={() => setDeleteId(user.id)} />
                            )}
                        </Panel>
                    ))}
                </div>
                {deleteId !== null && (
                    <ConfirmDialog 
                        title="Excluir usuário" 
                        message="A conta será excluída e essa ação não pode ser desfeita. Deseja continuar?"
                        onCancel={() => setDeleteId(null)}
                        onConfirm={async () => {
                            await handleDelete(deleteId);
                            setDeleteId(null);
                        }}
                    />
                )}
            </Section>
            <Footer />
        </>
    );
}