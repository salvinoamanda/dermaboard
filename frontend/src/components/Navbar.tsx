import { useNavigate, useLocation } from 'react-router-dom';
import { RiArrowGoBackLine } from 'react-icons/ri';
import Button  from './Button';
import UserMenu from './UserMenu';
import logo from '../assets/logo_dermaboard.png';
import { isLoggedIn } from '../utils/auth';
import './Navbar.css';

interface NavbarProps {
    accessPage?: boolean;
}

export default function Navbar({ accessPage = false }: NavbarProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const isLogged = isLoggedIn();

    const links = [
        { path: '/', label: 'Home' },
        { path: '/dashboards', label: 'Dashboards' },
        { path: '/about', label: 'Sobre o câncer de pele' },
    ]

    const logoBlock = (
        <div className="left">
            <img src={logo} alt="Logo" className="logo" />
            <h3>
                <span className="derma">Derma</span>
                <span className="board">Board</span>
            </h3>
        </div>
    );

    return(
        <>
            <nav className="navbar">
                {!accessPage && (
                    <div className="container">
                            {logoBlock}
                            <div className="center">
                                {links.map(({ path, label }) => (
                                    <span
                                        key={path}
                                        className={`link ${location.pathname === path ? 'active' : ''}`}
                                        onClick={() => navigate(path)}
                                    >
                                        {label}
                                    </span>
                                ))}
                            </div>
                            <div className="right">
                                {isLogged ? (
                                    <UserMenu />
                                ) : (
                                    <Button label="Entrar" color="secondary" size="small" path="/login" />
                                )}
                            </div>
                    </div>
                )}
                {accessPage && (
                    <div className="container-access">
                        {logoBlock}
                        <div className="right">
                            <Button label="Voltar" color="secondary" size="small" path="/" icon={<RiArrowGoBackLine />} iconPosition="left" />
                        </div>
                    </div>
                )}
            </nav>
        </>
    );
}