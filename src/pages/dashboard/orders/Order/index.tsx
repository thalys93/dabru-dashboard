import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getCustomers, getOrdersByID } from '../../../../utils/api/financial';
import { useCookies } from 'react-cookie';
import { getProducts } from '../../../../utils/api/product';

function Order() {
  const { id } = useParams();
  const [cookies] = useCookies(['authToken']);
  const [order, setOrder] = React.useState({} as any)
  const [productList, setProductList] = React.useState([])


  useEffect(() => {
    const fetchData = async () => {
      const orderRes = await getOrdersByID(id, cookies.authToken);
      console.log('Order Response:', orderRes); // Log para verificar a resposta da ordem

      if (orderRes.statusCode === 302) {
        const [customersRes, productsRes] = await Promise.all([
          getCustomers(cookies.authToken),
          getProducts(),
        ]);

        console.log('Customers Response:', customersRes); // Log para verificar a resposta dos clientes
        console.log('Products Response:', productsRes); // Log para verificar a resposta dos produtos

        const customers = customersRes.data;
        const products = productsRes.data;

        const orderWithDetails = orderRes.data.map((order: any) => {
          const customer = customers.find((c: any) => c.id === order.customer_id);
          const product = products.find((p: any) => p.id === order.product_id);

          return {
            ...order,
            customerName: customer ? customer.name : 'Cliente não encontrado',
            productName: product ? product.name : 'Produto não encontrado',
          };
        });

        console.log('Order with Details:', orderWithDetails); // Log para verificar a ordem com detalhes
        return setOrder(orderWithDetails);
      }
    };

    fetchData()
    console.log('Order:', order); // Log para verificar a ordem    
  }, [])



  return (
    <div>Order</div>
  )
}

export default Order