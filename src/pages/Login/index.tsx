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
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                <path className={styles.wave2} fill="#063474" fill-opacity="1" d="M0,64L20,74.7C40,85,80,107,120,101.3C160,96,200,64,240,74.7C280,85,320,139,360,154.7C400,171,440,149,480,128C520,107,560,85,600,69.3C640,53,680,43,720,53.3C760,64,800,96,840,122.7C880,149,920,171,960,160C1000,149,1040,107,1080,101.3C1120,96,1160,128,1200,133.3C1240,139,1280,117,1320,106.7C1360,96,1400,96,1420,96L1440,96L1440,320L1420,320C1400,320,1360,320,1320,320C1280,320,1240,320,1200,320C1160,320,1120,320,1080,320C1040,320,1000,320,960,320C920,320,880,320,840,320C800,320,760,320,720,320C680,320,640,320,600,320C560,320,520,320,480,320C440,320,400,320,360,320C320,320,280,320,240,320C200,320,160,320,120,320C80,320,40,320,20,320L0,320Z"></path>
                <path className={styles.wave1} fill="#4cc5eb" fill-opacity="1" d="M0,256L26.7,261.3C53.3,267,107,277,160,261.3C213.3,245,267,203,320,170.7C373.3,139,427,117,480,101.3C533.3,85,587,75,640,96C693.3,117,747,171,800,186.7C853.3,203,907,181,960,154.7C1013.3,128,1067,96,1120,74.7C1173.3,53,1227,43,1280,64C1333.3,85,1387,139,1413,165.3L1440,192L1440,320L1413.3,320C1386.7,320,1333,320,1280,320C1226.7,320,1173,320,1120,320C1066.7,320,1013,320,960,320C906.7,320,853,320,800,320C746.7,320,693,320,640,320C586.7,320,533,320,480,320C426.7,320,373,320,320,320C266.7,320,213,320,160,320C106.7,320,53,320,27,320L0,320Z"></path>
                <path className={styles.wave3} fill="#0099ff" fill-opacity="1" d="M0,96L26.7,80C53.3,64,107,32,160,69.3C213.3,107,267,213,320,250.7C373.3,288,427,256,480,229.3C533.3,203,587,181,640,149.3C693.3,117,747,75,800,85.3C853.3,96,907,160,960,186.7C1013.3,213,1067,203,1120,170.7C1173.3,139,1227,85,1280,69.3C1333.3,53,1387,75,1413,85.3L1440,96L1440,320L1413.3,320C1386.7,320,1333,320,1280,320C1226.7,320,1173,320,1120,320C1066.7,320,1013,320,960,320C906.7,320,853,320,800,320C746.7,320,693,320,640,320C586.7,320,533,320,480,320C426.7,320,373,320,320,320C266.7,320,213,320,160,320C106.7,320,53,320,27,320L0,320Z"></path>
            </svg>
        </div>
    )
}