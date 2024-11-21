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
    
    const [downDoubt, setDownDoubt] = useState(false)
    
    return (
        <section id={id} className={styles.container} >
            <img src={beach} alt="vista de cima de uma praia de Fernando de Noronha" />
            <aside>
                <h2><img className={styles.aspaInicio} src={aspaInicio} alt="aspa" />informações importantes<img className={styles.aspaFim} src={aspaFim} alt="aspa" /></h2>
                <p onClick={()=>setDownDoubt(!downDoubt)}>Parada para megulho e snorkeling {downDoubt ? <IoIosArrowUp/> : <IoIosArrowDown/>}</p>
                <p onClick={()=>setDownDoubt(!downDoubt)}>Parada para megulho e snorkeling {downDoubt ? <IoIosArrowUp/> : <IoIosArrowDown/>}</p>
                <p onClick={()=>setDownDoubt(!downDoubt)}>Parada para megulho e snorkeling {downDoubt ? <IoIosArrowUp/> : <IoIosArrowDown/>}</p>
                <p onClick={()=>setDownDoubt(!downDoubt)}>Parada para megulho e snorkeling {downDoubt ? <IoIosArrowUp/> : <IoIosArrowDown/>}</p>
            </aside>
        </section>
    )
}