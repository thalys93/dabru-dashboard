import { Spinner } from 'react-bootstrap'
import React, { Suspense, lazy, useEffect, useState } from 'react'
import { ClipboardText, Money, Package, Users } from '@phosphor-icons/react'
import Pie_Chart from '../../../components/dashboard_charts/Pie_Chart'

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
  value: string,
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

  const vendasData = [
    { id: '1', value: 50, label: 'Dinheiro', color: '#0ee932' },
    { id: '2', value: 20, label: 'Cartão de Crédito', color: '#0eb6e9' },
    { id: '3', value: 5, label: 'Cartão de Débito', color: '#222222' },
    { id: '4', value: 5, label: 'Pix', color: '#B01AAA' }
  ]

  const lucroData = [
    { id: '1', value: 10, label: 'Pendentes', color: '#222222' },
    { id: '2', value: 2, label: 'Em Andamento', color: '#0EA5E9' },
    { id: '3', value: 10, label: 'Finalizado', color: '#0ee93d' },
    { id: '4', value: 5, label: 'Cancelado', color: '#B01AAA' }
  ]

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay]);

  return isReady ? (
    <div className='flex lg:flex-row flex-col flex-grow-0 shrink-0'>
      <Pie_Chart dataItems={vendasData as never} type="Vendas" id='1' />
      <Pie_Chart dataItems={lucroData as never} type="Pedidos" id='2' />
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
        value={card.value}
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
  const diaryResumeCards = [
    { id: 1, title: 'Clientes', value: '1000', icon: <Users />, color: '#0EA5E9', percent: '+10%' },
    { id: 2, title: 'Vendas', value: 'R$ 15,00', icon: <Money />, color: '#255853', percent: '-20%' },
    { id: 3, title: 'Lucro', value: '80%', icon: <Package />, color: '#80B01A', percent: '+5%' },
    { id: 4, title: 'Pedidos', value: '30', icon: <ClipboardText />, color: '#B01AAA', percent: '-2%' }
  ]

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
            <Customers_List />
          </Suspense>
        </div>
      </article>
    </section>
  )
}

export default Home