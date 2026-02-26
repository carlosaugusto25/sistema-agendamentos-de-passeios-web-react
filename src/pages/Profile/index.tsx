import { useCallback, useEffect, useState } from "react";
import { Header } from "../../components/Header";
import { useAuth } from "../../context/auth";
import styles from './profile.module.scss'
import { Input } from '../../components/Input';
import { ButtonComponent } from '../../components/ButtonComponent';
import { api } from "../../service/api";
import { UserProps } from "../../@types/interfaces/types";
import { toast } from "react-toastify";
import { maskPhone } from "../../utils/masks";

export function Profile() {

    const { user } = useAuth();
    const [userInfos, setUserInfos] = useState<UserProps>({} as UserProps)

    const [oldPass, setOldPass] = useState('');
    const [newPass, setNewPass] = useState('');

    const getInfoUser = () => {
        api.get(`/users/${user?.id}`).then(response => {
            setUserInfos(response.data);
        }).catch(error => console.log(error)).finally(() => { })
    }

    useEffect(() => {
        getInfoUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const updatePass = useCallback(() => {
        api.patch('/users/update-pass', {
            id: user?.id,
            old_password: oldPass,
            new_password: newPass
        }).then(response => {
            console.log(response.data)
            toast.success('Senha atualizada com sucesso');
        }).catch(error => {
            toast.error('Erro ao atualizar a senha');
            console.log('Erro ao atualizar a senha:', error);
        }).finally(() => {

        })
    }, [user, oldPass, newPass]);

    const userTypeLabel = (() => {
        const t = userInfos?.user_type;
        if (!t) return '—';
        switch (t) {
            case 'ADMIN':
                return 'Administrador';
            case 'SUPERADMIN':
                return 'Super Administrador';
            case 'USER':
                return 'Usuário';
            default:
                return t;
        }
    })();


    return (
        <>
            <Header />
            <div className={styles.container}>
                <h1>Perfil</h1>
                <div className={styles.content}>
                    <div className={styles.field}>
                        <div className={styles.label}>Nome</div>
                        <div className={styles.value}>{userInfos?.name || '—'}</div>
                    </div>

                    <div className={styles.field}>
                        <div className={styles.label}>Sobrenome</div>
                        <div className={styles.value}>{userInfos?.last_name || '—'}</div>
                    </div>

                    <div className={styles.field}>
                        <div className={styles.label}>E-mail</div>
                        <div className={styles.value}>{userInfos?.email || '—'}</div>
                    </div>

                    <div className={styles.field}>
                        <div className={styles.label}>Telefone</div>
                        <div className={styles.value}>{userInfos?.phone ? maskPhone(userInfos?.phone) : '—'}</div>
                    </div>

                    <div className={styles.field}>
                        <div className={styles.label}>Tipo de usuário</div>
                        <div className={styles.value}>{userTypeLabel}</div>
                    </div>

                    <div className={styles.field}>
                        <div className={styles.label}>Criado em</div>
                        <div className={styles.value}>{userInfos?.created_at ? new Date(userInfos.created_at).toLocaleString('pt-BR') : '—'}</div>
                    </div>

                    <div className={styles.field}>
                        <div className={styles.label}>Atualizado em</div>
                        <div className={styles.value}>{userInfos?.updated_at ? new Date(userInfos.updated_at).toLocaleString('pt-BR') : '—'}</div>
                    </div>
                </div>
                <h1>Alterar senha</h1>
                <div className={styles.passRow}>
                    <Input placeholder="Senha antiga" type="password" value={oldPass} onChange={(e) => setOldPass(e.target.value)} />
                    <Input placeholder="Nova senha" type="password" value={newPass} onChange={(e) => setNewPass(e.target.value)} />
                    <div className={styles.passButton}>
                        <ButtonComponent onClick={updatePass} text="Atualizar senha" type="create" />
                    </div>
                </div>
            </div>
        </>
    )
}