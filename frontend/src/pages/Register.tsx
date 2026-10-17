import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Section from '../components/Section';
import Footer from '../components/Footer';
import PageHeader from '../components/PageHeader';
import Panel from '../components/Panel';
import Input from '../components/Input';
import Button from '../components/Button';
import './AuthForm.css';

export default function Register(){
    const [user, setUser] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({
        user: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [serverError, setServerError] = useState('');
    const navigate = useNavigate();

    function validateField(name: string, value: string, currentPassword = password) {
        switch (name) {
            case 'user':
                if (!value.trim()) return 'Nome de usuário é obrigatório';
                return '';
            case 'email':
                if (!value) return 'E-mail é obrigatório';
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'E-mail inválido';
                return '';
            case 'password':
                if (!value) return 'Senha é obrigatória';
                if (value.length < 8) return 'A senha deve conter no mínimo 8 caracteres';
                return '';
            case 'confirmPassword':
                if (!value) return 'Confirmação de senha é obrigatória';
                if (value !== currentPassword) return 'As senhas não coincidem';
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

    async function handleRegister(e: React.FormEvent) {
        e.preventDefault();

        const newErrors = {
            user: validateField('user', user),
            email: validateField('email', email),
            password: validateField('password', password),
            confirmPassword: validateField('confirmPassword', confirmPassword),
        };

        setErrors(newErrors);
        if (Object.values(newErrors).some(Boolean)) return;
        setServerError('');

        try {
            const res = await fetch('<url-da-api>/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: user, email, password }),
            })

            const data = await res.json();

            if (!res.ok) {
                setServerError(data.message ?? 'Erro ao criar conta');
                return;
            }

            const loginRes = await fetch('<url-da-api>/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            })

            if (!loginRes.ok) {
                navigate('/login', {
                    state: { message: 'Conta criada com sucesso! Faça login para continuar.' },
                });
                return;
            }

            const loginData = await loginRes.json();

            localStorage.setItem('token', loginData.token);
            localStorage.setItem('user', JSON.stringify(loginData.user));

            navigate('/');
        } catch {
            setServerError('Erro ao conectar com o servidor');
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
                    <PageHeader title="Criar Conta" align="left" level="h3" />
                    <form onSubmit={handleRegister}>
                        <Input
                            label="Usuário"
                            name="user"
                            placeholder="Seu nome de usuário"
                            value={user}
                            onChange={(e) => setUser(e.target.value)}
                            onBlur={handleBlur}
                            error={errors.user}
                        />
                        <Input
                            label="E-mail"
                            name="email"
                            placeholder="seu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onBlur={handleBlur}
                            error={errors.email}
                        />
                        <Input
                            label="Senha"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value)

                                if (confirmPassword) {
                                    const message = validateField('confirmPassword', confirmPassword, e.target.value);
                                    setErrors((prev) => ({ ...prev, confirmPassword: message }));
                                }
                            }}
                            onBlur={handleBlur}
                            error={errors.password}
                        />
                        <Input
                            label="Confirmar senha"
                            name="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            onBlur={handleBlur}
                            error={errors.confirmPassword}
                        />
                        {serverError && <span className="input-error">{serverError}</span>}
                        <Button label="Criar Conta" type="submit" size="large" />
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