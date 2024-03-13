import { useState, useEffect, Suspense } from "react"
import { Link } from "react-router-dom"
import { useCookies } from "react-cookie"
import { Helmet } from "react-helmet"
import { Slide, toast } from "react-toastify";
import { Basket, Calendar, ChartDonut, DotsThreeCircleVertical, ListBullets, PlusCircle } from "@phosphor-icons/react"
import { APIsendOrder, deleteOrder, getOrders } from "../../../utils/api/orders";
import { Modal, Spinner, Table } from "react-bootstrap";

function Orders() {
    const [cookies] = useCookies(['authToken'])
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [isEmpty, setIsEmpty] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [shesExclude, setShesExclude] = useState(false)
    const [selectedOrderID, setSelectedOrderID] = useState('')
    const [selectedOrderIndex, setSelectedOrderIndex] = useState(0)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getOrders(cookies.authToken)
                if (res !== null && res.message !== "Nenhum pedido encontrado") {
                    setOrders(res)
                    setLoading(false)
                } else {
                    setIsEmpty(true)
                    setLoading(false)
                }
            } catch (e) {
                console.log(e)
            }
        }
        fetchData()
    }, [cookies.authToken])

    const handleShowModal = (id: string, orderNumber: number) => {
        setSelectedOrderID(id)
        setSelectedOrderIndex(orderNumber)
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

    const Info_Modal = ({ orderNumber, orderID }: { orderNumber: number, orderID: string }) => {
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

    const handleDeleteOrder = async (id: string) => {
        setShesExclude(true)
        try {
            const res = await deleteOrder(id, cookies.authToken)
            if (res !== null) {
                toast.success(ToastInformation(res.code, res.message), {
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
                                orders?.map((or: APIsendOrder, i: number) => (
                                    <tr key={i}>
                                        <td className="w-[80px]">
                                            <div className="flex items-center justify-center h-[3rem]">
                                                <span className="text-lg font-blinker text-stone-500">
                                                    {i}
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex items-center justify-center h-[3rem]">
                                                <span className="text-lg font-blinker text-stone-500">
                                                    {or.client_}
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex items-center justify-center h-[3rem]">
                                                <span className="text-lg font-blinker text-stone-500">
                                                    R$ {or.sale}
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex items-center justify-center h-[3rem]">
                                                <span className="text-lg font-blinker text-stone-500">
                                                    {or.total}
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex flex-row gap-3 items-center justify-center h-[3rem]">
                                                <Link to={`../product/${or.id}`}>
                                                    <button className="p-1 bg-emerald-500 rounded-md text-stone-50 border-[1px] border-emerald-500 hover:bg-emerald-400 hover:border-emerald-400 transition-all font-blinker w-[5rem]">
                                                        Detalhes
                                                    </button>
                                                </Link>
                                                <button onClick={() => handleShowModal(or.id, i)} className="p-1 border-rose-500 border-[1px] rounded-md text-rose-500 hover:border-rose-300 hover:text-rose-300 transition-all font-blinker w-[5rem]">
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