import styles from './information.module.scss';
import aspaInicio from '../../assets/aspa-inicio-orange.svg';
import aspaFim from '../../assets/aspa-fim-orange.svg';
import beach from  '../../assets/beach-2.jpeg';

interface InformationProps {
    id: string;
}

export function Information({id}: InformationProps) {
    return (
        <section id={id} className={styles.container}>
            <aside>
                <h2><img className={styles.aspaInicio} src={aspaInicio} alt="aspa" />informações importantes<img className={styles.aspaFim} src={aspaFim} alt="aspa" /></h2>
                <h3>Veja tudo que você preciso saber antes do passeio.</h3>
                <ul>
                    <li>Parada para mergulho e snorkeling</li>
                    <li>Visita a praias exclusivas</li>
                    <li>Observação de golfinhos e fauna marinha</li>
                    <li>Pôr do sol a bordo</li>
                </ul>
            </aside>
            <img className={styles.beach} src={beach} alt="mulher sentada com vista para praia de Fernando de Noronha" />
        </section>
    )
}