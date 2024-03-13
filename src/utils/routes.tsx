
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Index from '../Index';
import Login from '../pages/login';
import { useEffect } from 'react';
import Dashboard from '../pages/dashboard';
import Products from '../pages/dashboard/products';
import Home from '../pages/dashboard/home';
import New_Product from '../pages/dashboard/products/NewProduct';
import Product from '../pages/dashboard/products/Product';
import User_Page from '../pages/dashboard/user_page';
import Orders from '../pages/dashboard/orders';
import Error_Element from '../components/error';
import Support from '../pages/dashboard/support';
import Order from '../pages/dashboard/orders/Order';
import New_Order from '../pages/dashboard/orders/NewOrder';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Index />,                
        children: [
            {
                path: '/auth/login',
                element: <Login />,
            }
        ]
    },
    {
        path: 'dashboard/',
        element: <Dashboard />,           
        children: [
            {
                path: 'home',
                element: <Home />,
            },
            {
                path: 'products',
                element: <Products />              
            },
            {
                path: 'new-product',
                element: <New_Product />
            },
            {
                path: 'product/:id',
                element: <Product />
                
            },
            {                
                path: 'profile/:id',
                element: <User_Page/>
            },
            {
                path: 'orders', 
                element: <Orders/>              
            },
            { 
                path: 'orders/:id',
                element: <Order/>
            },
            { 
                path: 'orders/new',
                element: <New_Order/>
            },
            {
                path: 'statistics',
                element: <Error_Element pageName="Estatísticas" title={<span>Página ainda não <br /> implementada</span>} message='Em Breve , estatísticas..' errorCode={404}/>
            },
            {
                path: 'finances',
                element: <Error_Element pageName="Finanças" title={<span>Página ainda não <br /> implementada</span>} message='Em Breve , finanças..' errorCode={404}/>
            },
            {
                path: 'settings',
                element: <Error_Element pageName='Configurações' title={<span>Página ainda não <br /> implementada</span>} message='Em Breve , configurações..' errorCode={404}/>
            },
            {
                path: 'support',
                element: <Support/>
            }
        ]
    }
])

function Routes() {

    useEffect(() => {
        const redirectToLogin = () => {
            if (window.location.pathname === '/') {
                window.location.href = '/auth/login';
            }
        };
        redirectToLogin();
    }, []);

    return (
        <RouterProvider router={router} />
    )
}

export default Routes