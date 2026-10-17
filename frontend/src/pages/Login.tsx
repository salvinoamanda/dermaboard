import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Section from '../components/Section';
import Footer from '../components/Footer';
import PageHeader from '../components/PageHeader';
import Panel from '../components/Panel';
import Input from '../components/Input';
import Button from '../components/Button';
import './AuthForm.css';

export default function Login(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const successMessage = location.state?.message;

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setError('');

        try {
            const res = await fetch('<url-da-api>/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            })

            const data = await res.json();

            if (!res.ok) {
                setError(data.message ?? 'E-mail ou senha inválidos');
                return;
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            navigate('/');
        } catch {
            setError('Erro ao conectar com o servidor');
        }
    }

    return (
        <>
            <Navbar accessPage />
            <Section>
                <PageHeader title="Acesso ao Sistema" subtitle="Faça login para acessar recursos avançados" subtitleSize="small" align="center" />
                <Panel border="none" theme="dark" className="form-actions">
                    <Button color="outline" label="Login" size="large" path='/login'></Button>
                    <Button color="outline" label="Cadastro" size="large" path='/register'></Button>
                </Panel>
                <Panel border="none" shadow className="auth-form-panel">
                    <PageHeader title="Entrar" align="left" level="h3" />
                    {successMessage && <span className="input-success">{successMessage}</span>}
                    <form onSubmit={handleLogin}>
                        <Input
                            label="E-mail"
                            name="email"
                            placeholder="seu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Input
                            label="Senha"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {error && <span className="input-error">{error}</span>}
                        <Button label="Entrar" type="submit" size="large" />
                    </form>
                </Panel>
                <Panel border="all" theme="dark" className="benefits-panel">
                    <PageHeader title="Benefícios do Cadastro:" level="h4" align="left" />
                    <ul>
                        <li>Salvar consultas e filtros personalizados</li>
                        <li>Acesso a dashboards interativos avançados</li>
                        <li>Histórico de pesquisas realizadas</li>
                        <li>Configurações personalizadas do sistema</li>
                    </ul>
                </Panel>
            </Section>
            <Footer />
        </>
    );
}