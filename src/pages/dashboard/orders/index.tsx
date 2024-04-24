import { useState, useEffect, Suspense } from "react"
import { Link } from "react-router-dom"
import { useCookies } from "react-cookie"
import { Helmet } from "react-helmet"
import { Slide, toast } from "react-toastify";
import { Basket, Calendar, ChartDonut, CheckCircle, Clock, CreditCard, DotsThreeCircleVertical, FolderSimpleDashed, ListBullets, Money, PixLogo, PlusCircle, Warehouse, X, XCircle } from "@phosphor-icons/react"
import { Modal, Spinner, Table } from "react-bootstrap";
import { APIOrderResponse, APIOrderUnformatted, deleteOrderByID, getCustomers, getOrders } from "../../../utils/api/financial";
import { TableProps } from "../../../components/dashboard_list/Customers_List";

function Orders() {
    const [cookies] = useCookies(['authToken'])
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [isEmpty, setIsEmpty] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [shesExclude, setShesExclude] = useState(false)
    const [selectedOrderID, setSelectedOrderID] = useState(0)
    const [selectedOrderIndex, setSelectedOrderIndex] = useState(0)

    useEffect(() => {
        const fetchData = async () => {
            getOrders(cookies.authToken).then((res) => {
                if (res !== undefined) {
                    getCustomers(cookies.authToken).then((customers) => {
                        const customerById = customers.found.reduce((acc: any, curr: any) => {
                            acc[curr.id] = curr
                            return acc
                        }, {})
                        console.log(res.found);
                        const formattedData = res.found.map((item: APIOrderUnformatted) => ({
                            id: item.id,
                            customer_name: customerById[item.customer_].name,
                            address: item.address,
                            items_number: item.cartItems.length,
                            date: new Date(item.date).toLocaleDateString('pt-br'),
                            paymentForm: item.paymentForm,
                            status: item.status,
                            total: item.total,
                        }))
                        setOrders(formattedData)
                        setLoading(false)
                    })
                } else {
                    setIsEmpty(true)
                    setLoading(false)
                }
            })
        }
        fetchData()
    }, [cookies.authToken])

    const handleShowModal = (id: number) => {
        setSelectedOrderID(id)
        setSelectedOrderIndex(id)
        setShowModal(true)
    }

    const handleCloseModal = () => { setShowModal(false) }

    const ToastInformation = (code: number, message: string) => {
        if (code === 401) {
            return (
                <div className="flex flex-row gap-2 items-center justify-between">
                    <span> {message} </span>
                    <span className="text-sm font-abel text-stone-400 mt-2"> {code} </span>
                </div>
            )
        } else if (code === 500) {
            return (
                <div className="flex flex-row gap-2 items-center justify-between">
                    <span> Erro Interno </span>
                    <span className="text-sm font-abel text-stone-400 mt-2"> {code} </span>
                </div>
            )
        } else {
            return (
                <div className="flex flex-row gap-2 items-center justify-between">
                    <span> {message} </span>
                    <span className="text-sm font-abel text-stone-400 mt-2"> {code} </span>
                </div>
            )
        }
    }

    const Info_Modal = ({ orderNumber, orderID }: { orderNumber: number, orderID: number }) => {
        return (
            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title className="font-blinker text-stone-500 select-none"> Atenção - Exclusão de Pedido </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p className="text-lg text-stone-600 font-blinker select-none"> Você tem Certeza que Deseja Excluir o Pedido : <br /> de <b className="text-rose-500 text-2xl"> nº: {orderNumber}?</b>  </p>
                </Modal.Body>

                <Modal.Footer>
                    <button onClick={() => handleDeleteOrder(orderID)} className="bg-rose-500 border-[1px] text-stone-50 p-2 rounded w-[5rem] hover:bg-rose-300 transition-all select-none">
                        {!shesExclude ? "Sim" : <Spinner size='sm' />}
                    </button>
                    <button onClick={handleCloseModal} className="border-sky-500 border-[1px] text-sky-500 p-2 rounded w-[5rem] hover:border-sky-300 hover:text-sky-300 transition-all select-none">
                        Não
                    </button>
                </Modal.Footer>
            </Modal>
        )
    }

    const handleDeleteOrder = async (id: number) => {
        setShesExclude(true)
        try {
            const res = await deleteOrderByID(id, cookies.authToken)
            if (res !== null) {
                toast.success(ToastInformation(res.statusCode, res.message), {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    transition: Slide
                });
                setShesExclude(false)
                handleCloseModal()
                window.location.reload()
            } else {
                toast.error(ToastInformation(500, "Erro Interno"), {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    transition: Slide
                });
                setShesExclude(false)
                handleCloseModal()

            }
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        const checkStatus = () => {
            const colorMap: { [key: string]: string } = {
                'Finalizado': '#059669',
                'Em Preparo': '#e7cc00',
                'Cancelado': '#e11d48',
                'S/Status': '#4e4e4e',
                'Pendente': '#f97316',
            };

            const checkMap: { [key: string]: JSX.Element } = {
                'Finalizado': <CheckCircle size={20} weight="fill" />,
                'Em Preparo': <Warehouse size={20} weight="fill" />,
                'Cancelado': <XCircle size={20} weight="fill" />,
                'S/Status': <FolderSimpleDashed size={20} weight="fill" />,
                "Pendente": <Clock size={20} weight="fill" />,
            }

            const updatedCustomersData = orders.map((item: TableProps) => {
                const color = colorMap[item.status] || '#059669';
                const icon = checkMap[item.status] || null;

                return { ...item, color, icon };
            });

            if (JSON.stringify(updatedCustomersData) !== JSON.stringify(orders)) {
                setOrders(updatedCustomersData as never);
            }
        }
        checkStatus()
    }, [orders])  
    
    useEffect(() => {
        const updatePaymentForms = () => {
            const paymentIconMap: { [key: string]: JSX.Element } = {
                'Dinheiro': <Money size={20} weight="fill" />,
                'Cartão de Crédito': <CreditCard size={20} weight="fill" />,
                'Cartão de Débito': <CreditCard size={20} weight="fill" />,
                'Pix': <PixLogo size={20} weight="fill" />,
            };

            const updatedOrdersData = orders.map((item: APIOrderResponse) => {
                const paymentIcon = paymentIconMap[item.paymentForm] || <FolderSimpleDashed size={20} weight="fill" />;

                return { ...item, paymentIcon };
            });

            if (JSON.stringify(updatedOrdersData) !== JSON.stringify(orders)) {
                setOrders(updatedOrdersData as never);
            }
        }
        updatePaymentForms()
    }, [orders])


    return (
        <section className="flex flex-col items-start justify-start m-3">
            <Helmet>
                <title> Dashboard - Meus Pedidos </title>
            </Helmet>

            <h1 className="text-md uppercase font-blinker text-stone-400 select-none"> Meus Pedidos </h1>
            <div className='w-[10rem] h-[1px] bg-stone-300'></div>
            <article className="h-full w-full mt-3">
                <Table bordered hover>
                    <thead>
                        <tr className='font-blinker text-stone-400 font-extralight select-none'>
                            <th>
                                <div className="flex flex-row gap-2 items-center">
                                    Nº
                                    Pedido
                                </div>
                            </th>
                            <th>
                                <div className="flex flex-row gap-2 items-center">
                                    <ListBullets />
                                    Cliente
                                </div>
                            </th>
                            <th>
                                <div className="flex flex-row gap-2 items-center">
                                    <ListBullets />
                                    Endereço
                                </div>
                            </th>
                            <th>
                                <div className="flex flex-row gap-2 items-center">
                                    <ListBullets />
                                    Forma de Pagamento
                                </div>
                            </th>
                            <th>
                                <div className="flex flex-row gap-2 items-center">
                                    <ListBullets />
                                    Total
                                </div>
                            </th>
                            <th>
                                <div className="flex flex-row gap-2 items-center">
                                    <Basket />
                                    Items
                                </div>
                            </th>
                            <th>
                                <div className="flex flex-row gap-2 items-center">
                                    <Calendar />
                                    Data
                                </div>
                            </th>
                            <th>
                                <div className="flex flex-row gap-2 items-center">
                                    <ChartDonut />
                                    Status
                                </div>
                            </th>
                            <th>
                                <div className="flex flex-row gap-2 items-center">
                                    <DotsThreeCircleVertical />
                                    Opções
                                </div>
                            </th>

                        </tr>
                    </thead>
                    <tbody>
                        <Suspense fallback={<Spinner className="bg-stone-500" />}>
                            {isEmpty ? (
                                <tr>
                                    <td colSpan={10} className="items-center">
                                        <span className="text-lg text-stone-500 font-blinker select-none">
                                            Nenhum pedido registrado...
                                        </span>
                                    </td>
                                </tr>
                            ) : (
                                orders?.map((or: APIOrderResponse, i: number) => (
                                    <tr key={i} className="select-none">
                                        <td className="w-[80px]">
                                            <div className="flex items-center justify-center h-[3rem]">
                                                <span className="text-lg font-blinker text-stone-500">
                                                    {or.id}
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex items-center justify-center h-[3rem]">
                                                <span className="text-lg font-blinker text-stone-500">
                                                    {or.customer_name}
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex items-center justify-center h-[3rem]">
                                                <span className="text-lg font-blinker text-stone-500">
                                                    {or.address[0].street}
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex items-center justify-start h-[3rem]">
                                                <span className="text-lg font-blinker text-stone-500 flex-row gap-2 flex items-center ">
                                                    {or.paymentIcon}
                                                    {or.paymentForm}
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex items-center justify-center h-[3rem]">
                                                <span className="text-lg font-blinker text-stone-500">
                                                    R$ {or.total}
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex items-center justify-center h-[3rem]">
                                                <span className="text-lg font-blinker text-stone-500">
                                                    {or.items_number}
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex items-center justify-center h-[3rem]">
                                                <span className="text-lg font-blinker text-stone-500">
                                                    {or.date.toString()}
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex items-center justify-center h-[3rem]">
                                                <div className='p-1 rounded flex flex-row gap-1 w-[8rem] font-blinker text-lg h-[2.5rem] items-center justify-center' style={{ backgroundColor: or.color, color: '#FAFAFA' }}>
                                                    {or.status}
                                                    {or.icon}
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex flex-row gap-3 items-center justify-center h-[3rem]">
                                                <Link to={`../product/${or.id}`}>
                                                    <button className="p-1 bg-emerald-500 rounded-md text-stone-50 border-[1px] border-emerald-500 hover:bg-emerald-400 hover:border-emerald-400 transition-all font-blinker w-[5rem]">
                                                        Detalhes
                                                    </button>
                                                </Link>
                                                <button onClick={() => handleShowModal(or.id)} className="p-1 border-rose-500 border-[1px] rounded-md text-rose-500 hover:border-rose-300 hover:text-rose-300 transition-all font-blinker w-[5rem]">
                                                    {!loading ? 'Excluir' : <Spinner size='sm' />}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </Suspense>
                    </tbody>
                </Table>

                <div className="flex flex-row justify-center items-center mt-3">
                    <Link to="../orders/new">
                        <button className="font-blinker bg-sky-500 p-2 rounded-lg text-stone-50 hover:bg-sky-300 text-lg transition-all flex flex-row gap-1 items-center">
                            <PlusCircle size={20} weight="fill" />
                            Cadastrar Novo Pedido
                        </button>
                    </Link>
                </div>

                <Info_Modal orderNumber={selectedOrderIndex} orderID={selectedOrderID} />

            </article>
        </section>
    )
}

export default Orders