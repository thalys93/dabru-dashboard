import { ArrowDown, ArrowUp, Placeholder } from "@phosphor-icons/react"
import { useEffect, useState } from "react"
import { Col, Container, Row } from "react-bootstrap"

interface CardProps {
  title: string,
  value: string,
  icon: JSX.Element,
  color: string
  percent: string
}

function Cards({ ...props }: CardProps) {
  
  const [negativeClass, setNegativeClass] = useState('')
  const [trend, setTrend] = useState('')

  const checkPositivePercent = (percent: string) => {
    if (percent.includes('-')) {
      setNegativeClass('text-red-500')
      setTrend('down')      
    } else if (percent.includes('+')) {
      setNegativeClass('text-green-500')
      setTrend('up')      
    } else {
      setNegativeClass('text-stone-500')
      setTrend('flat')      
    }
  }

  useEffect(() => {
    checkPositivePercent(props?.percent);
  }, [props.percent]);

  return (
    <Container fluid>
      <Row className="items-center shadow-md shadow-stone-600 border-stone-400 border-1 p-3 w-[15rem] animate__animated animate__fadeInDown">
        <Col>
          <section className="flex flex-row items-center justify-start gap-1">
            <div className="h-[4rem] w-[0.5rem] mr-4" style={{ backgroundColor: props?.color }}></div>
            <div className="flex flex-col mr-5">
              <h1 className="font-blinker text-stone-400 font-light capitalize text-xl select-none">{props?.title}</h1>
              <span className="font-blinker text-stone-500 font-regular text-2xl select-none mb-3">{props?.value}</span>
            </div>

            <div className="flex items-center justify-center text-3xl mb-3" style={{ color: props?.color }}>
              {props?.icon}
            </div>

          </section>

          <div className="flex flex-row gap-1 items-center">
            {trend && (
              <>
                {trend === 'up' && <ArrowUp className={`font-blinker ${negativeClass} font-light select-none`} />}
                {trend === 'down' && <ArrowDown className={`font-blinker ${negativeClass} font-light select-none`} />}
                {trend === 'flat' && <Placeholder className={`font-blinker ${negativeClass} font-light select-none`} />}
              </>
            )}
            <span className={`font-blinker ${negativeClass} font-light text-sm select-none`}>{props?.percent}</span>
            <span className="font-blinker text-sm text-stone-500 lowercase"> Nas Ultimas semanas</span>
          </div>

        </Col>
      </Row>
    </Container>
  )
}

export default Cards