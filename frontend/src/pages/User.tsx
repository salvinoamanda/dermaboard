import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Section from '../components/Section';
import Footer from '../components/Footer';
import PageHeader from '../components/PageHeader';
import Panel from '../components/Panel';
import Input from '../components/Input';
import Button from '../components/Button';
import { isLoggedIn } from '../utils/auth'; 
import './AuthForm.css';

export default function User() {
    const token = isLoggedIn() ? localStorage.getItem('token') : null;
    const storedUser = JSON.parse(localStorage.getItem('user') ?? 'null');

    const [name, setName] = useState(storedUser?.name ?? '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({ name: '', password: '', confirmPassword: '' });
    const [serverError, setServerError] = useState('');
    const [success, setSuccess] = useState('');

    function validateField(name: string, value: string, currentPassword = password) {
        switch (name) {
            case 'name':
                if (!value.trim()) return 'Nome de usuário é obrigatório';
                return '';
            case 'password':
                if (value && value.length < 8) return 'A senha deve conter no mínimo 8 caracteres';
                return '';
            case 'confirmPassword':
                if (currentPassword && !value) return 'Confirmação de senha é obrigatória';
                if (currentPassword && value !== currentPassword) return 'As senhas não coincidem';
                return '';
            default:
                return '';
        }
    }

    function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        const message = validateField(name, value);
        setErrors((prev) => ({ ...prev, [name]: message }));
    }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        setServerError('');
        setSuccess('');

        const newErrors = {
            name: validateField('name', name),
            password: validateField('password', password),
            confirmPassword: validateField('confirmPassword', confirmPassword),
        };

        setErrors(newErrors);
        if (Object.values(newErrors).some(Boolean)) return;

        const body: { name: string; password?: string } = { name: name.trim() };

        if (password) body.password = password;

        try {
            const res = await fetch('<url-da-api>/user/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            });
            const data = await res.json();

            if (!res.ok) {
                setServerError(data.message ?? 'Erro ao atualizar perfil');
                return;
            }

            localStorage.setItem('user', JSON.stringify({ ...storedUser, name: data.name ?? body.name }));
            setPassword('');
            setConfirmPassword('');
            setSuccess('Perfil atualizado com sucesso!');
        } catch {
            setServerError('Erro ao conectar com o servidor');
        }
    }

    if (!token) return <Navigate to="/login" replace />;

    return (
        <>
            <Navbar />
            <Section>
                <PageHeader title="Editar perfil" subtitle="Atualize seu nome de usuário ou sua senha." subtitleSize="small" align="center" />
                <Panel border="none" shadow className="auth-form-panel">
                    <PageHeader title="Seus dados" align="left" level="h3" />
                    <form onSubmit={handleSave}>
                        <p><span>E-mail:</span> {storedUser?.email}</p>
                        <Input
                            label="Usuário"
                            name="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onBlur={handleBlur}
                            error={errors.name}
                        />
                        <Input
                            label="Nova senha"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onBlur={handleBlur}
                            error={errors.password}
                        />
                        <Input
                            label="Confirmar nova senha"
                            name="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            onBlur={handleBlur}
                            error={errors.confirmPassword}
                        />
                        <p>Deixe os campos de senha em branco caso não queira alterá-la.</p>
                        {serverError && <span className="input-error">{serverError}</span>}
                        {success && <span className="input-success">{success}</span>}
                        <Button label="Salvar alterações" type="submit" size="large" />
                    </form>
                </Panel>
            </Section>
            <Footer />
        </>
    );
}