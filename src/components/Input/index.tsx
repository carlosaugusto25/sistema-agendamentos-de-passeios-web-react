import styles from './input.module.scss';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    placeholder?: string;
    width?: string;
    checkbox?: boolean
}
export function Input({placeholder, width, checkbox, ...rest}: InputProps){
    return(
        <input {...rest} placeholder={placeholder} className={styles.input} style={{width: width ? width : '100%', height: checkbox ? '1rem' : '2.5rem'}} />
       )
}