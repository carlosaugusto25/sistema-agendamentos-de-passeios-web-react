import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from './depoiments.module.scss';
import aspasInicio from '../../assets/aspa-inicio-orange.svg';
import aspasFim from '../../assets/aspa-fim-orange.svg';
import { CardDepoiment } from '../CardDepoiment';
import { useEffect, useRef, useState } from 'react';
import Slider from "react-slick";
import arrow from '../../assets/arrow-button.svg';
import { depoiments } from '../../data/depoiments';

interface DepoimentsProps {
    id: string;
}

export function Depoiments({id}: DepoimentsProps) {

    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: width <= 768 ? 1 : 2,
        slidesToScroll: 1,
        arrows: false,
        // initialSlide: 5
    };

    const sliderRef = useRef<Slider>(null);

    const goToNext = () => {
        sliderRef.current?.slickNext();
    };

    const goToPrev = () => {
        sliderRef.current?.slickPrev();
    };

    return (
        <section id={id} className={styles.container}>
            <div className={styles.orangeDiv} />
            <h2><img src={aspasInicio} alt="" />depoimentos<img src={aspasFim} alt="" /></h2>
            <div className={styles.contentCarossel}>
                <button className={styles.arrowButton} onClick={goToPrev}><img className={styles.arrow} src={arrow} alt="" /></button>
                <Slider ref={sliderRef} {...settings}>
                    {
                        depoiments && depoiments.map(depo=>(
                            <CardDepoiment key={depo.id} text={depo.text} />
                        ))
                    }
                </Slider>
                <button className={styles.arrowButton} onClick={goToNext}><img src={arrow} alt="" /></button>
            </div>

        </section>
    )
}