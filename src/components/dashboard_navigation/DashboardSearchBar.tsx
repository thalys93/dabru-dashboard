import { MagnifyingGlass } from '@phosphor-icons/react';
import { Stack , Form, InputGroup } from 'react-bootstrap'

interface searchBarProps {
    queryText: string;
    onSearchItem: (query: string) => void;
}

function DashboardSearchBar(props: searchBarProps) {
    const handleSearch = (query: string) => {
        props.onSearchItem(query)
    }
    return (
        <Stack direction="horizontal">
            <InputGroup className='flex items-center text-stone-400 w-[50rem]'>
                <InputGroup.Text className='bg-transparent border-0'>
                    <MagnifyingGlass  weight='light'/>
                </InputGroup.Text>                
                <Form.Control type="text" onChange={(e) => handleSearch(e.target.value)} placeholder='Pesquise Algo' className='border-1 rounded border-stone-200'/>
            </InputGroup>
        </Stack>
    )
}

export default DashboardSearchBar