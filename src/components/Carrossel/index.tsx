import styles from './carrossel.module.scss';
import 'swiper/css'; // Estilos básicos do Swiper
import 'swiper/css/pagination'; // Estilos adicionais para paginação (opcional)
import 'swiper/css/effect-coverflow';
import { Swiper, SwiperSlide } from 'swiper/react';
import img1 from '../../assets/img1.jpg';
import img2 from '../../assets/img2.jpg';
import img3 from '../../assets/img3.jpg';
import img4 from '../../assets/img4.jpg';
import img5 from '../../assets/img5.jpg';
import img6 from '../../assets/img6.png';
import { Autoplay, EffectCoverflow, Pagination } from 'swiper/modules';
import aspaInicio from '../../assets/aspa-inicio-orange.svg';
import aspaFim from '../../assets/aspa-fim-orange.svg';
import { useEffect, useState } from 'react';

interface CarrosselProps {
    id: string;
}

export function Carrossel({id}: CarrosselProps) {
    
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
            <div className={styles.swiperContent}>
                <Swiper
                    spaceBetween={width <= 768 ? -150 : 100}
                    navigation={false}
                    className={styles.mySwiper}
                    autoplay={true}
                    loop={true}
                    modules={[EffectCoverflow, Pagination, Autoplay]}
                    effect={'coverflow'}
                    grabCursor={true}
                    centeredSlides={true}
                    slidesPerView={width <= 768 ? 2 : 'auto'}
                    coverflowEffect={{
                        rotate: 0,
                        stretch: 0,
                        depth: 150,
                        modifier: 2.5,
                        slideShadows: true,
                    }}
                    pagination={false}
                    
                >
                    <SwiperSlide><img className={styles.imgSwiper} src={img1} alt="" /></SwiperSlide>
                    <SwiperSlide><img className={styles.imgSwiper} src={img2} alt="" /></SwiperSlide>
                    <SwiperSlide><img className={styles.imgSwiper} src={img3} alt="" /></SwiperSlide>
                    <SwiperSlide><img className={styles.imgSwiper} src={img1} alt="" /></SwiperSlide>
                    <SwiperSlide><img className={styles.imgSwiper} src={img4} alt="" /></SwiperSlide>
                    <SwiperSlide><img className={styles.imgSwiper} src={img6} alt="" /></SwiperSlide>
                    <SwiperSlide><img className={styles.imgSwiper} src={img5} alt="" /></SwiperSlide>
                    
                </Swiper>
            </div>
            <div className={styles.contentText}>
                <h2><img src={aspaInicio} alt="" />por que escolher nossos passeios de lancha?<img src={aspaFim} alt="" /></h2>
                <ul>
                    <li>Experiência Exclusiva: <span> Navegue em lanchas confortáveis, com guias especializados.</span></li>
                    <li>Paisagens Únicas: <span> Veja o arquipélago a partir de perspectivas únicas, acessíveis apenas de barco.</span></li>
                    <li>Atividades Incríveis: <span> Mergulho, snorkeling e paradas em praias desertas.</span></li>
                    <li>Cuidado Ambiental: <span> Passeios organizados com respeito à natureza e às diretrizes ambientais.</span></li>
                </ul>
            </div>
        </section>
    )
}