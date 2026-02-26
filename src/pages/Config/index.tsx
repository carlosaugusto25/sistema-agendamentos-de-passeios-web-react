import { useCallback, useEffect, useState } from "react";
import { Header } from "../../components/Header";
import styles from './config.module.scss';
import { AdditionalProps, GetBoatProps } from "../../@types/interfaces/types";
import { api } from "../../service/api";
import { FaEdit } from "react-icons/fa";
import { LoadingBoatGet } from "../../components/LoadingBoatGet";
import { Modal } from "../../components/Modal";
import { Input } from "../../components/Input";
import { ChromePicker } from 'react-color';
import { toast } from "react-toastify";
import { ButtonComponent } from "../../components/ButtonComponent";

export function Config() {



    const [nameBoat, setNameBoat] = useState('');
    const [idBoat, setIdBoat] = useState('');
    const [colorBoat, setColorBoat] = useState({ background: '#000000' });
    const [capacityBoat, setCapacityBoat] = useState('');

    const [idAdditional, setIdAdditional] = useState('');
    const [nameAdditional, setNameAdditional] = useState('');
    const [valueAdditional, setValueAdditional] = useState('');

    const [dashBoat, setDashBoat] = useState<GetBoatProps[]>([]);
    const [additionals, setAdditionals] = useState<AdditionalProps[]>([])

    const [loadingBoat, setLoadingBoat] = useState(false);
    const [loadingAdditionals, setLoadingAdditionals] = useState(false);
    const [loadingEditBoat, setLoadingEditBoat] = useState(false);
    const [loadingAddBoat, setLoadingAddBoat] = useState(false);
    const [loadingEditAdditional, setLoadingEditAdditional] = useState(false);
    const [loadingAddAdditional, setLoadingAddAdditional] = useState(false);


    const [modalEditBoat, setModalEditBoat] = useState(false);
    const [modalAddBoat, setModalAddBoat] = useState(false);
    const [modalEditAdditional, setModalEditAdditional] = useState(false);
    const [modalAddAdditional, setModalAddAdditional] = useState(false);

    const [screenSize, setScreenSize] = useState({ width: window.innerWidth, height: window.innerHeight });

    const updateScreenSize = () => {
        setScreenSize({ width: window.innerWidth, height: window.innerHeight });
    };

    const loadBoats = useCallback(async () => {
        setLoadingBoat(true)
        await api.get('/speedboats').then((response) => {
            setDashBoat(response.data);
            // setBoatSelected(response.data[0].id);
        }).catch(error => console.log(error)).finally(() => setLoadingBoat(false))
    }, [])

    const loadAdditionals = useCallback(async () => {
        setLoadingAdditionals(true)
        api.get('/menu').then((response) => {
            setAdditionals(response.data)
        }).catch(error => console.log(error)).finally(() => setLoadingAdditionals(false))
    }, [])

    useEffect(() => {
        loadBoats();
        loadAdditionals();

        window.addEventListener('resize', updateScreenSize);

        return () => {
            window.removeEventListener('resize', updateScreenSize);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    const handleGetEditBoat = useCallback(async (id: string) => {
        setLoadingEditBoat(true)
        await api.get(`/speedboats/${id}`).then((response) => {
            setNameBoat(response.data.name)
            setIdBoat(response.data.id)
            setColorBoat(response.data.color !== null ? { background: response.data.color } : { background: '#000000' })
            setCapacityBoat(response.data.max_people.toString())
            setModalEditBoat(true)
        }).catch(error => console.log(error)).finally(() => setLoadingEditBoat(false))
    }, [])

    const deleteInfoBoat = useCallback(() => {
        setIdBoat('')
        setNameBoat('')
        setColorBoat({ background: '#000000' })
        setCapacityBoat('')
    }, [])

    const handleEditBoat = useCallback(async () => {
        setLoadingEditBoat(true)
        await api.put(`/speedboats`, {
            id: idBoat,
            name: nameBoat,
            color: colorBoat.background,
            max_people: Number(capacityBoat)
        }).then(() => {
            setModalEditBoat(false)
            loadBoats()
            deleteInfoBoat()
            toast.success('Lancha editado com sucesso!')
        }).catch(error => {
            console.log(error)
            toast.error('Erro ao editar lancha!')
        }).finally(() => setLoadingEditBoat(false))
    }, [idBoat, nameBoat, colorBoat, capacityBoat, loadBoats, deleteInfoBoat])

    const handleGetEditAdditional = useCallback(async (id: string) => {
        setLoadingEditAdditional(true)
        await api.get(`/menu/${id}`).then((response) => {
            setIdAdditional(response.data.id);
            setNameAdditional(response.data.name);
            setValueAdditional(`${Number(response.data.value) / 100}`);
            setModalEditAdditional(true);
        }).catch(error => console.log(error)).finally(() => setLoadingEditAdditional(false))
    }, [])

    const deleteInfoAdditional = useCallback(() => {
        setIdAdditional('')
        setNameAdditional('')
        setValueAdditional('')
    }, [])

    const handleEditAdditional = useCallback(async () => {
        setLoadingEditAdditional(true)
        await api.put(`/menu`, {
            id: idAdditional,
            name: nameAdditional,
            value: Number(valueAdditional) * 100
        }).then(() => {
            setModalEditAdditional(false)
            deleteInfoAdditional()
            loadAdditionals()
            toast.success('Adicional editado com sucesso!')
        }).catch(error => {
            console.log(error)
            toast.error('Erro ao editar adicional!')
        }).finally(() => setLoadingEditAdditional(false))
    }, [idAdditional, nameAdditional, valueAdditional, loadAdditionals, deleteInfoAdditional])

    const handleAddBoat = useCallback(async () => {
        if (nameBoat === '' || capacityBoat === '') {
            return toast.error('Preencha todos os campos para adicionar uma lancha!')
        }
        setLoadingAddBoat(true)
        await api.post('/speedboats', {
            name: nameBoat,
            color: colorBoat.background,
            max_people: Number(capacityBoat)
        }).then(() => {
            toast.success('Lancha adicionada com sucesso!')
            loadBoats()
            deleteInfoBoat()
        }).catch(error => {
            console.log(error)
            toast.error('Erro ao adicionar lancha!')
        }).finally(() => setLoadingAddBoat(false))
    }, [nameBoat, colorBoat, capacityBoat, loadBoats, deleteInfoBoat])

    const handleAddAdditional = useCallback(async () => {
        if (nameAdditional === '' || valueAdditional === '') {
            return toast.error('Preencha todos os campos para adicionar um adicional!')
        }
        setLoadingAddAdditional(true)
        await api.post('/menu', {
            name: nameAdditional,
            value: Number(valueAdditional) * 100
        }).then(() => {
            toast.success('Adicional adicionado com sucesso!')
            loadAdditionals()
            deleteInfoAdditional()
        }).catch(error => {
            console.log(error)
            toast.error('Erro ao adicionar adicional!')
        }).finally(() => setLoadingAddAdditional(false))

    }, [nameAdditional, valueAdditional, loadAdditionals, deleteInfoAdditional])



    return (
        <>
            <Header />
            {
                (loadingBoat && loadingAdditionals) ? <LoadingBoatGet /> :
                    <>
                        <div className={styles.container}>
                            <h1>Configurações</h1>
                            <div>

                                <div className={styles.content}>
                                    <div className={styles.contentCards}>


                                        <div className={styles.grid}>
                                            <div className={styles.contentGrid}>
                                                <p className={styles.title}>Adicionais</p>
                                                {
                                                    additionals.map((additional) => (
                                                        <div key={additional.id} className={styles.gridItem}>
                                                            <p className={styles.info} >{additional.name}</p>
                                                            <FaEdit className={styles.edit} onClick={() => handleGetEditAdditional(additional.id)} />
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                            <ButtonComponent text="Adicionar" type="create" onClick={() => setModalAddAdditional(true)} />
                                        </div>
                                        <div className={styles.grid}>
                                            <div className={styles.contentGrid}>
                                                <p className={styles.title}>Embarcações</p>
                                                {
                                                    dashBoat.map((boat) => (
                                                        <div key={boat.id} className={styles.gridItem}>
                                                            <p className={styles.info} >{boat.name}</p>
                                                            <FaEdit className={styles.edit} onClick={() => handleGetEditBoat(boat.id)} />
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                            <ButtonComponent text="Adicionar" type="create" onClick={() => setModalAddBoat(true)} />
                                        </div>

                                    </div>

                                </div>
                            </div>

                        </div>
                        {
                            modalEditBoat &&
                            <Modal
                                onClose={() => { setModalEditBoat(false); deleteInfoBoat() }}
                                title="Editar embarcação"
                                textButton1="Cancelar"
                                typeButton1="cancel"
                                onClick={handleEditBoat}
                                textButton2="Confirmar"
                                typeButton2="create"
                                loading={loadingEditBoat}
                            >
                                <div className={styles.modalContentEditBoat}>
                                    <div>
                                        <p className={styles.label}>Nome</p>
                                        <Input value={nameBoat} onChange={(event) => setNameBoat(event.target.value)} placeholder="Nome" />
                                    </div>
                                    <div>
                                        <p className={styles.label}>Capacidade</p>
                                        <Input value={capacityBoat} type="number" onChange={(event) => setCapacityBoat(event.target.value)} placeholder="Capacidade" />
                                    </div>
                                    <div >
                                        <p className={styles.label}>Cor</p>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                            <ChromePicker color={colorBoat.background} onChangeComplete={(event) => setColorBoat({ background: event.hex })} styles={{ default: { picker: { width: screenSize.width > 1366 ? '100%' : (screenSize.width <= 600 ? '100%' : '60%') } } }} />
                                        </div>
                                    </div>
                                </div>
                            </Modal>
                        }
                        {
                            modalEditAdditional &&
                            <Modal
                                onClose={() => { setModalEditAdditional(false); deleteInfoAdditional() }}
                                title="Editar adicional"
                                textButton1="Cancelar"
                                typeButton1="cancel"
                                onClick={handleEditAdditional}
                                textButton2="Confirmar"
                                typeButton2="create"
                                loading={loadingEditAdditional}
                            >
                                <div className={styles.modalContentEditAdditional}>
                                    <div>
                                        <p className={styles.label}>Nome</p>
                                        <Input value={nameAdditional} onChange={(event) => setNameAdditional(event.target.value)} placeholder="Nome" />
                                    </div>
                                    <div>
                                        <p className={styles.label}>Preço</p>
                                        <Input value={valueAdditional} type="number" onChange={(event) => setValueAdditional(event.target.value)} placeholder="Preço" />
                                    </div>
                                </div>
                            </Modal>
                        }
                        {
                            modalAddBoat &&
                            <Modal
                                onClose={() => { setModalAddBoat(false); deleteInfoBoat() }}
                                title="Adicionar embarcação"
                                textButton1="Cancelar"
                                typeButton1="cancel"
                                onClick={handleAddBoat}
                                textButton2="Confirmar"
                                typeButton2="create"
                                loading={loadingAddBoat}
                            >
                                <div className={styles.modalContentAddBoat}>
                                    <div>
                                        <p className={styles.label}>Nome</p>
                                        <Input value={nameBoat} onChange={(event) => setNameBoat(event.target.value)} placeholder="Nome" />
                                    </div>
                                    <div>
                                        <p className={styles.label}>Capacidade</p>
                                        <Input value={capacityBoat} type="number" onChange={(event) => setCapacityBoat(event.target.value)} placeholder="Capacidade" />
                                    </div>
                                    <div >
                                        <p className={styles.label}>Cor</p>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                            <ChromePicker color={colorBoat.background} onChangeComplete={(event) => setColorBoat({ background: event.hex })} styles={{ default: { picker: { width: screenSize.width > 1366 ? '100%' : (screenSize.width <= 600 ? '100%' : '60%') } } }} />
                                        </div>
                                    </div>
                                </div>
                            </Modal>
                        }
                        {
                            modalAddAdditional &&
                            <Modal
                                onClose={() => { setModalAddAdditional(false); deleteInfoAdditional() }}
                                title="Criar adicional"
                                textButton1="Cancelar"
                                typeButton1="cancel"
                                onClick={handleAddAdditional}
                                textButton2="Confirmar"
                                typeButton2="create"
                                loading={loadingAddAdditional}
                            >
                                <div className={styles.modalContentEditAdditional}>
                                    <div>
                                        <p className={styles.label}>Nome</p>
                                        <Input value={nameAdditional} onChange={(event) => setNameAdditional(event.target.value)} placeholder="Nome" />
                                    </div>
                                    <div>
                                        <p className={styles.label}>Preço</p>
                                        <Input value={valueAdditional} type="number" onChange={(event) => setValueAdditional(event.target.value)} placeholder="Preço" />
                                    </div>
                                </div>
                            </Modal>
                        }
                    </>
            }
        </>
    )
}