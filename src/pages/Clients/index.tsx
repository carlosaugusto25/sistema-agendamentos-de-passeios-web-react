import { useCallback, useEffect, useState } from "react";
import { Header } from "../../components/Header";
import styles from './clients.module.scss'
import { api } from "../../service/api";
import { toast } from "react-toastify";
import { LoadingBoatGet } from "../../components/LoadingBoatGet";
import { maskCpf, maskPhone } from "../../utils/masks";
import { FaEdit } from "react-icons/fa";
import { Modal } from "../../components/Modal";
import { Input } from "../../components/Input";
import { Client } from "../../@types/interfaces/types";

export function Clients() {

    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    //client infos 
    const [idClient, setIdClient] = useState('');
    const [nameClient, setNameClient] = useState('');
    const [documentClient, setDocumentClient] = useState('');
    const [emailClient, setEmailClient] = useState('');
    const [phoneClient, setPhoneClient] = useState('');

    const [modalEditClient, setModalEditClient] = useState(false);

    const [loadingEditClient, setLoadingEditClient] = useState(false);

    const pageSize = 20;

    const getClients = useCallback(() => {
        setLoading(true);
        api.get('/clients').then(response => {
            // API returns an object with `clients` array
            const clientsFromApi = response.data.clients || [];
            const sorted = clientsFromApi.slice().sort((a: Client, b: Client) =>
                a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' })
            );
            setClients(sorted);
        }).catch(error => {
            console.error('Error fetching clients:', error);
            toast.error('Falha ao carregar lista de clientes');
        }).finally(() => {
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        getClients();
    }, [getClients]);

    useEffect(() => {
        // reset to first page when clients change
        setCurrentPage(1);
    }, [clients.length]);

    function getInfos(client: Client) {
        setIdClient(client.id);
        setNameClient(client.name);
        setDocumentClient(client.document);
        setEmailClient(client.email);
        setPhoneClient(client.phone);
        setModalEditClient(true);
    }

    function eraseInfos() {
        setIdClient('');
        setNameClient('');
        setDocumentClient('');
        setEmailClient('');
        setPhoneClient('');
    }

    const handleEditClient = useCallback(() => {

        if (documentClient.length < 11) {
            toast.error('CPF incompleto');
            return;
        }

        if (phoneClient.length < 11) {
            toast.error('Telefone incompleto');
            return;
        }

        setLoadingEditClient(true);
        api.put(`/clients`, {
            id: idClient,
            name: nameClient,
            document: documentClient,
            email: emailClient,
            phone: phoneClient
        }).then(response => {
            console.log('Client updated:', response.data);
            toast.success('Cliente atualizado com sucesso');
            setModalEditClient(false);
            getClients();
        }).catch(error => {
            console.error('Error updating client:', error);
            toast.error('Falha ao atualizar cliente');
        }).finally(() => {
            setLoadingEditClient(false);
            eraseInfos();
        });
    }, [idClient, nameClient, documentClient, emailClient, phoneClient, getClients]);

    const totalPages = Math.max(1, Math.ceil(clients.length / pageSize));

    const displayedClients = clients.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    function getPageButtons(): number[] {
        if (totalPages <= 4) return Array.from({ length: totalPages }, (_, i) => i + 1);
        let start = currentPage - 1;
        if (start < 1) start = 1;
        if (start + 3 > totalPages) start = totalPages - 3;
        return [start, start + 1, start + 2, start + 3];
    }

    return (
        <>
            <Header />
            <div className={styles.container}>
                <h1>Clientes</h1>
                {loading ? (
                    <LoadingBoatGet />
                ) : (
                    <>
                        <div className={styles.tableWrapper}>
                            {displayedClients.length === 0 ? (
                                <p>Nenhum cliente encontrado.</p>
                            ) : (
                                <table className={styles.table}>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Nome</th>
                                            <th>Documento</th>
                                            <th>E-mail</th>
                                            <th>Telefone</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {displayedClients.map((c, idx) => (
                                            <tr key={c.id}>
                                                <td title={`#${(currentPage - 1) * pageSize + idx + 1}`}>{(currentPage - 1) * pageSize + idx + 1}</td>
                                                <td title={c.name}>{c.name}</td>
                                                <td title={c.document}>{maskCpf(c.document)}</td>
                                                <td title={c.email}>{c.email}</td>
                                                <td title={c.phone}>{maskPhone(c.phone)}</td>
                                                <td><button className={styles.editButton} onClick={() => getInfos(c)}><FaEdit /></button></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        {/* Card layout for mobile */}
                        <div className={styles.cardList} aria-hidden={false}>
                            {displayedClients.map((c, idx) => (
                                <div className={styles.card} key={c.id}>
                                    <div className={styles.cardHeader}>
                                        <div className={styles.index}>{(currentPage - 1) * pageSize + idx + 1}</div>
                                        <h3 title={c.name} className={styles.cardName}>{c.name}</h3>
                                        <div className={styles.actionsMobile}><FaEdit /></div>
                                    </div>
                                    <p className={styles.cardField}><strong>Documento: </strong><span title={c.document}>{maskCpf(c.document)}</span></p>
                                    <p className={styles.cardField}><strong>E-mail: </strong><span title={c.email}>{c.email}</span></p>
                                    <p className={styles.cardField}><strong>Telefone: </strong><span title={c.phone}>{maskPhone(c.phone)}</span></p>
                                </div>
                            ))}
                        </div>

                        <div className={styles.pagination}>
                            <button className={styles.pageButton} onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>primeira</button>
                            {getPageButtons().map((p) => (
                                <button key={p} className={`${styles.pageButton} ${p === currentPage ? styles.activePage : ''}`} onClick={() => setCurrentPage(p)}>{p}</button>
                            ))}
                            <button className={styles.pageButton} onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>última</button>
                        </div>
                    </>
                )}

                {
                    modalEditClient && (
                        <Modal
                            onClose={() => { setModalEditClient(false); eraseInfos() }}
                            onClick={handleEditClient}
                            textButton1="Cancelar"
                            typeButton1="cancel"
                            textButton2="Editar"
                            typeButton2="create"
                            title="Editar cliente"
                            loading={loadingEditClient}
                        >
                            <div className={styles.modalContentEditClient}>
                                <Input placeholder="Nome" value={nameClient} onChange={(e) => setNameClient(e.target.value)} />
                                <Input placeholder="CPF" type="text" maxLength={11} value={maskCpf(documentClient)} onChange={(e) => setDocumentClient(e.target.value)} />
                                <Input placeholder="E-mail" value={emailClient} onChange={(e) => setEmailClient(e.target.value)} />
                                <Input placeholder="Telefone" value={maskPhone(phoneClient)} onChange={(e) => setPhoneClient(e.target.value)} />
                            </div>
                        </Modal>
                    )
                }

            </div>
        </>
    )
}