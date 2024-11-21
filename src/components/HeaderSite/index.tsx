import styles from './headersite.module.scss';
import logo from '../../assets/logo-full.svg';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ButtonSite } from '../ButtonSite';
import { useAuth } from '../../context/auth';
import { FaListUl } from "react-icons/fa";
import { TbXboxX } from "react-icons/tb";

export interface HeaderSiteProps {
    show: boolean;
    setShow: (val: boolean) => void;
}

export function HeaderSite({ show, setShow }: HeaderSiteProps) {

    const navigate = useNavigate()

    const { user } = useAuth()

    const [select, setSelect] = useState<'inicio' | 'sobre' | 'passeio' | 'depoimentos' | 'info' | 'duvidas' | 'contato'>('inicio');

    const [visible, setVisible] = useState(true);
    const [lastScroll, setLastScroll] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScroll = window.scrollY;

            if (currentScroll > lastScroll && currentScroll > 50) {
                setVisible(false);
            } else if (currentScroll < lastScroll) {
                setVisible(true);
            }

            setLastScroll(currentScroll);
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [lastScroll]);

    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);


    return (
        <>
            <header className={`${styles.container} ${visible ? styles.visible : styles.hidden} ${show ? styles.overflow : ''}`}>
                <img src={logo} alt="Logo Wendell Passeios" />
                <nav>
                    <a className={select === 'inicio' ? styles.linkSelect : styles.linkNoSelect} onClick={() => setSelect('inicio')} href="#inicio">Início{select === 'inicio' && <div className={styles.line} />}</a>
                    <a className={select === 'sobre' ? styles.linkSelect : styles.linkNoSelect} onClick={() => setSelect('sobre')} href="#sobre">Sobre{select === 'sobre' && <div className={styles.line} />}</a>
                    <a className={select === 'passeio' ? styles.linkSelect : styles.linkNoSelect} onClick={() => setSelect('passeio')} href="#passeio">Passeio{select === 'passeio' && <div className={styles.line} />}</a>
                    <a className={select === 'depoimentos' ? styles.linkSelect : styles.linkNoSelect} onClick={() => setSelect('depoimentos')} href="#depoimentos">Depoimentos{select === 'depoimentos' && <div className={styles.line} />}</a>
                    <a className={select === 'info' ? styles.linkSelect : styles.linkNoSelect} onClick={() => setSelect('info')} href="#info">Informações{select === 'info' && <div className={styles.line} />}</a>
                    <a className={select === 'duvidas' ? styles.linkSelect : styles.linkNoSelect} onClick={() => setSelect('duvidas')} href="#duvidas">Dúvidas{select === 'duvidas' && <div className={styles.line} />}</a>
                    <a className={select === 'contato' ? styles.linkSelect : styles.linkNoSelect} onClick={() => setSelect('contato')} href="#contato">Contato{select === 'contato' && <div className={styles.line} />}</a>
                    <ButtonSite style={{ height: '2rem', fontSize: '0.9rem', padding: '0 2rem' }} onClick={() => navigate(user ? '/home' : '/login')}>Login</ButtonSite>
                </nav>
                {width <= 768 && <FaListUl className={styles.icon} onClick={() => setShow(!show)} />}
                {width <= 768 && <ButtonSite style={{ height: '2rem', fontSize: '0.9rem', padding: '0 .8rem' }} onClick={() => navigate(user ? '/home' : '/login')}>Login</ButtonSite>}
            </header>
            <div className={`${show ? styles.menuMobile : styles.none}`}>
                <TbXboxX className={styles.icon} size={40} onClick={() => setShow(!show)} />
                <a className={styles.link} onClick={() => {setSelect('inicio'); setShow(!show)}} href="#inicio">Início</a>
                <a className={styles.link} onClick={() => {setSelect('sobre'); setShow(!show)}} href="#sobre">Sobre</a>
                <a className={styles.link} onClick={() => {setSelect('passeio'); setShow(!show)}} href="#passeio">Passeio</a>
                <a className={styles.link} onClick={() => {setSelect('depoimentos'); setShow(!show)}} href="#depoimentos">Depoimentos</a>
                <a className={styles.link} onClick={() => {setSelect('info'); setShow(!show)}} href="#info">Informações</a>
                <a className={styles.link} onClick={() => {setSelect('duvidas'); setShow(!show)}} href="#duvidas">Dúvidas</a>
                <a className={styles.link} onClick={() => {setSelect('contato'); setShow(!show)}} href="#contato">Contato</a>
            </div>
        </>
    )
}