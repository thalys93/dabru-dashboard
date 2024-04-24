import { Spinner } from 'react-bootstrap'
import React, { Suspense, lazy, useEffect, useState } from 'react'
import { ClipboardText, Money, Package, Users } from '@phosphor-icons/react'
import Pie_Chart from '../../../components/dashboard_charts/Pie_Chart'
import { useCookies } from 'react-cookie'
import { countOrders, countSales, getOrderPayments, getOrders, getOrdersStatuses, sumCustomers, sumOrdersTotals } from '../../../utils/api/financial'


const Card = lazy(() => delayStateOfCards(import('./../../../components/dashboard_cards/Cards')))
const Customers_List = lazy(() => delayState(import('./../../../components/dashboard_list/Customers_List')))

async function delayStateOfCards(promise: Promise<typeof import("./../../../components/dashboard_cards/Cards")>) {
  await new Promise(resolve => {
    setTimeout(resolve, 3500)
  })
  return promise
}

async function delayState(promise: Promise<typeof import("./../../../components/dashboard_list/Customers_List")>) {
  await new Promise(resolve => {
    setTimeout(resolve, 3500)
  })
  return promise
}

interface ResumeCard {
  id: number,
  title: string,
  value: string | number,
  icon: JSX.Element,
  color: string,
  percent: string
}

interface CardWithDelayProps {
  card: ResumeCard,
  delay: number
}

interface ChartsWithDelayProps {
  delay: number
}

const ChartsWithDelay: React.FC<ChartsWithDelayProps> = ({ delay }) => {
  const [isReady, setIsReady] = useState(false)
  const [ordersData, setOrdersData] = useState([])
  const [ordersPayments, setOrdersPayments] = useState([])

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay]);

  const [cookies] = useCookies(['authToken'])

  useEffect(() => {
    const fetchData = async () => {
      Promise.all([
        getOrdersStatuses(cookies.authToken),
        getOrderPayments(cookies.authToken)
      ]).then((values) => {
        const ordersData = values[0];
        const ordersPayments = values[1];

        console.log(values);


        setOrdersData(ordersData);
        setOrdersPayments(ordersPayments);
      }).catch((err) => {
        console.log(err);
      })
    }

    fetchData()
  }, [])

  return isReady ? (
    <div className='flex lg:flex-row flex-col flex-grow-0 shrink-0'>
      <Pie_Chart dataItems={ordersData as never} type="Vendas" id='1' />
      <Pie_Chart dataItems={ordersPayments as never} type="Pedidos" id='2' />
    </div>
  ) : (
    <div className='m-3'>
      <Spinner />
    </div>
  );
};


const CardWithDelay: React.FC<CardWithDelayProps> = ({ card, delay }) => {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay]);

  return isReady ? (
    <div className='hover:scale-95 transition-all duration-300'>
      <Card
        title={card.title}
        value={card.value as never}
        icon={card.icon}
        color={card.color}
        percent={card.percent}
      />
    </div>
  ) : (
    <div className='m-3'>
      <Spinner />
    </div>
  );
};

function Home() {
  const [cookies] = useCookies(['authToken'])
  const [ordersNumber, setOrdersNumber] = useState(0)
  const [percentCustomers, setPercentCustomers] = useState('')
  const [customersNumber, setCustomersNumber] = useState(0)
  const [percentSales, setPercentSales] = useState('')
  const [salesNumber, setSalesNumber] = useState(0)
  const [percentOrders, setPercentOrders] = useState('')
  const [allOrders, setAllOrders] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      Promise.all([
        countOrders(cookies.authToken),
        sumCustomers(cookies.authToken),
        sumOrdersTotals(cookies.authToken),
        countSales(cookies.authToken),
        getOrders(cookies.authToken)
      ]).then((values) => {
        console.log(values);
        const ordersNumber = values[0].pedidos;
        const customersNumber = values[1].clientes;
        const salesNumber = values[3].Vendas;
        const cancelledNumber = values[3].Canceladas;
        const allOrders = values[4].found;      

        setOrdersNumber(ordersNumber);
        setCustomersNumber(customersNumber);
        setSalesNumber(salesNumber);
        setAllOrders(allOrders);

        const percentCustomers = percentCalc(customersNumber);
        const percentSales = percentCalc(salesNumber - cancelledNumber);
        const percentOrders = percentCalc(ordersNumber);

        setPercentCustomers(percentCustomers);
        setPercentSales(percentSales);
        setPercentOrders(percentOrders);

      }).catch((err) => {
        console.log(err);
      })
    }

    fetchData()
  }, [])

  const diaryResumeCards = [
    { id: 1, title: 'Clientes', value: customersNumber, icon: <Users />, color: '#0EA5E9', percent: percentCustomers },
    { id: 2, title: 'Vendas', value: `R$ ${salesNumber}`, icon: <Money />, color: '#255853', percent: percentSales },
    { id: 4, title: 'Pedidos', value: ordersNumber, icon: <ClipboardText />, color: '#B01AAA', percent: percentOrders }
  ]

  function percentCalc(value: number) {
    const referenceValue = 100;
    const percent = (value / referenceValue) * 100;

    if (percent > 0) {
      return `+${percent.toFixed(2)} %`;
    } else if (percent < 0) {
      return `${percent.toFixed(2)} %`;
    } else {
      return `${percent.toFixed(2)} %`;
    }
  }

  return (
    <section className='flex flex-col items-start justify-start m-3'>
      <article className='mb-5'>
        <span className='font-blinker text-stone-400 uppercase select-none text-md'>Seu Resumo Diário</span>
        <div className='w-[10rem] h-[1px] bg-stone-300'></div>
        <div className='flex flex-row gap-4 flex-grow-0 shrink-0'>
          {diaryResumeCards.map((card: ResumeCard, i: number) => (
            <Suspense key={i} fallback={<div className='m-3'><Spinner /></div>}>
              <CardWithDelay card={card} delay={i * 2000} />
            </Suspense>
          ))}
        </div>
      </article>
      <article className='mb-5'>
        <span className='font-blinker text-stone-400 uppercase select-none text-md'>Estatísticas</span>
        <div className='w-[10rem] h-[1px] bg-stone-300'></div>
        <Suspense fallback={<div className='m-3'><Spinner /></div>}>
          <ChartsWithDelay delay={3500} />
        </Suspense>
      </article>
      <article className='mb-5'>
        <span className='font-blinker text-stone-400 uppercase select-none text-md'>Últimos Pedidos</span>
        <div className='w-[10rem] h-[1px] bg-stone-300'></div>
        <div>
          <Suspense fallback={<div className='m-3'><Spinner /></div>}>
            <Customers_List/>
          </Suspense>
        </div>
      </article>
    </section>
  )
}

export default Home