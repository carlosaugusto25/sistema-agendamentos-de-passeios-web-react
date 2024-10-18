import { ButtonComponent } from '../ButtonComponent';
import { LoadingBoat } from '../LoadingBoat';
import styles from './modal.module.scss';
import { FaRegTrashCan, FaFilePdf } from "react-icons/fa6";

interface ModalProps {
    children: React.ReactNode;
    onClose: () => void;
    typeButton1: "create" | "cancel" | "delete";
    typeButton2: "create" | "cancel" | "delete";
    textButton1: string;
    textButton2: string;
    onClick: () => void;
    title: string;
    loading?: boolean;
    deleteIcon?: boolean;
    onDelete?: () => void;
    voucherIcon?: boolean;
    onVoucher?: () => void;
}

export function Modal({onDelete, deleteIcon, voucherIcon, onVoucher, children, loading, onClose, typeButton1, typeButton2, textButton1, textButton2, onClick, title }: ModalProps) {
    return (
        <div className={styles.modalOverlay}>
            {loading ? <LoadingBoat />
                :
                <div className={styles.modalWrapper}>
                    <div className={styles.modal}>
                        <div className={styles.modalHeader}>
                            <h1>{title}</h1>
                            {
                                (deleteIcon && !voucherIcon) && <FaRegTrashCan size={22} onClick={onDelete} style={{cursor: 'pointer', color: 'red'}} />
                            }
                            {
                                (deleteIcon && voucherIcon) &&
                                <div style={{display: 'flex', flexDirection: 'row', gap: '1rem'}}>
                                    <FaFilePdf size={22} onClick={onVoucher} style={{cursor: 'pointer', color: '#0099DD'}} />
                                    <FaRegTrashCan size={22} onClick={onDelete} style={{cursor: 'pointer', color: 'red'}} />
                                </div>
                            }
                        </div>
                        <div className={styles.modalBody}>
                            {children}
                        </div>
                        <div className={styles.modalFooter}>
                            <ButtonComponent text={textButton1} type={typeButton1} onClick={onClose} />
                            <ButtonComponent text={textButton2} type={typeButton2} onClick={onClick} />
                        </div>
                    </div>
                </div>
            }

        </div>
    )
}