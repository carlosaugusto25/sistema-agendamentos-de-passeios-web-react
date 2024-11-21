import { useCallback, useEffect, useState } from 'react';
import styles from './selectBoat.module.scss';
import { GetBoatProps } from '../../@types/interfaces/types';
import { api } from '../../service/api';

interface SelectBoatProps extends React.SelectHTMLAttributes<HTMLSelectElement>{
    setBoatSelected: (id: string) => void;
    speedboat?: string;
}

export function SelectBoat({speedboat, setBoatSelected, ...rest}: SelectBoatProps){
    
    const [boats, setBoats] = useState<GetBoatProps[]>([]);
    // const [boatName, setBoatName] = useState('');

    const getBoat = useCallback(async () => {
        await api.get('/speedboats').then((response) => {
            setBoats(response.data);
            // setBoat(response.data[0]);
            // setBoatSelected(response.data[0].id);
        }).catch(error=>console.log(JSON.stringify(error, null, 2)));
    },[])

    useEffect(() => {
        getBoat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    
    
    return(
        <select {...rest} value={speedboat} onChange={(event) => setBoatSelected(event.target.value)} className={styles.select}>
            <option className={styles.option} value="" >Embarcação</option>
            {
                boats.map(boat => (
                    <option key={boat.id} value={boat.id} >{boat.name}</option>
                ))
            }
        </select>
    )
}