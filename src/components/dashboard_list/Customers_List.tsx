import { useEffect, useState } from 'react'
import { Table } from 'react-bootstrap'
import Customers_placeholder from './Customers_placeholder'
import { CheckCircle, Clock, FolderSimpleDashed, Info, Warehouse, XCircle } from '@phosphor-icons/react'
import { getCustomers, getOrders } from '../../utils/api/financial'
import { useCookies } from 'react-cookie'

export interface TableProps {
    index: number,
    id: string,
    customer_name: string,
    items: number,
    date: string,
    status: string,
    total: string,
    color?: string,
    icon?: JSX.Element
}


function Customers_List() {
    const [CustomersData, setCustomersData] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [cookies] = useCookies(['authToken'])

    // useEffect(() => {
    //     const FetchData = async () => {
    //         try {
    //             const res = Customers
    //             setIsLoading(true)
    //             await new Promise((resolve) => setTimeout(resolve, 2000))
    //             if (res !== undefined) {
    //                 setCustomersData(res as never)
    //             } else {
    //                 setCustomersData([] as never)
    //             }
    //             setIsLoading(false)
    //         } catch (e) {
    //             console.error(e)
    //         }
    //     }
    //     FetchData()
    // }, [])

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            getOrders(cookies.authToken).then((res) => {
                if (res !== undefined) {
                    getCustomers(cookies.authToken).then((customers) => {
                        const customerById = customers.found.reduce((acc: any, curr: any) => {
                            acc[curr.id] = curr
                            return acc
                        }, {})
                        const formattedData = res.found.map((item: any) => ({
                            index: item.id,
                            id: item.id,
                            customer_name: customerById[item.customer_].name,
                            items: item.cartItems.length,
                            date: new Date(item.date).toLocaleDateString('pt-br'),
                            status: item.status,
                            total: item.total,
                        }));
                        setCustomersData(formattedData as never)
                        setIsLoading(false)
                    })
                } else {
                    setIsLoading(false)
                    setCustomersData([] as never)
                }
            })
        }
        fetchData()
    }, [])

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

            const updatedCustomersData = CustomersData.map((item: TableProps) => {
                const color = colorMap[item.status] || '#059669';
                const icon = checkMap[item.status] || null;

                return { ...item, color, icon };
            });

            if (JSON.stringify(updatedCustomersData) !== JSON.stringify(CustomersData)) {
                setCustomersData(updatedCustomersData as never);
            }
        }
        checkStatus()
    }, [CustomersData])



    return isLoading ? (
        <Customers_placeholder />
    ) : (
        <Table className='w-full' bordered striped hover>
            <thead>
                <tr className='font-blinker text-stone-400 font-extralight select-none'>
                    <th> Nº </th>
                    <th> ID do Pedido </th>
                    <th> Nome Cliente </th>
                    <th> Items </th>
                    <th> Data do Pedido </th>
                    <th> Preço </th>
                    <th> Ações </th>
                    <th> Status </th>
                </tr>
            </thead>
            <tbody>
                {CustomersData.length === 0 ? (
                    <>
                        <tr>
                            <td colSpan={8} className='text-stone-500 font-blinker font-light text-center text-lg'>Nenhum dado encontrado</td>
                        </tr>
                    </>
                ) : CustomersData?.map((item: TableProps, index: number) => (
                    <tr className='select-none font-blinker text-stone-500 items-center' key={item.id}>
                        <td>{index + 1}</td>
                        <td>{item.id}</td>
                        <td>{item.customer_name}</td>
                        <td>{item.items}</td>
                        <td>{item.date}</td>
                        <td>
                            {item.total} R$
                        </td>
                        <td>
                            <div className='bg-sky-500 p-1 rounded-lg shadow-lg text-stone-50 hover:bg-sky-300 hover:text-stone-50 transition-all cursor-pointer flex flex-row gap-1 items-center justify-center'>
                                <Info size={20} weight='fill' />
                                <span>Detalhes</span>
                            </div>
                        </td>
                        <td>
                            <div className='p-1 rounded flex flex-row gap-1 items-center justify-center' style={{ backgroundColor: item.color, color: '#FAFAFA' }}>
                                {item.icon}
                                <span>{item.status}</span>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    )
}

export default Customers_List