import styles from './buttonComponent.module.scss';

interface ButtonComponentProps {
    onClick: () => void;
    text: string;
    type: "cancel" | "delete" | "create";
    width?: string;
    margin?: string;
}

export function ButtonComponent({onClick, text, type, width, margin}: ButtonComponentProps) {
    return(
        <button onClick={onClick} className={type === "create" ? styles.buttonCreate : (type === "cancel" ? styles.buttonCancel : styles.buttonDelete)} style={{width: width ? width : "100%", margin: margin ? margin : "0"}}>
            {text}
        </button>
    )
}