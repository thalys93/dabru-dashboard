import { Placeholder, Table } from 'react-bootstrap'

function Customers_placeholder() {
    const placeholderData = [1,2,3,4,5,6,7]

  return (
    <Table className='w-full'>
            <thead>
                <tr className='font-blinker text-stone-400 font-extralight select-none'>
                    <th> Nº </th>
                    <th> ID do Pedido </th>
                    <th> Nome Cliente </th>
                    <th> Items </th>
                    <th> Data do Pedido </th>
                    <th> Status </th>
                    <th> Preço </th>
                    <th> ### </th>
                </tr>
            </thead>
            <tbody>
                {placeholderData.map((index: number) => (
                    <tr className='select-none font-blinker text-stone-500 items-center' key={index}>
                        <Placeholder as='td' animation="wave">
                            <Placeholder xs={10} />
                        </Placeholder>

                        <Placeholder as='td' animation="glow">
                            <Placeholder xs={10} />
                        </Placeholder>
                        <Placeholder as='td' animation="wave">
                            <Placeholder xs={10} />
                        </Placeholder>

                        <Placeholder as='td' animation="wave">
                            <Placeholder xs={10} />
                        </Placeholder>

                        <Placeholder as='td' animation="wave">
                            <Placeholder xs={10} />
                        </Placeholder>
                        <Placeholder as='td' animation="wave">                            
                                <Placeholder xs={10} />                            
                        </Placeholder>
                        <Placeholder as='td' animation="wave">                            
                                <Placeholder xs={10} />                            
                        </Placeholder>
                        <td>
                            <span className='bg-sky-500 pl-5 pr-5 rounded-lg animate-pulse shadow-lg text-stone-50 hover:bg-sky-300 hover:text-stone-50 transition-all cursor-wait'>
                            </span>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
  )
}

export default Customers_placeholder