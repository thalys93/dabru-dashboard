import { Container, Figure, Row } from "react-bootstrap"

interface errorProps {
  pageName: string
  title?: string | JSX.Element
  errorCode?: number
  message?: string
}

function Error_Element({ ...props }: errorProps) {

  return (
    <Container fluid className='h-screen'>
      <Row>
        <div className='flex flex-col items-start'>
          <span className="font-blinker uppercase text-md text-stone-400 pb-2 pt-3 select-none"> {props.pageName} </span>
          <div className='w-[10rem] bg-stone-300 h-[1px]'></div>
        </div>

        <div className='flex flex-col items-center pt-[5rem]'>
          <h1 className='text-3xl text-stone-300 font-abel select-none'> {props.title} {props.errorCode}</h1>
          <Figure>
            <Figure.Image src="/svg/error.svg" alt="404" className='w-[15rem] h-[15rem]' />
            <Figure.Caption className='text-center text-stone-400 font-blinker select-none'>{props.message}</Figure.Caption>
          </Figure>
        </div>
      </Row>
    </Container>
  )
}

export default Error_Element