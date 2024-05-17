import { DotsThreeOutlineVertical, ImageSquare, ListBullets, PlusCircle, Warehouse } from "@phosphor-icons/react"
import { useState, useEffect, Suspense } from "react"
import { Image, Modal, Spinner, Table } from "react-bootstrap"
import { Link } from "react-router-dom"
import { APIproduct, deleteProduct, getProducts } from "../../../utils/api/product"
import { useCookies } from "react-cookie"
import { Helmet } from "react-helmet"
import { Slide, toast } from "react-toastify";
import { deleteObject, getStorage, ref as storageRef } from 'firebase/storage';

function Products() {
    const [products, setProducts] = useState([])
    const [IsEmpty, setIsEmpty] = useState(false)
    const [cookies] = useCookies(['authToken']);
    const [selectedProductID, setSelectedProductID] = useState('' as string)
    const [selectedProductName, setSelectedProductName] = useState('' as string)
    const [showModal, setShowModal] = useState(false)
    const [shesExclude, setShesExclude] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getProducts()
                if (res !== null && res.message !== "Nenhum produto encontrado") {
                    setProducts(res.found)
                    setIsEmpty(false)
                } else {
                    setIsEmpty(true)
                    setProducts([])
                }

            } catch (e) {
                console.log(e)
            }
        }
        fetchData()
    }, [])

    const handleShowModal = (id: string, productName: string) => {
        setSelectedProductName(productName)
        setSelectedProductID(id)
        setShowModal(true)
        setLoading(true)
    }

    const handleCloseModal = () => {
        setShowModal(false)
        setLoading(false)
    }

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

    const Info_Modal = ({ productName, productID }: { productName: string, productID: string }) => {
        return (
            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title className="font-blinker text-stone-500 select-none"> Atenção - Exclusão de Produto </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p className="text-lg text-stone-600 font-blinker select-none"> Você tem Certeza que Deseja Excluir o Produto: <br /> <b className="text-rose-500 text-2xl">{productName}?</b>  </p>
                </Modal.Body>

                <Modal.Footer>
                    <button onClick={() => handleDeleteProduct(productID)} className="bg-rose-500 border-[1px] text-stone-50 p-2 rounded w-[5rem] hover:bg-rose-300 transition-all select-none">
                        {!shesExclude ? "Sim" : <Spinner size='sm' />}
                    </button>
                    <button onClick={handleCloseModal} className="border-sky-500 border-[1px] text-sky-500 p-2 rounded w-[5rem] hover:border-sky-300 hover:text-sky-300 transition-all select-none">
                        Não
                    </button>
                </Modal.Footer>
            </Modal>
        )
    }

    const handleDeleteProduct = async (id: string) => {
        setShesExclude(true)
        toast.info(ToastInformation(200, 'Excluindo Produto...'), { transition: Slide, autoClose: 2500 })
        const productRef = storageRef(getStorage(), `produtos/${id}`)
        await deleteObject(productRef).then(() => {
            const fetchData = async () => {
                try {
                    await new Promise(resolve => setTimeout(resolve, 2500))
                    const res = await deleteProduct(id, cookies.authToken)
                    if (res !== null) {
                        setShesExclude(false)
                        setShowModal(false)
                        toast.success(ToastInformation(res.code, res.message), { transition: Slide, autoClose: 2500 })
                        await new Promise(resolve => setTimeout(resolve, 2500))
                        setLoading(false)
                        window.location.reload()
                    } else {
                        setShesExclude(false)
                        toast.error(ToastInformation(res.code, res.message), { transition: Slide, autoClose: 2500 })
                        setLoading(false)
                    }
                } catch (e) {
                    console.log(e)
                    setShesExclude(false)
                    toast.error(ToastInformation(500, 'Erro Interno'), { transition: Slide, autoClose: 2500 })
                }
            }
            fetchData()
        }).catch((e) => {
            console.log(e)
            setShesExclude(false)
            toast.error(ToastInformation(500, 'Erro Interno'), { transition: Slide, autoClose: 2500 })
            throw new Error('Erro Interno')
        })
    }

    const convertToFixed = (value: number) => {
        const numericValue = typeof value === 'string' ? parseFloat(value) : value;

        if (isNaN(numericValue)) {
            throw new Error('O valor fornecido não é um número válido.');
        }

        const fixedValue = numericValue.toFixed(2);
        return fixedValue;
    }

    return (
        <section className="flex flex-col items-start justify-start m-3">
            <Helmet>
                <title> Dashboard - Meus Produtos </title>
            </Helmet>

            <h1 className="text-md font-blinker text-stone-400 select-none uppercase"> Meus Produtos </h1>
            <div className='w-[10rem] h-[1px] bg-stone-300'></div>
            <article className="h-full w-full mt-3">
                <Table bordered hover>
                    <thead>
                        <tr className='font-blinker text-stone-400 font-extralight select-none'>
                            <th>
                                <div className="flex flex-row gap-1 items-center">
                                    <ImageSquare />
                                    Foto
                                </div>
                            </th>
                            <th>
                                <div className="flex flex-row gap-1 items-center">
                                    <ListBullets />
                                    Nome
                                </div>
                            </th>
                            <th>
                                <div className="flex flex-row gap-1 items-center">
                                    <ListBullets />
                                    Preço
                                </div>
                            </th>
                            <th>
                                <div className="flex flex-row gap-1 items-center">
                                    <Warehouse />
                                    Estoque
                                </div>
                            </th>
                            <th>
                                <div className="flex flex-row gap-1 items-center">
                                    <DotsThreeOutlineVertical />
                                    Ações
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <Suspense fallback={<Spinner className="bg-stone-500" />}>
                            {IsEmpty ? (
                                <tr>
                                    <td colSpan={5} className="items-center">
                                        <span className="text-lg text-stone-500 font-blinker select-none">
                                            Nenhum produto cadastrado...
                                        </span>
                                    </td>
                                </tr>
                            ) : (
                                products?.map((pr: APIproduct, i: number) => (
                                    <tr key={i}>
                                        <td className="w-[80px]">
                                            <div className="flex items-center justify-center h-[3rem]">
                                                <Image src={pr.details.imgLink} className="w-[60px] h-[60px] object-cover rounded-md shadow-md" />
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex items-center justify-center h-[3rem]">
                                                <span className="text-lg font-blinker text-stone-500">
                                                    {pr.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex items-center justify-center h-[3rem]">
                                                <span className="text-lg font-blinker text-stone-500">
                                                    R$ {convertToFixed(pr.value)}
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex items-center justify-center h-[3rem]">
                                                <span className="text-lg font-blinker text-stone-500">
                                                    {pr.quantity}
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex flex-row gap-3 items-center justify-center h-[3rem]">
                                                <Link to={`../product/${pr.id}`}>
                                                    <button className="p-1 bg-emerald-500 rounded-md text-stone-50 border-[1px] border-emerald-500 hover:bg-emerald-400 hover:border-emerald-400 transition-all font-blinker w-[5rem]">
                                                        Detalhes
                                                    </button>
                                                </Link>
                                                <button onClick={() => handleShowModal(pr.id, pr.name)} className="p-1 border-rose-500 border-[1px] rounded-md text-rose-500 hover:border-rose-300 hover:text-rose-300 transition-all font-blinker w-[5rem]">
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
                    <Link to="../new-product">
                        <button className="font-blinker bg-sky-500 p-2 rounded-lg text-stone-50 hover:bg-sky-300 text-lg transition-all flex flex-row gap-1 items-center">
                            <PlusCircle size={20} weight="fill" />
                            Novo Produto
                        </button>
                    </Link>
                </div>

                <Info_Modal productName={selectedProductName} productID={selectedProductID} />

            </article>
        </section>
    )
}

export default Products