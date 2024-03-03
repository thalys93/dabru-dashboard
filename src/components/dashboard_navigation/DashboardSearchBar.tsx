import { MagnifyingGlass } from '@phosphor-icons/react';
import { Container, Form, InputGroup } from 'react-bootstrap'

interface searchBarProps {
    queryText: string;
    onSearchItem: (query: string) => void;
}

function DashboardSearchBar(props: searchBarProps) {
    const handleSearch = (query: string) => {
        props.onSearchItem(query)
    }
    return (
        <Container>
            <div className='flex items-center text-stone-400'>                
                <InputGroup.Text className='bg-transparent border-0'>
                    <MagnifyingGlass  weight='light'/>
                </InputGroup.Text>                
                <Form.Control type="text" onChange={(e) => handleSearch(e.target.value)} placeholder='Pesquise Algo' className='border-0'/>
            </div>
        </Container>
    )
}

export default DashboardSearchBar