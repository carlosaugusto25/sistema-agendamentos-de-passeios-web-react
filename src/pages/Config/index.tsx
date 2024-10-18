import { useCallback, useEffect, useMemo, useState } from "react";
import { Header } from "../../components/Header";
import styles from './config.module.scss';
import { AdditionalProps, GetAppointmentsProps, GetBoatProps } from "../../@types/interfaces/types";
import { api } from "../../service/api";
import { FaEdit } from "react-icons/fa";
import { LoadingBoatGet } from "../../components/LoadingBoatGet";
import { Modal } from "../../components/Modal";
import { Input } from "../../components/Input";
import { ChromePicker } from 'react-color';
import { toast } from "react-toastify";
import { ButtonComponent } from "../../components/ButtonComponent";
import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";

export function Config() {

    const months = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']
    const years = ['2024', '2025', '2026', '2027', '2028', '2029', '2030']

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const monthsChart = [
        { value: 0, name: 'jan' },
        { value: 1, name: 'fev' },
        { value: 2, name: 'mar' },
        { value: 3, name: 'abr' },
        { value: 4, name: 'mai' },
        { value: 5, name: 'jun' },
        { value: 6, name: 'jul' },
        { value: 7, name: 'ago' },
        { value: 8, name: 'set' },
        { value: 9, name: 'out' },
        { value: 10, name: 'nov' },
        { value: 11, name: 'dez' },
    ]

    const [dateActual, setDateActual] = useState<Date>(new Date());

    const [month, setMonth] = useState(dateActual.getMonth());
    const [year, setYear] = useState(dateActual.getFullYear());
    const [boatSelected, setBoatSelected] = useState('');

    const [nameBoat, setNameBoat] = useState('');
    const [idBoat, setIdBoat] = useState('');
    const [colorBoat, setColorBoat] = useState({ background: '#000000' });
    const [capacityBoat, setCapacityBoat] = useState('');

    const [idAdditional, setIdAdditional] = useState('');
    const [nameAdditional, setNameAdditional] = useState('');
    const [valueAdditional, setValueAdditional] = useState('');

    const [dashBoat, setDashBoat] = useState<GetBoatProps[]>([]);
    const [dashAppointmet, setDashAppointmet] = useState<GetAppointmentsProps[]>([]);
    const [additionals, setAdditionals] = useState<AdditionalProps[]>([])

    const [loadingBoat, setLoadingBoat] = useState(false);
    const [loadingAppointments, setLoadingAppointments] = useState(false);
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
        await api.get('').then((response) => {
            setDashBoat(response.data);
            setBoatSelected(response.data[0].id);
        }).catch(error => console.log(error)).finally(() => setLoadingBoat(false))
    }, [])

    const loadDashAppointments = useCallback(async () => {
        setLoadingAppointments(true)
        await api.get('').then((response) => {
            setDashAppointmet(response.data);
        }).catch(error => console.log(error)).finally(() => setLoadingAppointments(false))
    }, [])

    const loadAdditionals = useCallback(async () => {
        setLoadingAdditionals(true)
        api.get('').then((response) => {
            setAdditionals(response.data)
        }).catch(error => console.log(error)).finally(() => setLoadingAdditionals(false))
    }, [])

    useEffect(() => {
        loadBoats();
        loadDashAppointments();
        loadAdditionals();
        setDateActual(new Date());

        window.addEventListener('resize', updateScreenSize);

        return () => {
            window.removeEventListener('resize', updateScreenSize);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const quantityAppointments = useMemo(() => {
        return dashAppointmet.filter(appointment => appointment.speedboat_id === boatSelected && Number(appointment.date.split('-')[0]) === year && Number(new Date(appointment.date).getMonth()) === month)
    }, [dashAppointmet, boatSelected, month, year])

    const totalValueAppointments = useMemo(() => {
        let val = 0
        quantityAppointments.map((appointment) => {
            if (appointment.speedboat_id === boatSelected && Number(appointment.date.split('-')[0]) === year && Number(new Date(appointment.date).getMonth()) === month) {
                val += appointment.total_value
            }
        })
        return val
    }, [quantityAppointments, boatSelected, month, year])

    const handleGetEditBoat = useCallback(async (id: string) => {
        setLoadingEditBoat(true)
        await api.get(``).then((response) => {
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
        await api.put(``, {
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
        await api.get(``).then((response) => {
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
        await api.put(``, {
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
        await api.post('', {
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

    const dataChart = useMemo(() => {
        return monthsChart.map(month => {
            let calc = 0
            let val = 0
            dashAppointmet.map(app => {
                if (Number(app.date.split('-')[1]) === month.value + 1 && Number(app.date.split('-')[0]) === year && app.speedboat_id === dashBoat[0]?.id) {
                    calc += 1
                } else if (Number(app.date.split('-')[1]) === month.value + 1 && Number(app.date.split('-')[0]) === year) {
                    val += 1
                }
            })
            return {
                name: month.name,
                SeaFox: calc,
                Urbana: val
            }
        })
    }, [dashAppointmet, year, monthsChart, dashBoat])

    return (
        <>
            <Header />
            {
                (loadingAppointments && loadingBoat && loadingAdditionals) ? <LoadingBoatGet /> :
                    <>
                        <div className={styles.container}>
                            <h1>Configurações</h1>
                            <div>
                                <div className={styles.contentSelections}>
                                    <div className={styles.labelAndselections}>
                                        <p>Mês</p>
                                        <select value={month} onChange={(event) => setMonth(Number(event.target.value))} className={styles.selection}>
                                            <option value="">Mês</option>
                                            {
                                                months.map((month, index) => (
                                                    <option key={month} value={index}>{month}</option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                    <div className={styles.labelAndselections}>
                                        <p>Ano</p>
                                        <select value={year} onChange={(event) => setYear(Number(event.target.value))} className={styles.selection}>
                                            <option value="">Ano</option>
                                            {
                                                years.map((year) => (
                                                    <option key={year} value={year}>{year}</option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                    <div className={styles.labelAndselections}>
                                        <p>Embarcação</p>
                                        <select value={boatSelected} onChange={(event) => setBoatSelected(event.target.value)} className={styles.selectionBoat}>
                                            <option value="">Embarcação</option>
                                            {
                                                dashBoat.map((boat) => (
                                                    <option key={boat.id} value={boat.id}>{boat.name}</option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                </div>
                                <div className={styles.content}>
                                    <div className={styles.contentCards}>
                                        <div className={styles.card}>
                                            <p className={styles.cardTitle}>Total de agendamentos</p>
                                            <p className={styles.cardValue}>{quantityAppointments?.length}</p>
                                        </div>
                                        <div className={styles.card}>
                                            <p className={styles.cardTitle}>Faturamento total</p>
                                            <p className={styles.cardValue}>{new Intl.NumberFormat('pt-BR', {
                                                style: 'currency',
                                                currency: 'BRL'
                                            }).format(totalValueAppointments / 100)}</p>
                                        </div>

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
                                    <div className={styles.contentChart}>
                                        <LineChart margin={screenSize.width > 1366 ? { top: 0, right: 20, left: -30, bottom: 0 } : { top: 0, right: 20, left: -20, bottom: 0 }} className={styles.chart} width={screenSize.width > 1366 ? 900 : 600} height={screenSize.width > 1366 ? 650 : 400} data={dataChart}>
                                            <Line type="monotone" dataKey="SeaFox" stroke={dashBoat[0]?.color ? dashBoat[0]?.color : 'red'} />
                                            <Line type="monotone" dataKey="Urbana" stroke={dashBoat[1]?.color ? dashBoat[1]?.color : 'blue'} />
                                            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Legend />
                                            <Tooltip />
                                        </LineChart>
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
                                            <ChromePicker color={colorBoat.background} onChangeComplete={(event) => setColorBoat({ background: event.hex })} styles={{ default: { picker: { width: screenSize.width > 1366 ? '100%' : '60%' } } }} />
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
                                            <ChromePicker color={colorBoat.background} onChangeComplete={(event) => setColorBoat({ background: event.hex })} styles={{ default: { picker: { width: screenSize.width > 1366 ? '100%' : '60%' } } }} />
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