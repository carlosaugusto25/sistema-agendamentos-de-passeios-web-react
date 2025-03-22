import styles from './doubts.module.scss';
import aspaInicio from '../../assets/aspa-inicio-orange.svg';
import aspaFim from '../../assets/aspa-fim-orange.svg';
import beach from '../../assets/beach-3.svg';
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { useState } from 'react';

interface DoubtsProps {
    id: string;
}

export function Doubts({ id }: DoubtsProps) {
    
    const [downDoubt1, setDownDoubt1] = useState(false)
    const [downDoubt2, setDownDoubt2] = useState(false)
    const [downDoubt3, setDownDoubt3] = useState(false)
    const [downDoubt4, setDownDoubt4] = useState(false)
    const [downDoubt5, setDownDoubt5] = useState(false)
    const [downDoubt6, setDownDoubt6] = useState(false)
    
    return (
        <section id={id} className={styles.container} >
            <img src={beach} alt="vista de cima de uma praia de Fernando de Noronha" />
            <aside>
                <h2><img className={styles.aspaInicio} src={aspaInicio} alt="aspa" />dúvidas mais comuns<img className={styles.aspaFim} src={aspaFim} alt="aspa" /></h2>
                <p onClick={()=>setDownDoubt1(!downDoubt1)}>{downDoubt1 ? <IoIosArrowUp/> : <IoIosArrowDown/>} Quanto tempo de duração?</p>
                {
                    downDoubt1 && <p className={styles.question}>4 horas de passeio das 9h as 13h ou das 14h30 as 18h30 (pôr do sol).</p>
                }
                <p onClick={()=>setDownDoubt2(!downDoubt2)}>{downDoubt2 ? <IoIosArrowUp/> : <IoIosArrowDown/>} Entra no Sancho?</p>
                {
                    downDoubt2 && <p className={styles.question}>Não, o percurso é do Porto até o Morro Dois Irmãos.</p>
                }
                <p onClick={()=>setDownDoubt3(!downDoubt3)}>{downDoubt3 ? <IoIosArrowUp/> : <IoIosArrowDown/>} Tem bebida a bordo?</p>
                {
                    downDoubt3 && <p className={styles.question}>Não, o cliente tem que trazer bebida e gelo.</p>
                }
                <p onClick={()=>setDownDoubt4(!downDoubt4)}>{downDoubt4 ? <IoIosArrowUp/> : <IoIosArrowDown/>} Tem equipamento de mergulho?</p>
                {
                    downDoubt4 && <p className={styles.question}>Apenas coletes recreativos.</p>
                }
                <p onClick={()=>setDownDoubt5(!downDoubt5)}>{downDoubt5 ? <IoIosArrowUp/> : <IoIosArrowDown/>} O passeio dá a volta na ilha?</p>
                {
                    downDoubt5 && <p className={styles.question}>Só navegamos na área do Porto até o Morro Dois Irmãos.</p>
                }
                <p onClick={()=>setDownDoubt6(!downDoubt6)}>{downDoubt6 ? <IoIosArrowUp/> : <IoIosArrowDown/>} O que precisa levar?</p>
                {
                    downDoubt6 && <p className={styles.question}>Roupa de banho, protetor solar, chapéu e toalha.</p>
                }
            </aside>
        </section>
    )
}