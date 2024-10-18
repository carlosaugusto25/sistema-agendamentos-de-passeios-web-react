import styles from './login.module.scss';
import bg from '../../assets/logo-wendell.png';
import { useAuth } from '../../context/auth';
import { useState } from 'react';
import { IoMdEye, IoMdEyeOff } from "react-icons/io";

export function Login() {
    
    const { login, loading } = useAuth()

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [show, setShow] = useState(false)
    
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <img src={bg} alt="Logo-Wendell-Passeios" />
                <p>LOGIN</p>
                <div className={styles.form}>
                    <input className={styles.email} placeholder='E-mail' type="email" name="email"  value={email} onChange={(e) => setEmail(e.target.value)} />
                    <div className={styles.inputAndIcon}>
                        <input className={styles.password} placeholder='Senha' type={show ? 'text' : 'password'} name="password"  value={password} onChange={(e) => setPassword(e.target.value)} />
                        {
                            show ?
                            <IoMdEye size={22} onClick={() => setShow(!show)} style={{cursor: 'pointer'}} />
                            :
                            <IoMdEyeOff size={22} onClick={() => setShow(!show)} style={{cursor: 'pointer'}} />
                        }
                    </div>
                    <button onClick={()=>login({email, password})}>{loading ? 'Carregando...' : 'Entrar'}</button>
                </div>
            </div>
        </div>
    )
}