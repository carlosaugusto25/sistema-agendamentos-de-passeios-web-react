import styles from './carddepoiment.module.scss';

interface CardProps {
    text: string;
}

export function CardDepoiment({text}: CardProps) {
    return(
        <div className={styles.container}>
            <p className={styles.depoiment}>
                <span>"</span>{text}<span>"</span>
            </p>
        </div>
    )
}