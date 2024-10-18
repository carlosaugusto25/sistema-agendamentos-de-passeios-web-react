import { useCallback, useEffect, useMemo, useState } from "react";
import { Header } from "../../components/Header"
import styles from './home.module.scss';
import { addDays, format, getDay, parse, startOfWeek } from "date-fns";
import { api } from "../../service/api";
import { SelectionBoat } from "../../components/SelectionBoat";
import { Calendar, dateFnsLocalizer, SlotInfo } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { ptBR } from 'date-fns/locale';
import { AdditionalProps, GetAppointmentsProps, GetBoatProps, AdditonalResponseShow } from "../../@types/interfaces/types";
import { FaEye } from "react-icons/fa";
import { Modal } from "../../components/Modal";
import { Input } from "../../components/Input";
import { SelectBoat } from "../../components/SelectBoat";
import { SelectTurn } from "../../components/SelectTurn";
import { SelectPayment } from "../../components/SelectPayment";
import { toast } from "react-toastify";
import { maskCpf, maskDate, maskPhone } from "../../utils/masks";
import { FaPlus, FaRegCalendarAlt, FaList } from "react-icons/fa";
import { LoadingBoatGet } from "../../components/LoadingBoatGet";

const locales = {
    'pt-BR': ptBR
}

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales
});

interface EventSelectedProps {
    color: string;
    desc: string;
    end: Date;
    id: string;
    start: Date;
    tipo: string;
    title: string;
}

interface Item {
    id: string;
    client_name: string;
    turn: string;
    date: string;
    speedboat_id: string;
    speedboat: GetBoatProps;
}

interface SectionData {
    title: string;
    data: Item[];
    month: number;
}

export function Home() {

    const [appointment, setAppointment] = useState<GetAppointmentsProps[]>([]);
    const [boats, setBoats] = useState<GetBoatProps[]>([]);
    const [appointmentSelectedCalendar, setAppointmentSelectedCalendar] = useState<GetAppointmentsProps>({} as GetAppointmentsProps);
    const [appointmentList, setAppointmentList] = useState<EventSelectedProps[]>([])

    const [loading, setLoading] = useState(false);
    const [loadingNewAppointment, setLoadingNewAppointment] = useState(false);
    const [loadingEditAppointment, setLoadingEditAppointment] = useState(false);
    const [loadingDeleteAppointment, setLoadingDeleteAppointment] = useState(false);
    const [loadingListAppointment, setLoadingListAppointment] = useState(false);
    const [loadingDetailsAppointment, setLoadingDetailsAppointment] = useState(false);

    const [boatId, setBoatId] = useState('');
    const [idAppointmentEdit, setIdAppointmentEdit] = useState('');
    const [dataAppointments, setDataAppointments] = useState<SectionData[]>([]);

    const [dateSelected, setDateSelected] = useState('');
    const [turnSelected, setTurnSelected] = useState('');
    const [quantity, setQuantity] = useState('');
    const [clientEmail, setClientEmail] = useState('');
    const [clientName, setClientName] = useState('');
    const [clientPhone, setClientPhone] = useState('');
    const [clientDocument, setClientDocument] = useState('');
    const [paymentType, setPaymentType] = useState('');
    const [value, setValue] = useState('');
    const [totalValue, setTotalValue] = useState('');
    const [speedboatSelected, setSpeedboatSelected] = useState('');
    const [aditionalSelected, setAditionalSelected] = useState<string[]>([]);

    const [aditionals, setAditionals] = useState<AdditionalProps[]>([])

    const [modalAdd, setModalAdd] = useState(false);
    const [modalDetails, setModalDetails] = useState(false);
    const [modalList, setModalList] = useState(false);
    const [modalEdit, setModalEdit] = useState(false);
    const [modalDelete, setModalDelete] = useState(false);

    const [screenSize, setScreenSize] = useState({ width: window.innerWidth, height: window.innerHeight });
    const [option, setOption] = useState<'list' | 'calendar'>('list')

    const updateScreenSize = () => {
        setScreenSize({ width: window.innerWidth, height: window.innerHeight });
    };

    const loadAditionals = useCallback(async () => {
        await api.get('').then((response) => {
            setAditionals(response.data)
        }).catch(error => console.log(error))
    }, [])

    const getBoat = useCallback(async () => {
        await api.get('').then((response) => {
            setBoats(response.data);
        }).catch(error => console.log(error));
    }, [])


    const extractMonth = (dateString: string): number => {
        const date = new Date(dateString);
        return date.getMonth() + 1;
    };

    const isDateInTheFuture = (dateString: string): boolean => {
        const itemDate = format(addDays(new Date(dateString), 1), 'yyyy-MM-dd');
        const currentDate = format(new Date(), 'yyyy-MM-dd');

        return itemDate >= currentDate;
    };

    const organizeData = (rawData: Item[]): SectionData[] => {
        const sectionsMap: { [key: string]: { data: Item[], month: number } } = {};

        const filteredData = rawData.filter((item) => isDateInTheFuture(item.date));

        filteredData.forEach((item) => {
            const sectionKey = item.date;
            const month = extractMonth(item.date);

            if (!sectionsMap[sectionKey]) {
                sectionsMap[sectionKey] = { data: [], month }
            }

            sectionsMap[sectionKey].data.push(item)
        })

        const formattedSections = Object.keys(sectionsMap).map((key) => ({
            title: key,
            data: sectionsMap[key].data,
            month: sectionsMap[key].month
        }))

        return formattedSections.sort((a, b) => new Date(a.title).getTime() - new Date(b.title).getTime());
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const loadAppointments = async () => {
        setLoading(true);
        await api.get(``).then((response) => {
            setAppointment(response.data);
            const rawData: Item[] = response.data;
            const formatedData = organizeData(rawData);
            setDataAppointments(formatedData);
        }).catch(error => console.log(error)).finally(() => setLoading(false))
    }

    const loadAppointmentsShow = useCallback((id: string) => {
        setLoadingDetailsAppointment(true);
        api.get(``).then((response) => {
            setAppointmentSelectedCalendar(response.data);
        }).catch(error => {
            console.log(error)
            toast.error('Erro ao buscar agendamento');
        }).finally(() => setLoadingDetailsAppointment(false))
    }, [])

    const loadAppointmentsShowEdit = useCallback((id: string) => {
        setLoadingEditAppointment(true);
        api.get(``).then((response) => {
            setIdAppointmentEdit(response.data.id);
            setClientName(response.data.client_name);
            setClientEmail(response.data.client_email);
            setClientPhone(response.data.client_phone);
            setClientDocument(response.data.client_document);
            setPaymentType(response.data.payment_type);
            setValue(`${response.data.value / 100}`);
            setTotalValue(`${response.data.total_value / 100}`);
            setSpeedboatSelected(response.data.speedboat_id);
            setQuantity(response.data.people_quantity);
            setTurnSelected(response.data.turn);
            setDateSelected(response.data.date.split('-').reverse().join('-'));
            setAditionalSelected(response.data.additionals?.map((item: AdditonalResponseShow) => item.additional_id));
        }).catch(error => {
            console.log(error)
            toast.error('Erro ao buscar agendamento');
        }).finally(() => setLoadingEditAppointment(false))
    }, [])

    useEffect(() => {
        loadAppointments();
        loadAditionals();
        getBoat()

        window.addEventListener('resize', updateScreenSize);

        return () => {
            window.removeEventListener('resize', updateScreenSize);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    console.log(dataAppointments, appointment)

    const appointmentsFilter = useMemo(() => {
        return dataAppointments.map((item) => ({ ...item, data: item.data.filter((item) => item.speedboat_id === boatId) }))
    }, [boatId, dataAppointments])

    const appointmentsCalendar = useMemo(() => {
        return appointment.map((item) => ({
            id: item.id,
            title: item.client_name,
            start: addDays(new Date(item.date), 1),
            end: addDays(new Date(item.date), 1),
            desc: item.speedboat.name,
            color: format(addDays(new Date(item.date),1), 'yyyy-MM-dd') < format(new Date(), 'yyyy-MM-dd') ? 'gray' : (item?.additionals?.length > 0 ? '#FC7B01' : (item.speedboat.color ? item.speedboat.color : 'blue')),
            tipo: item.turn === 'MORNING' ? 'Manhã' : (item.turn === 'AFTERNOON' ? 'Tarde' : 'Dia inteiro'),
        }))
        
    }, [appointment])

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const eventStyle = (event: any) => ({
        style: {
            backgroundColor: event.color,
        }
    })

    function handleAddEvent(event: SlotInfo) {
        setModalAdd(true)
        setDateSelected(format(new Date(event.start), 'dd-MM-yyyy'))
        setClientName('')
        setClientDocument('')
        setValue('')
        setQuantity('')
        setClientEmail('')
        setClientPhone('')
        setTurnSelected('')
        setPaymentType('')
        setSpeedboatSelected('')
        setTotalValue('')
        setAditionalSelected([])
    }


    function deleteInfos() {
        setClientName('')
        setClientDocument('')
        setValue('')
        setQuantity('')
        setClientEmail('')
        setClientPhone('')
        setTurnSelected('')
        setPaymentType('')
        setSpeedboatSelected('')
        setTotalValue('')
        setAditionalSelected([])
    }

    function handleDetailsEvent(event: EventSelectedProps) {
        setModalDetails(true)
        loadAppointmentsShow(event.id)
    }

    function handleEventListCalendar(event: EventSelectedProps[]) {
        setLoadingListAppointment(true)
        setModalList(true)
        setAppointmentList(event)
        setLoadingListAppointment(false)
    }

    const addAditional = useCallback((value: string) => {
        if (aditionalSelected.includes(value)) {
            setAditionalSelected(aditionalSelected.filter(item => item !== value))
        } else {
            setAditionalSelected([...aditionalSelected, value])
        }


    }, [aditionalSelected])

    const valueTotal = useMemo(() => {
        let total = Number(totalValue) * 100
        if (modalAdd) {
            aditionals.map((item) => {
                if (aditionalSelected?.includes(item.id)) {
                    total += Number(item.value)
                }
            })
            return total
        }
        if (modalEdit) {
            aditionals.map((item) => {
                if (aditionalSelected?.includes(item.id)) {
                    total += Number(item.value)
                }
            })
            return total
        }

    }, [totalValue, aditionalSelected, aditionals, modalAdd, modalEdit])

    const handleSubmitNewAppointment = useCallback(async () => {
        let maxPeopleBoat = false
        let unavailableBoat = false
        let unavailableDayBoat = false

        if (dateSelected === '' || clientName === '' || clientDocument === '' || value === '' || quantity === '' || clientPhone === '' || turnSelected === '' || paymentType === '' || speedboatSelected === '') {
            return toast.error('Preencha todos os dados.')
        }

        appointment.map((item) => {
            if (item.date === dateSelected.split('-').reverse().join('-') && turnSelected === item.turn && item.speedboat_id === speedboatSelected) {
                return unavailableBoat = true
            } else if (item.date === dateSelected.split('-').reverse().join('-') && item.turn === 'DAY' && item.speedboat_id === speedboatSelected) {
                return unavailableDayBoat = true
            }
        })

        if (unavailableDayBoat) {
            return toast.error('Dia indisponível nesta lancha para esta data')
        }

        if (unavailableBoat) {
            return toast.error('Horário indisponível nesta lancha para esta data')
        }

        boats.map((boat) => {
            if (boat.id === speedboatSelected && Number(quantity) > boat.max_people) {
                return maxPeopleBoat = true
            }
        })

        if (maxPeopleBoat) {
            return toast.error('Capacidade da lancha excedida')
        }

        const obj = {
            date: dateSelected.split('-').reverse().join('-'),
            turn: turnSelected,
            people_quantity: Number(quantity),
            client_email: clientEmail,
            client_name: clientName,
            client_phone: clientPhone,
            client_document: clientDocument,
            payment_type: paymentType,
            value: Number(value) * 100,
            total_value: valueTotal,
            speedboat_id: speedboatSelected,
            additionals: aditionalSelected
        }

        setLoadingNewAppointment(true)

        await api.post('', obj).then(() => {
            toast.success('Passeio agendado com sucesso!')
            loadAppointments()
            setModalAdd(false)
            setClientName('')
            setClientDocument('')
            setValue('')
            setTotalValue('')
            setQuantity('')
            setClientEmail('')
            setClientPhone('')
            setTurnSelected('')
            setPaymentType('')
            setSpeedboatSelected('')
            setAditionalSelected([])
        }).catch(error => {
            console.log(error)
            toast.error('Não foi possível agendar o passeio.')
        }).finally(() => setLoadingNewAppointment(false))
    }, [boats, appointment, speedboatSelected, clientName, clientDocument, value, quantity, dateSelected, aditionalSelected, clientPhone, clientEmail, turnSelected, paymentType, valueTotal, loadAppointments])

    const aditionalMemo = useMemo(() => {
        return appointmentSelectedCalendar?.additionals?.map(add => {
            return add.additional_id
        })
    }, [appointmentSelectedCalendar])

    const handleSubmitEditAppointment = useCallback(async () => {
        let maxPeopleBoat = false
        let unavailableBoat = false
        let unavailableDayBoat = false

        if (dateSelected === '' || clientName === '' || clientDocument === '' || value === '' || quantity === '' || clientPhone === '' || turnSelected === '' || paymentType === '' || speedboatSelected === '') {
            return toast.error('Preencha todos os dados.')
        }

        if(dateSelected.split('-').reverse().join('-') !== appointmentSelectedCalendar?.date || turnSelected !== appointmentSelectedCalendar?.turn || speedboatSelected !== appointmentSelectedCalendar?.speedboat_id) {
            appointment.map((item) => {
                if (item.date === dateSelected.split('-').reverse().join('-') && turnSelected === item.turn && item.speedboat_id === speedboatSelected && idAppointmentEdit !== item.id) {
                    return unavailableBoat = true
                } else if (item.date === dateSelected.split('-').reverse().join('-') && item.turn === 'DAY' && item.speedboat_id === speedboatSelected && idAppointmentEdit !== item.id) {
                    return unavailableDayBoat = true
                }
            })
        }

        if (unavailableDayBoat) {
            return toast.error('Dia indisponível nesta lancha para esta data')
        }

        if (unavailableBoat) {
            return toast.error('Horário indisponível nesta lancha para esta data')
        }

        boats.map((boat) => {
            if (boat.id === speedboatSelected && Number(quantity) > boat.max_people) {
                return maxPeopleBoat = true
            }
        })

        if (maxPeopleBoat) {
            return toast.error('Capacidade da lancha excedida')
        }

        const obj = {
            id: idAppointmentEdit,
            date: dateSelected.split('-').reverse().join('-'),
            turn: turnSelected,
            people_quantity: Number(quantity),
            client_email: clientEmail,
            client_name: clientName,
            client_phone: clientPhone,
            client_document: clientDocument,
            payment_type: paymentType,
            value: Number(value) * 100,
            total_value: valueTotal,
            speedboat_id: speedboatSelected,
            additionals: aditionalSelected
        }

        setLoadingEditAppointment(true)

        await api.put('', obj).then(() => {
            toast.success('Passeio atualizado com sucesso!')
            loadAppointments()
            setModalEdit(false)
            setClientName('')
            setClientDocument('')
            setValue('')
            setTotalValue('')
            setQuantity('')
            setClientEmail('')
            setClientPhone('')
            setTurnSelected('')
            setPaymentType('')
            setSpeedboatSelected('')
            setAditionalSelected([])
        }).catch(error => {
            console.log(error)
            toast.error('Não foi possível atualizar o passeio.')
        }).finally(() => setLoadingEditAppointment(false))
    }, [appointment, boats, idAppointmentEdit, speedboatSelected, clientName, clientDocument, value, quantity, dateSelected, aditionalSelected, clientPhone, clientEmail, turnSelected, paymentType, valueTotal, loadAppointments, appointmentSelectedCalendar])

    const handleDeleteAppointment = useCallback(async (id: string) => {
        setLoadingDeleteAppointment(true)
        await api.delete(``).then(() => {
            toast.success('Passeio excluído com sucesso!')
            loadAppointments()
            setModalDelete(false)
        }).catch(error => {
            console.log(error)
            toast.error('Não foi possível excluir o passeio.')
        }).finally(() => setLoadingDeleteAppointment(false))
    }, [loadAppointments])

    const handleVoucher = useCallback(async () => {
        setLoadingDetailsAppointment(true);
        try {
            const response = await api.get(
                ``
            );

            // Converte para um Blob
            const blob = await fetch(response.data).then((res) => res.blob());

            // Cria um URL temporário para o PDF
            const blobUrl = URL.createObjectURL(blob);

            // Abre o PDF em uma nova aba do navegador
            window.open(blobUrl, '_blank');
            setLoadingDetailsAppointment(false);
        } catch (error) {
            console.error('Erro ao buscar o PDF:', error);
            toast.error('Erro ao gerar o Voucher');
            setLoadingDetailsAppointment(false);
        }
    }, [appointmentSelectedCalendar]);

    return (
        <>
            <Header />
            {
                loading ?
                    <LoadingBoatGet />
                    :
                    <>
                        <div className={styles.container}>
                            {
                                screenSize.width > 600 &&
                                <div className={styles.schedulingList}>
                                    <div className={styles.contentHeader}>
                                        <h1>Próximos passeios</h1>
                                        <SelectionBoat setBoatSelected={setBoatId} />
                                    </div>
                                    <div className={styles.contentList}>
                                        {
                                            appointmentsFilter.map((item, index) => {
                                                if (item.data.length > 0) {
                                                    return (
                                                        <>
                                                            <h4 key={index}>{item.title.split('-').reverse().join('-')}</h4>
                                                            {
                                                                item.data.map((it, index) => (
                                                                    <div className={styles.card} key={it.id} onClick={() => { loadAppointmentsShow(it.id); setModalDetails(true) }}>
                                                                        <div className={styles.info}>
                                                                            <p className={styles.number}>{index + 1}</p>
                                                                            <div>
                                                                                <p className={styles.nameClient}>{it.client_name}</p>
                                                                                <p className={styles.type}><strong>{it.turn === 'MORNING' ? 'Manhã' : (it.turn === 'AFTERNOON' ? 'Tarde' : 'Dia inteiro')}</strong> - {it.speedboat.name} </p>
                                                                            </div>
                                                                        </div>

                                                                        <FaEye className={styles.icon} />
                                                                    </div>
                                                                ))
                                                            }
                                                        </>
                                                    )
                                                }
                                            })
                                        }
                                    </div>
                                </div>
                            }
                            {
                                screenSize.width > 600 &&
                                <div className={styles.schedulingCalendar}>
                                    <h1>Calendário de Passeios</h1>
                                    <Calendar
                                        localizer={localizer}
                                        startAccessor="start"
                                        endAccessor="end"
                                        events={appointmentsCalendar}
                                        className={styles.calendar}
                                        onSelectEvent={(event) => handleDetailsEvent(event)}
                                        views={['month']}
                                        eventPropGetter={eventStyle}
                                        onSelectSlot={(slotInfo) => handleAddEvent(slotInfo)}
                                        messages={{
                                            allDay: 'Dia inteiro',
                                            previous: 'Anterior',
                                            next: 'Seguinte',
                                            today: 'Hoje',
                                            month: 'Mês',
                                            week: 'Semana',
                                            day: 'Dia',
                                            agenda: 'Agenda',
                                            date: 'Data',
                                            time: 'Hora',
                                            event: 'Evento',
                                            noEventsInRange: 'Sem eventos neste intervalo',
                                            showMore: total => `+${total} mais`,
                                        }}
                                        onShowMore={(onshowmore) => handleEventListCalendar(onshowmore)}
                                        culture="pt-BR"
                                        selectable
                                    />
                                    <div className={styles.legend}>
                                        {boats.map((boat) => (
                                            <div key={boat.id} className={styles.nameAndColor}>
                                                <p className={styles.name}>{boat.name}</p>
                                                <div className={styles.color} style={{ backgroundColor: boat.color ? boat.color : '' }} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            }
                            {
                                (screenSize.width <= 600 && option === 'list') &&
                                <div className={styles.schedulingList}>
                                    <div className={styles.contentHeader}>
                                        <h1>Próximos passeios</h1>
                                        <SelectionBoat setBoatSelected={setBoatId} />
                                    </div>
                                    <div className={styles.contentList}>
                                        {
                                            appointmentsFilter.map((item, index) => {
                                                if (item.data.length > 0) {
                                                    return (
                                                        <>
                                                            <h4 key={index}>{item.title.split('-').reverse().join('-')}</h4>
                                                            {
                                                                item.data.map((it, index) => (
                                                                    <div className={styles.card} key={it.id} onClick={() => { loadAppointmentsShow(it.id); setModalDetails(true) }}>
                                                                        <div className={styles.info}>
                                                                            <p className={styles.number}>{index + 1}</p>
                                                                            <div>
                                                                                <p className={styles.nameClient}>{it.client_name}</p>
                                                                                <p className={styles.type}><strong>{it.turn === 'MORNING' ? 'Manhã' : (it.turn === 'AFTERNOON' ? 'Tarde' : 'Dia inteiro')}</strong> - {it.speedboat.name} </p>
                                                                            </div>
                                                                        </div>

                                                                        <FaEye className={styles.icon} />
                                                                    </div>
                                                                ))
                                                            }
                                                        </>
                                                    )
                                                }
                                            })
                                        }
                                    </div>
                                </div>
                            }
                            {
                                (screenSize.width <= 600 && option === 'calendar') &&
                                <div className={styles.schedulingCalendar}>
                                    <h1>Calendário de Passeios</h1>
                                    <Calendar
                                        localizer={localizer}
                                        startAccessor="start"
                                        endAccessor="end"
                                        events={appointmentsCalendar}
                                        className={styles.calendar}
                                        onSelectEvent={(event) => handleDetailsEvent(event)}
                                        views={['month']}
                                        eventPropGetter={eventStyle}
                                        onSelectSlot={(slotInfo) => handleAddEvent(slotInfo)}
                                        messages={{
                                            allDay: 'Dia inteiro',
                                            previous: 'Anterior',
                                            next: 'Seguinte',
                                            today: 'Hoje',
                                            month: 'Mês',
                                            week: 'Semana',
                                            day: 'Dia',
                                            agenda: 'Agenda',
                                            date: 'Data',
                                            time: 'Hora',
                                            event: 'Evento',
                                            noEventsInRange: 'Sem eventos neste intervalo',
                                            showMore: total => `+${total} mais`,
                                        }}
                                        onShowMore={(onshowmore) => handleEventListCalendar(onshowmore)}
                                        culture="pt-BR"
                                        selectable
                                        longPressThreshold={250}
                                    />
                                    <div className={styles.legend}>
                                        {boats.map((boat) => (
                                            <div key={boat.id} className={styles.nameAndColor}>
                                                <p className={styles.name}>{boat.name}</p>
                                                <div className={styles.color} style={{ backgroundColor: boat.color ? boat.color : '' }} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            }
                            {
                                screenSize.width <= 600 &&
                                <div className={styles.menuBotton}>
                                    <div onClick={() => setOption('list')} className={styles.iconAndNameMenu}>
                                        <FaList className={styles.iconMenu} style={{ color: option === 'list' ? '#0099DD' : '#706e7a' }} />
                                        <p style={{ color: option === 'list' ? '#0099DD' : '#706e7a' }}>Listagem</p>
                                    </div>
                                    <div onClick={() => setOption('calendar')} className={styles.iconAndNameMenu}>
                                        <FaRegCalendarAlt className={styles.iconMenu} style={{ color: option === 'calendar' ? '#0099DD' : '#706e7a' }} />
                                        <p style={{ color: option === 'calendar' ? '#0099DD' : '#706e7a' }}>Calendário</p>
                                    </div>
                                </div>
                            }
                        </div>
                        {
                            modalAdd &&
                            <Modal
                                onClose={() => { setModalAdd(false); deleteInfos() }}
                                onClick={handleSubmitNewAppointment}
                                textButton1="Cancelar"
                                typeButton1="cancel"
                                textButton2="Adicionar"
                                typeButton2="create"
                                title="Adicionar passeio"
                                loading={loadingNewAppointment}
                            >
                                <div className={styles.contentModalAdd}>
                                    <div className={styles.contentSelects}>
                                        <Input defaultValue={dateSelected} readOnly />
                                        <SelectBoat value={speedboatSelected} setBoatSelected={setSpeedboatSelected} />
                                    </div>
                                    <Input placeholder="Nome do cliente" type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} />
                                    <div className={styles.contentSelects2}>
                                        <Input placeholder="CPF do cliente" type="text" maxLength={11} value={maskCpf(clientDocument)} onChange={(e) => setClientDocument(e.target.value)} />
                                        <Input placeholder="Telefone do cliente" type="text" maxLength={14} value={maskPhone(clientPhone)} onChange={(e) => setClientPhone(e.target.value)} />
                                    </div>
                                    <div className={styles.contentSelects2}>
                                        <Input width="70%" placeholder="Email do cliente" type="email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} />
                                        <Input width="26%" placeholder="Qtd" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                                    </div>
                                    <div className={styles.contentSelects2}>
                                        <SelectTurn turn={turnSelected} setTurnSelected={setTurnSelected} />
                                        <SelectPayment paymentType={paymentType} setPaymentType={setPaymentType} />
                                    </div>
                                    <div className={styles.contentSelects2}>
                                        <Input placeholder="Valor na entrada" type="number" value={value} onChange={(e) => setValue(e.target.value)} />
                                        <Input placeholder="Valor do Passeio" type="number" value={totalValue} onChange={(e) => setTotalValue(e.target.value)} />
                                    </div>
                                    {
                                        aditionals.map((aditional) => (
                                            <div key={aditional.id} className={styles.contentSelects2}>
                                                <Input type="checkbox" width="10%" checkbox value={aditional.id} onChange={(e) => addAditional(e.target.value)} />
                                                <p className={styles.labelCheckBox}>{aditional.name}</p>
                                            </div>
                                        ))
                                    }
                                </div>
                            </Modal>
                        }
                        {
                            modalDetails &&
                            <Modal
                                onClose={() => setModalDetails(false)}
                                onClick={() => { setModalDetails(false); deleteInfos(); setModalEdit(true); loadAppointmentsShowEdit(appointmentSelectedCalendar?.id) }}
                                textButton1="Fechar"
                                typeButton1="cancel"
                                textButton2="Editar"
                                typeButton2="create"
                                title="Detalhes"
                                loading={loadingDetailsAppointment}
                                deleteIcon
                                onDelete={() => { setModalDetails(false); deleteInfos(); setModalDelete(true); }}
                                voucherIcon
                                onVoucher={handleVoucher}
                            >
                                <div className={styles.contentModalDetails}>
                                    <p className={styles.labelName}>Nome:</p>
                                    <p className={styles.nameClient}>{appointmentSelectedCalendar?.client_name}</p>
                                    <div className={styles.contentRow}>
                                        <div>
                                            <p className={styles.labelName}>CPF:</p>
                                            <p className={styles.info}>{maskCpf(appointmentSelectedCalendar?.client_document ? appointmentSelectedCalendar?.client_document : 'Não informado')}</p>
                                        </div>
                                        <div>
                                            <p className={styles.labelName}>Telefone:</p>
                                            <p className={styles.info}>{maskPhone(appointmentSelectedCalendar?.client_phone ? appointmentSelectedCalendar?.client_phone : 'Não informado')}</p>
                                        </div>
                                    </div>
                                    <div className={styles.contentRow}>
                                        <div>
                                            <p className={styles.labelName}>Email:</p>
                                            <p className={styles.info}>{appointmentSelectedCalendar?.client_email ? appointmentSelectedCalendar?.client_email : 'Não informado'}</p>
                                        </div>
                                        <div>
                                            <p className={styles.labelName}>Quantidade:</p>
                                            <p className={styles.info}>{appointmentSelectedCalendar?.people_quantity ? appointmentSelectedCalendar?.people_quantity : ' não informado'}</p>
                                        </div>
                                    </div>
                                    <div className={styles.contentRow}>
                                        <div>
                                            <p className={styles.labelName}>Embarcação:</p>
                                            <p className={styles.info}>{appointmentSelectedCalendar.speedboat?.name ? appointmentSelectedCalendar.speedboat?.name : ' não informado'}</p>
                                        </div>
                                        <div>
                                            <p className={styles.labelName}>Turno:</p>
                                            <p className={styles.info}>{appointmentSelectedCalendar?.turn === 'MORNING' ? 'Manhã' : (appointmentSelectedCalendar?.turn === 'AFTERNOON' ? 'Tarde' : (appointmentSelectedCalendar?.turn === 'DAY' ? 'Dia inteiro' : 'Não informado'))}</p>
                                        </div>
                                    </div>
                                    <div className={styles.contentRow}>
                                        <div>
                                            <p className={styles.labelName}>Criado por:</p>
                                            <p className={styles.info}>{appointmentSelectedCalendar?.user?.name ? appointmentSelectedCalendar?.user?.name : ' não informado'}</p>
                                        </div>
                                        <div>
                                            <p className={styles.labelName}>Na data:</p>
                                            <p className={styles.info}>{appointmentSelectedCalendar?.created_at ? format(new Date(appointmentSelectedCalendar?.created_at), 'dd/MM/yyyy') : 'Não informado'}</p>
                                        </div>
                                    </div>
                                    <div className={styles.contentRow}>
                                        <div>
                                            <p className={styles.labelName}>Valor na entrada:</p>
                                            <p className={styles.info}>{appointmentSelectedCalendar?.value ? new Intl.NumberFormat('pt-BR', {
                                                style: 'currency',
                                                currency: 'BRL'
                                            }).format(Number(appointmentSelectedCalendar?.value / 100)) : 'Não informado'}</p>
                                        </div>
                                        <div>
                                            <p className={styles.labelName}>Valor total do passeio:</p>
                                            <p className={styles.info}>R$ {appointmentSelectedCalendar?.total_value ? new Intl.NumberFormat('pt-BR', {
                                                style: 'currency',
                                                currency: 'BRL'
                                            }).format(Number(appointmentSelectedCalendar?.total_value / 100)) : 'Não informado'}</p>
                                        </div>
                                    </div>
                                    <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                                        <p className={styles.labelName}>Adicionais:</p>
                                        {
                                            aditionals ? aditionals.map((aditional) => {
                                                if (aditionalMemo?.includes(aditional.id)) {
                                                    return (
                                                        <p className={styles.info} key={aditional.id}>{aditional.name} - {new Intl.NumberFormat('pt-BR', {
                                                            style: 'currency',
                                                            currency: 'BRL'
                                                        }).format(aditional?.value / 100)}</p>
                                                    )
                                                }
                                            }) : <p className={styles.info}>Sem adicionais</p>
                                        }
                                        {
                                            aditionalMemo?.length === 0 && <p className={styles.info}>Sem adicionais</p>
                                        }
                                    </div>
                                </div>
                            </Modal>
                        }
                        {
                            modalList &&
                            <Modal
                                onClose={() => setModalList(false)}
                                onClick={() => { setModalList(false); setModalAdd(true); setDateSelected(format(new Date(appointmentList[0]?.start), 'dd-MM-yyyy')) }}
                                textButton1="Fechar"
                                typeButton1="cancel"
                                textButton2="Cadastrar"
                                typeButton2="create"
                                title="Passeios do dia"
                                loading={loadingListAppointment}
                            >
                                <div className={styles.contentModalList}>
                                    {
                                        appointmentList && appointmentList.map(appointment => (
                                            <div onClick={() => { loadAppointmentsShow(appointment.id); setModalList(false); setModalDetails(true) }} className={styles.cardModalList} key={appointment.id} style={{ backgroundColor: appointment.color }}>
                                                <div className={styles.nameAndDetails}>
                                                    <div className={styles.nameClientModalList}>{appointment.title}</div>
                                                    <div className={styles.contentInfo}>
                                                        <p className={styles.info1}>{appointment.desc}</p>
                                                        <p className={styles.info2}>{appointment.tipo}</p>
                                                    </div>
                                                </div>
                                                <FaPlus color={'#FFFFFF'} style={{ marginLeft: '1rem' }} />
                                            </div>
                                        ))
                                    }
                                </div>
                            </Modal>
                        }
                        {
                            modalEdit &&
                            <Modal
                                onClose={() => { setModalEdit(false); deleteInfos() }}
                                onClick={handleSubmitEditAppointment}
                                textButton1="Cancelar"
                                typeButton1="cancel"
                                textButton2="Confirmar"
                                typeButton2="create"
                                title="Editar passeio"
                                loading={loadingEditAppointment}
                            >
                                <div className={styles.contentModalAdd}>
                                    <div className={styles.contentSelects}>
                                        <Input type="text" value={maskDate(dateSelected)} onChange={(e) => setDateSelected(e.target.value)} />
                                        <SelectBoat speedboat={speedboatSelected} setBoatSelected={setSpeedboatSelected} />
                                    </div>
                                    <Input placeholder="Nome do cliente" type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} />
                                    <div className={styles.contentSelects2}>
                                        <Input placeholder="CPF do cliente" type="text" maxLength={11} value={maskCpf(clientDocument)} onChange={(e) => setClientDocument(e.target.value)} />
                                        <Input placeholder="Telefone do cliente" type="text" maxLength={14} value={maskPhone(clientPhone)} onChange={(e) => setClientPhone(e.target.value)} />
                                    </div>
                                    <div className={styles.contentSelects2}>
                                        <Input width="70%" placeholder="Email do cliente" type="email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} />
                                        <Input width="26%" placeholder="Qtd" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                                    </div>
                                    <div className={styles.contentSelects2}>
                                        <SelectTurn setTurnSelected={setTurnSelected} turn={turnSelected} />
                                        <SelectPayment setPaymentType={setPaymentType} paymentType={paymentType} />
                                    </div>
                                    <div className={styles.contentSelects2}>
                                        <Input placeholder="Valor na entrada" type="number" value={value} onChange={(e) => setValue(e.target.value)} />
                                        <Input placeholder="Valor do Passeio" type="number" value={totalValue} onChange={(e) => setTotalValue(e.target.value)} />
                                    </div>
                                    {
                                        aditionals.map((aditional) => (
                                            <div key={aditional.id} className={styles.contentSelects2}>
                                                <Input type="checkbox" width="10%" checkbox checked={aditionalSelected?.includes(aditional.id)} value={aditional.id} onChange={(e) => addAditional(e.target.value)} />
                                                <p className={styles.labelCheckBox}>{aditional.name}</p>
                                            </div>
                                        ))
                                    }
                                </div>
                            </Modal>
                        }
                        {
                            modalDelete &&
                            <Modal
                                onClose={() => { setModalDelete(false); deleteInfos() }}
                                onClick={() => handleDeleteAppointment(appointmentSelectedCalendar?.id)}
                                textButton1="Cancelar"
                                typeButton1="cancel"
                                textButton2="Apagar"
                                typeButton2="delete"
                                title="Apagar passeio"
                                loading={loadingDeleteAppointment}
                            >
                                <div className={styles.contentModalDelete}>
                                    <p className={styles.title}>Tem certeza que deseja excluir o passeio?</p>
                                    <p className={styles.label}>Cliente</p>
                                    <p className={styles.info}>{appointmentSelectedCalendar?.client_name}</p>
                                    <p className={styles.label}>Data</p>
                                    <p className={styles.info}>{appointmentSelectedCalendar?.date?.split('-').reverse().join('-')}</p>
                                    <p className={styles.label}>Embarcação</p>
                                    <p className={styles.info}>{appointmentSelectedCalendar?.speedboat.name}</p>
                                </div>
                            </Modal>
                        }
                    </>
            }
        </>
    )
}