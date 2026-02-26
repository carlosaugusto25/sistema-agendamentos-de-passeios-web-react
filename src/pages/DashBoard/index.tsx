import { useCallback, useEffect, useMemo, useState } from "react";
import { Header } from "../../components/Header";
import styles from './dashboard.module.scss';
import { Client, DashProps, GetBoatProps, GetAppointmentsProps, GetClientProps } from "../../@types/interfaces/types";
import { api } from "../../service/api";
import { LoadingBoatGet } from "../../components/LoadingBoatGet";
// import { Modal } from "../../components/Modal";
// import { Input } from "../../components/Input";
// import { ChromePicker } from 'react-color';
// import { toast } from "react-toastify";
// import { ButtonComponent } from "../../components/ButtonComponent";
import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";
import { toast } from "react-toastify";
import { useAuth } from "../../context/auth";

export function DashBoard() {

    const { user } = useAuth();
    const userType = user?.user_type;

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

    const [clients, setClients] = useState<Client[]>([]);


    const [dashBoat, setDashBoat] = useState<GetBoatProps[]>([]);
    const [dashAppointmet, setDashAppointmet] = useState<DashProps>({} as DashProps);

    const [loadingBoat, setLoadingBoat] = useState(false);
    const [loadingAppointments, setLoadingAppointments] = useState(false);
    const [loadingClients, setLoadingClients] = useState(false);

    const [screenSize, setScreenSize] = useState({ width: window.innerWidth, height: window.innerHeight });

    const updateScreenSize = () => {
        setScreenSize({ width: window.innerWidth, height: window.innerHeight });
    };

    const loadBoats = useCallback(async () => {
        setLoadingBoat(true)
        await api.get('/speedboats').then((response) => {
            setDashBoat(response.data);
            setBoatSelected(response.data[0].id);
        }).catch(error => console.log(error)).finally(() => setLoadingBoat(false))
    }, [])

    const getClients = useCallback(() => {
        setLoadingClients(true);
        api.get('/clients').then(response => {
            const data = response.data as GetClientProps | Client[];
            // API may return either an array or an object with a `clients` array
            if (Array.isArray(data)) {
                setClients(data);
            } else if (data && Array.isArray((data as GetClientProps).clients)) {
                setClients((data as GetClientProps).clients as Client[]);
            } else {
                setClients([]);
            }
        }).catch(error => {
            console.error('Error fetching clients:', error);
            toast.error('Falha ao carregar lista de clientes');
        }).finally(() => {
            setLoadingClients(false);
        });
    }, []);

    const loadDashAppointments = useCallback(async () => {
        setLoadingAppointments(true)
        await api.get('/dash').then((response) => {
            setDashAppointmet(response.data);
        }).catch(error => console.log(error)).finally(() => setLoadingAppointments(false))
    }, [])


    useEffect(() => {
        loadBoats();
        getClients();
        loadDashAppointments();
        setDateActual(new Date());

        window.addEventListener('resize', updateScreenSize);

        return () => {
            window.removeEventListener('resize', updateScreenSize);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const quantityAppointments = useMemo(() => {
        const apps = (dashAppointmet?.appointments ?? []) as unknown as GetAppointmentsProps[];
        return apps.filter((appointment) => appointment.speedboat_id === boatSelected && Number(appointment.date.split('-')[0]) === year && new Date(appointment.date).getMonth() === month);
    }, [dashAppointmet, boatSelected, month, year])

    const totalValueAppointments = useMemo(() => {
        let val = 0
        dashAppointmet?.appointments?.map((appointment) => {
            val += appointment.total_value
        })
        return val
    }, [dashAppointmet])

    const latestClients = useMemo(() => {
        return [...clients]
            .sort((a, b) => {
                const da = new Date(a.created_at || a.updated_at || 0).getTime();
                const db = new Date(b.created_at || b.updated_at || 0).getTime();
                return db - da;
            })
            .slice(0, 10);
    }, [clients]);

    const latestAppointments = useMemo(() => {
        const apps = (dashAppointmet?.appointments ?? []) as unknown as GetAppointmentsProps[];
        return [...apps]
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, 3);
    }, [dashAppointmet]);

    const totalValueAppointmentsSelect = useMemo(() => {
        let val = 0;
        const apps = (dashAppointmet?.appointments ?? []) as unknown as GetAppointmentsProps[];
        apps.forEach((appointment) => {
            if (appointment.speedboat_id === boatSelected && Number(appointment.date.split('-')[0]) === year && new Date(appointment.date).getMonth() === month) {
                val += appointment.total_value;
            }
        });
        return val;
    }, [dashAppointmet, boatSelected, month, year])


    const dataChart = useMemo(() => {
        return monthsChart.map(month => {
            let calc = 0
            let val = 0
            dashAppointmet?.appointments?.map(app => {
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

    if (userType === 'USER') {
        return (
            <>
                <Header />
                <div className={styles.container}>
                    <h1>Dashboard</h1>
                    <p>Conteúdo disponível apenas para Administradores ou Super Administradores</p>
                </div>
            </>
        )
    }

    return (
        <>
            <Header />
            {
                (loadingAppointments && loadingBoat && loadingClients) ? <LoadingBoatGet /> :
                    <>
                        <div className={styles.container}>
                            <h1>Dashboard</h1>
                            <div>
                                <div className={styles.content}>
                                    <div className={styles.contentCards}>
                                        <div className={styles.card}>
                                            <p className={styles.cardTitle}>Total de agendamentos</p>
                                            <p className={styles.cardValue}>{dashAppointmet?.total_appointments ? dashAppointmet.total_appointments : 0}</p>
                                        </div>
                                        <div className={styles.card}>
                                            <p className={styles.cardTitle}>Faturamento total</p>
                                            <p className={styles.cardValue}>{new Intl.NumberFormat('pt-BR', {
                                                style: 'currency',
                                                currency: 'BRL'
                                            }).format(totalValueAppointments / 100)}</p>
                                        </div>
                                    </div>
                                </div>
                                <h1>Filtro</h1>
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
                                            <p className={styles.cardValue}>{quantityAppointments ? quantityAppointments.length : 0}</p>
                                        </div>
                                        <div className={styles.card}>
                                            <p className={styles.cardTitle}>Faturamento total</p>
                                            <p className={styles.cardValue}>{new Intl.NumberFormat('pt-BR', {
                                                style: 'currency',
                                                currency: 'BRL'
                                            }).format(totalValueAppointmentsSelect / 100)}</p>
                                        </div>

                                        <div className={styles.grid}>
                                            <div className={styles.contentGrid}>
                                                <p className={styles.title}>Últimos clientes cadastrados</p>
                                                {
                                                    loadingClients ? (
                                                        <p>Carregando...</p>
                                                    ) : (
                                                        latestClients.length === 0 ? (
                                                            <p>Nenhum cliente cadastrado</p>
                                                        ) : (
                                                            latestClients.map((client) => (
                                                                <div key={client.id} className={styles.gridItem}>
                                                                    <div className={styles.info}>
                                                                        <span className={styles.clientName}>{client.name}</span>
                                                                    </div>
                                                                    <div className={styles.clientDate}>{client.created_at ? new Date(client.created_at).toLocaleDateString('pt-BR') : client.updated_at ? new Date(client.updated_at).toLocaleDateString('pt-BR') : '—'}</div>
                                                                </div>
                                                            ))
                                                        )
                                                    )
                                                }
                                            </div>
                                        </div>
                                        <div className={styles.grid}>
                                            <div className={styles.contentGrid}>
                                                <p className={styles.title}>Últimos agendamentos por usuários</p>
                                                {
                                                    loadingAppointments ? (
                                                        <p>Carregando...</p>
                                                    ) : (
                                                        latestAppointments.length === 0 ? (
                                                            <p>Nenhum agendamento</p>
                                                        ) : (
                                                            latestAppointments.map((app: GetAppointmentsProps) => {
                                                                const clientName = app.client?.name || clients.find(c => c.id === app.client_id)?.name || '—';
                                                                const appointmentDate = app.date ? new Date(app.date).toLocaleDateString('pt-BR') : '—';
                                                                const createdAt = app.created_at ? new Date(app.created_at).toLocaleString('pt-BR') : '—';
                                                                const boatName = app.speedboat?.name || dashBoat.find(b => b.id === app.speedboat_id)?.name || '—';
                                                                const userName = app.user?.name || app.user?.email || '—';

                                                                return (
                                                                    <div key={app.id} className={styles.appointmentItem}>
                                                                        <div className={styles.appointmentMain}>
                                                                            <span className={styles.appointmentClient}>{clientName}</span>
                                                                            <span className={styles.appointmentDate}>{appointmentDate}</span>
                                                                        </div>
                                                                        <div className={styles.appointmentMeta}>
                                                                            <span>Agendado em: {createdAt}</span>
                                                                            <span>Lancha: {boatName}</span>
                                                                            <span>Usuário: {userName}</span>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })
                                                        )
                                                    )
                                                }
                                            </div>
                                        </div>

                                    </div>
                                    <div className={styles.contentChart}>
                                        <LineChart margin={screenSize.width > 1366 ? { top: 0, right: 20, left: -30, bottom: 0 } : (screenSize.width <= 600 ? { top: 0, right: 5, left: -25, bottom: 0 } : { top: 0, right: 20, left: -20, bottom: 0 })} className={styles.chart} width={screenSize.width > 1366 ? 900 : (screenSize.width <= 900 ? screenSize.width - 60 : 600)} height={screenSize.width > 1366 ? 650 : 400} data={dataChart}>
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
                    </>
            }
        </>
    )
}