import { useState } from "react";
import { Beach1 } from "../../components/Beach1";
import { Carrossel } from "../../components/Carrossel";
import { Contact } from "../../components/Contact";
import { Depoiments } from "../../components/Depoiments";
import { Doubts } from "../../components/Doubts";
import { Footer } from "../../components/Footer";
import { HeaderSite } from "../../components/HeaderSite";
import { Information } from "../../components/Information";
import { VideoApresentation } from "../../components/VideoApresentation";
import styles from './landingpage.module.scss';

export function LandingPage() {

    const [show, setShow] = useState(false);


    return (
        <main className={`${styles.container} ${show ? styles.hidden : ''}`}>
            <HeaderSite show={show} setShow={setShow} />
            <VideoApresentation id='inicio' />
            <Carrossel id='sobre' />
            <Beach1 id='passeio' />
            <Depoiments id='depoimentos' />
            <Information id='info' />
            <Doubts id='duvidas' />
            <Contact id='contato' />
            <Footer />
        </main>
    )
}