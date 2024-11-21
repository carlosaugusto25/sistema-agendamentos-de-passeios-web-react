import styles from './buttonsite.module.scss';

interface ButtonSiteProps extends React.HTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

export function ButtonSite({children, ...rest}:ButtonSiteProps){
    return(
        <button className={styles.container} {...rest}>
            {children}
        </button>
    )
}