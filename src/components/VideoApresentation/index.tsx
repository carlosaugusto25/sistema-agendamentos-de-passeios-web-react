import styles from './videoapresentation.module.scss';
import aspaInicio from '../../assets/aspa-inicio-orange.svg';
import aspaFim from '../../assets/aspa-fim-orange.svg';
import { ButtonSite } from '../ButtonSite';
import { useEffect, useState } from 'react';

interface VideoApresentationProps {
    id: string;
}

export function VideoApresentation({ id }: VideoApresentationProps) {

    const redirectToWhatsApp = () => {
        const phoneNumber = "5581987486726";
        const message = encodeURIComponent("Olá, gostaria de saber mais sobre o passeio");
        const url = `https://wa.me/${phoneNumber}?text=${message}`;
        window.open(url, "_blank", "noopener,noreferrer");
    };

    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <section id={id} className={styles.container}>
            <video
                src="/wendell-passeios.mp4"
                autoPlay
                loop
                muted
                className={styles.bgVideo}
                playsInline
                preload="auto"
            ></video>
            <div className={styles.overlay}></div>
            <div className={styles.content}>
                <h1>
                    {width <= 768 ?
                        <>
                            <img className={styles.aspaInicio} src={aspaInicio} alt="aspa" />
                            explore fernando <br />de noronha como <br /> nunca vista antes!
                            <img className={styles.aspaFim} src={aspaFim} alt="aspa" />
                        </>
                        :
                        <>
                            <img className={styles.aspaInicio} src={aspaInicio} alt="aspa" />
                            explore fernando de noronha<br /> como nunca vista antes!
                            <img className={styles.aspaFim} src={aspaFim} alt="aspa" />
                        </>
                    }

                </h1>
                <h2>
                    "Aventure-se nas águas paradisíacas de <br />Noronha e descubra o melhor do arquipélago <br />em um passeio exclusivo de lancha.""
                </h2>
                <div className={styles.contentButton}>
                    <ButtonSite onClick={redirectToWhatsApp}>Reserve já seu passeio</ButtonSite>
                </div>
            </div>
        </section>
    )
}