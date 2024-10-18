import styles from './header.module.scss'
import bg from '../../assets/LogoFull.png'
import { FaUserCircle } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/auth';
import { FiLogOut } from "react-icons/fi";


export function Header() {

    const { user, logout } = useAuth()

    return (
        <header className={styles.container}>
            <img className={styles.logo} src={bg} alt="Logo-Wendell-Passeios" />
            <div className={styles.links}>
                <Link className={styles.link} to='/home'>Início</Link>
                <Link className={styles.link} to='/config'>Configurações</Link>
                <div className={styles.userContainer}>
                    <p>Olá, {user.name}</p>
                    <FaUserCircle className={styles.user} />
                    <FiLogOut className={styles.logout} onClick={logout} />
                </div>
            </div>
        </header>
    )
}