import { useState } from 'react';
import styles from './header.module.scss';
import bg from '../../assets/LogoFull.png';
import { FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth';
import { FiLogOut, FiMenu, FiX } from "react-icons/fi";
import { ToggleTheme } from '../ToggleTheme';

export function Header() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const menuItems = [
        { label: 'Agenda', to: '/agenda' },
        { label: 'Dashboard', to: '/dashboard' },
        { label: 'Clientes', to: '/clientes' },
        { label: 'Configurações', to: '/config' }
    ];

    const handleNavigate = (path: string) => {
        navigate(path);
        setMenuOpen(false);
    };

    return (
        <header className={styles.container}>
            <img className={styles.logo} src={bg} alt="Logo-Wendell-Passeios" onClick={() => handleNavigate('/')} />

            <nav className={styles.linksDesktop}>
                {menuItems.map(item => (
                    <Link key={item.to} className={styles.link} to={item.to}>
                        {item.label}
                    </Link>
                ))}
                <div className={styles.userContainer}>
                    <p>Olá, {user.name}</p>
                    <FaUserCircle className={styles.user} onClick={() => navigate('/profile')} />
                    <FiLogOut className={styles.logout} onClick={logout} />
                </div>
                <ToggleTheme />
            </nav>

            <button
                className={styles.menuToggle}
                onClick={() => setMenuOpen(prev => !prev)}
                aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            >
                {menuOpen ? <FiX /> : <FiMenu />}
            </button>

            <div
                className={`${styles.mobileOverlay} ${menuOpen ? styles.open : ''}`}
                onClick={() => setMenuOpen(false)}
                role="presentation"
            />

            <div className={`${styles.mobileMenu} ${menuOpen ? styles.open : ''}`}>
                <nav className={styles.mobileNav}>
                    {menuItems.map(item => (
                        <button
                            key={item.to}
                            className={styles.mobileLink}
                            onClick={() => handleNavigate(item.to)}
                        >
                            {item.label}
                        </button>
                    ))}
                </nav>
                <div className={styles.mobileActions}>
                    <div className={styles.mobileQuickActions}>
                        <button
                            className={styles.mobileActionButton}
                            onClick={() => handleNavigate('/profile')}
                        >
                            <FaUserCircle />
                            <span>Perfil</span>
                        </button>
                        <button
                            className={styles.mobileActionButton}
                            onClick={logout}
                        >
                            <FiLogOut />
                            <span>Sair</span>
                        </button>
                        <div className={styles.mobileTheme}>
                            <ToggleTheme />
                            <span>Tema</span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}