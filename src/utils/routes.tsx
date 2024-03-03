
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Index from '../Index';
import Login from '../pages/login';
import { useEffect } from 'react';
import Dashboard from '../pages/dashboard';
import ErrorPage from '../components/error';
import Products from '../pages/dashboard/products';
import Home from '../pages/dashboard/home';
import New_Product from '../pages/dashboard/products/NewProduct';
import Product from '../pages/dashboard/products/Product';

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
        path: 'Dashboard/',
        element: <Dashboard />,
        errorElement: <ErrorPage />,
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
                path: 'orders',
                children: [
                    {
                        path: 'order/:id'
                    },
                    {
                        path: 'order-Add'
                    },
                    {
                        path: 'order-Edit/:id'
                    }
                ]
            },
            {
                path: 'atelie',
            },
            {
                path: 'statistics'
            },
            {
                path: 'finances'
            },
            {
                path: 'settings'
            },
            {
                path: 'support'
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