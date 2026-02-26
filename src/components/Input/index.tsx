import styles from './input.module.scss';
import { FaSearch } from "react-icons/fa";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    placeholder?: string;
    width?: string;
    checkbox?: boolean;
    icon?: boolean;
    onFunction?: () => void;
}
export function Input({ placeholder, width, checkbox, icon, onFunction, ...rest }: InputProps) {
    return (
        <>
            {
                icon ?
                    <div className={styles.inputAndIcon} style={{ width: width ? width : '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <input {...rest} placeholder={placeholder} className={styles.inputContent} style={{ width: width ? width : '100%', height: checkbox ? '1rem' : '2.5rem' }} />
                        <FaSearch className={styles.icon} onClick={onFunction} />
                    </div>
                    :
                    <input {...rest} placeholder={placeholder} className={styles.input} style={{ width: width ? width : '100%', height: checkbox ? '1rem' : '2.5rem' }} />

            }
        </>


    )
}