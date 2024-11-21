import styles from './contact.module.scss';
import aspaInicio from '../../assets/aspa-inicio-orange.svg';
import aspaFim from '../../assets/aspa-fim-orange.svg';
import { ButtonSite } from '../ButtonSite';
import { useEffect, useState } from 'react';


export interface ContactProps {
    id: string;

}

export function Contact({ id }: ContactProps) {

    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const redirectToWhatsApp = () => {
        const phoneNumber = "5581995673662";
        const message = encodeURIComponent("Olá, gostaria de saber mais sobre o passeio");
        const url = `https://wa.me/${phoneNumber}?text=${message}`;
        window.open(url, "_blank", "noopener,noreferrer");
    };

    return (
        <section id={id} className={styles.container}>

            <div className={styles.content}>
                {
                    width <= 768 ?
                        <>
                            <h2>
                                <img className={styles.inicio} src={aspaInicio} alt="aspa" />
                                Pronto para <br/>explorar<br/>
                                noronha ?
                                <img className={styles.fim} src={aspaFim} alt="aspa" />
                            </h2>
                        </>
                        :
                        <>
                            <h2>
                                <img className={styles.inicio} src={aspaInicio} alt="aspa" />
                                Pronto para explorar<br />
                                noronha ?
                                <img className={styles.fim} src={aspaFim} alt="aspa" />
                            </h2>
                        </>
                }

                <h3>
                    "Reserve seu lugar e viva essa experiência <br /> única no paraíso!"
                </h3>
                <div className={styles.contentButton}>
                    <ButtonSite onClick={redirectToWhatsApp}>
                        {
                            width <= 768 ? 'Reserve o seu passeio' 
                            :
                            'Reserve agora o seu passeio'
                        }
                        
                    </ButtonSite>
                </div>
            </div>
        </section>
    )
}