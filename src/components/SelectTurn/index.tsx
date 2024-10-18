import styles from '../SelectBoat/selectBoat.module.scss';

interface SelectTurnProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    setTurnSelected: (turnSelected: string) => void;
    turn?:string;
}

export function SelectTurn({turn,setTurnSelected, ...rest}: SelectTurnProps) {
    return(
        <select {...rest} value={turn} onChange={(event) => setTurnSelected(event.target.value)} className={styles.select}>
            <option className={styles.option} value="">Turno</option>
            <option value="MORNING">Manha</option>
            <option value="AFTERNOON">Tarde</option>
            <option value="DAY">Dia inteiro</option>
        </select>
    )
}