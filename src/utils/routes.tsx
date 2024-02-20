
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Index from '../Index';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Index />,        
    },
])

function Routes() {
    return (
        <RouterProvider router={router} />
    )
}

export default Routes