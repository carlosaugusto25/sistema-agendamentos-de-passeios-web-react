import styles from './footer.module.scss';
import yazon from '../../assets/yazon-logo.svg';

export function Footer() {
    return (
        <footer className={styles.container}>
            <a href="https://yazon.com.br" target="_blank" rel="noopener noreferrer">
                <img src={yazon} alt="Logo Yazon" />
            </a>
            <p>todos os direitos reservados © {new Date().getFullYear()}</p>
        </footer>
    )
}