import { useCallback, useEffect, useState } from "react";
import { GetBoatProps } from "../../@types/interfaces/types";
import { api } from "../../service/api";
import styles from './selectionBoat.module.scss';

interface SelectionBoatProps {
    setBoatSelected: (boatSelected: string) => void;
}

export function SelectionBoat({ setBoatSelected }: SelectionBoatProps){
    
    const [boats, setBoats] = useState<GetBoatProps[]>([]);
    // const [boat, setBoat] = useState<GetBoatProps>({} as GetBoatProps);

    const getBoat = useCallback(async () => {
        await api.get('/speedboats').then((response) => {
            setBoats(response.data);
            // setBoat(response.data[0]);
            setBoatSelected(response.data[0].id);
        }).catch(error=>console.log(error));
    },[])

    useEffect(() => {
        getBoat();
    }, []);
    
    return(
        <select className={styles.container} onChange={(event) => setBoatSelected(event.target.value)}>
            {
                boats.map(boat => (
                    <option key={boat.id} value={boat.id} >{boat.name}</option>
                ))
            }
        </select>
    )
}