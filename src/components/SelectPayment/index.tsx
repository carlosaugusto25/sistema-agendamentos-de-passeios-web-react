import styles from '../SelectBoat/selectBoat.module.scss';

interface SelectPaymentProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    setPaymentType: (id: string) => void
    paymentType?: string;
}

export function SelectPayment({paymentType, setPaymentType, ...rest}: SelectPaymentProps) {
    return (
        <select {...rest} value={paymentType} onChange={(event) => setPaymentType(event.target.value)} className={styles.select}>
            <option className={styles.option} value="" disabled>Forma de pgto</option>
            <option value="MONEY">Dinheiro</option>
            <option value="CREDCARD">Cartão de crédito</option>
            <option value="PIX">Pix</option>
        </select>
    )
}