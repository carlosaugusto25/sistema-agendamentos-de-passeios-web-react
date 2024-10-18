import Lottie from 'react-lottie';
import animationData from '../../lotties/boat.json';
import styles from './loadingGet.module.scss';

export function LoadingBoatGet() {

    const defaultOptions = {
        loop: true,
        animationData: animationData,
    }

    return (
        <div className={styles.container}>
            
                
                    <Lottie options={defaultOptions} height={100} width={100} />
                
        </div>

    );
}