import styles from './beach1.module.scss';
import aspaInicio from '../../assets/aspa-inicio-orange.svg';
import aspaFim from '../../assets/aspa-fim-orange.svg';

interface Beach1Props {
    id: string;
}

export function Beach1({ id }: Beach1Props) {
    return (
        <section id={id} className={styles.container} >
            <div className={styles.content}>
                <div className={styles.contentText}>
                    <h2><img src={aspaInicio} alt="" />o que esperar do passeio de lancha?<img src={aspaFim} alt="" /></h2>

                    <p>
                        Durante o passeio, você terá a chance de nadar nas águas transparentes e ver de perto a fauna e flora marinha. Em alguns pontos, será possível avistar golfinhos e, dependendo da época, até baleias. E tudo isso com conforto e segurança!
                    </p>

                    <ul className={styles.list}>
                        <li>Parada para mergulho e snorkeling</li>
                        <li>Visita a praias exclusivas</li>
                        <li>Observação de golfinhos e fauna marinha</li>
                        <li>Pôr do sol a bordo</li>
                    </ul>

                </div>
            </div>
        </section>
    )
}