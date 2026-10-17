import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { MdDeleteOutline } from "react-icons/md";
import Navbar from '../components/Navbar';
import Section from '../components/Section';
import Footer from '../components/Footer';
import PageHeader from '../components/PageHeader';
import Panel from '../components/Panel';
import Button from '../components/Button';
import NoteView from '../components/NoteView';
import ConfirmDialog from '../components/ConfirmDialog';
import { isLoggedIn } from '../utils/auth';
import './Queries.css';

interface SearchRecord {
    id: number;
    search_term: string;
    searched_at: string;
}

const API_URL = '<url-da-api>/search-history';

export default function Queries(){
    const token = isLoggedIn() ? localStorage.getItem('token') : null;
    const [searches, setSearches] = useState<SearchRecord[]>([]);
    const [error, setError] = useState('');
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [selectedNote, setSelectedNote] = useState<string | null>(null);

    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
    };

    async function loadSearches() {
        try {
            const res = await fetch(API_URL, { headers });

            if (!res.ok) {
                setError('Erro ao carregar anotações de consultas');
                return;
            }

            setSearches(await res.json());
        } catch {
            setError('Erro ao conectar com o servidor');
        }
    }

    useEffect(() => {
        if (token) loadSearches();
    }, []);

    async function handleDelete(id: number) {
        setError('');
        try {
            const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE', headers });

            if (!res.ok) {
                setError('Erro ao excluir anotação');
                return;
            }
            
            setSearches((currentSearches) =>
                currentSearches.filter((search) => search.id !== id)
            );
        } catch {
            setError('Erro ao conectar com o servidor');
        }
    }

    if (!token) return <Navigate to="/login" replace />;
    
    return (
        <>
            <Navbar />
            <Section>
                <PageHeader title="Minhas anotações" subtitle="Suas anotações sobre as consultas aos dashboards." subtitleSize="small" align="left" />
                {error && <span className="input-error">{error}</span>}
                {searches.length === 0 && !error && <p className="queries-empty">Nenhuma anotação de consulta realizada.</p>}
                <div className="queries-list">
                    {searches.map((search) => (
                        <Panel
                            key={search.id}
                            clickable
                            onClick={(e) => {
                                if ((e.target as HTMLElement).closest('button')) return;
                                setSelectedNote(search.search_term);
                            }}
                            className="query-item"
                        >
                            <p>{search.search_term}</p>
                            <div className="query-footer">
                                <small>{new Date(search.searched_at).toLocaleDateString('pt-BR')}</small>
                                <Button label={<MdDeleteOutline />} color="outline" size="small" action={() => setDeleteId(search.id)} />
                            </div>
                        </Panel>
                    ))}
                </div>
                {selectedNote !== null && (
                    <NoteView text={selectedNote} onClose={() => setSelectedNote(null)} />
                )}
                {deleteId !== null && (
                    <ConfirmDialog
                        title="Excluir anotação"
                        message="Sua anotação será excluída. Tem certeza que deseja continuar?"
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