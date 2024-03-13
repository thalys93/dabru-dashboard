import { useState, useEffect } from "react"
import { Col, Container, FloatingLabel, Form, Row, Spinner } from "react-bootstrap"
import { useCookies } from "react-cookie";
import { Slide, ToastContainer, toast } from "react-toastify";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import { APIproduct, getProducts } from "../../../../utils/api/product";
import * as formik from 'formik';
import * as yup from 'yup';

function New_Order() {
  const [products, setProducts] = useState()
  const [loading, setLoading] = useState(false)
  const [cookies] = useCookies(['authToken'])
  const navigate = useNavigate()
  const { Formik } = formik;

  const newOrderSchema = yup.object().shape({
    clientFirstName: yup.string().required('Campo obrigatório'),
    clientLastName: yup.string().required('Campo obrigatório'),
    street: yup.string().required('Campo obrigatório'),
    number: yup.string().required('Campo obrigatório'),
    complement: yup.string().required('Campo obrigatório'),
    city: yup.string().required('Campo obrigatório'),
    state: yup.string().required('Campo obrigatório'),
    zipCode: yup.string().required('Campo obrigatório'),
    country: yup.string().required('Campo obrigatório'),
    paymentForm: yup.string().required('Campo obrigatório'),
    total: yup.number().required('Campo obrigatório'),
    products: yup.array().of(
      yup.object().shape({
        id: yup.string().required('Campo obrigatório'),
        quantity: yup.number().required('Campo obrigatório'),
      })
    ).required('Campo obrigatório'),
    status: yup.string().required('Campo obrigatório')
  })

  const initialValues = {
    clientFirstName: '',
    clientLastName: '',
    street: '',
    number: '',
    complement: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    paymentForm: '',
    total: '',
    products: [
      {
        id: '',
        quantity: 0
      }
    ],
    status: ''
  }

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const res = await new Promise((resolve) => {
          getProducts().then((res) => {                                   
            resolve(res)            
          })
        })                       
        setProducts(res.found)
      } catch (e) {
        console.log(e)
        setLoading(false)
      }
    }
    fetchProducts()
        
  }, [])



  return (
    <section className="flex flex-col items-start justify-start m-3">
      <Helmet>
        <title>Dashboard - Novo Pedido </title>
      </Helmet>

      <h1 className="text-xl font-blinker text-stone-400 select-none">Cadastrar um Pedido </h1>
      <div className='w-[rem] h-[1px] bg-stone-300'></div>
      <article className="h-full w-full mt-3">
        <Container>
          <Formik validationSchema={newOrderSchema} initialValues={initialValues} onSubmit={console.log}>
            {({ handleSubmit, handleChange, values, touched, errors }) => {
              return (
                <Form noValidate onSubmit={handleSubmit}>
                  <Row>
                    <Col sm>
                      <h1 className="text-xl font-blinker text-stone-400 select-none mb-3"> Dados do Cliente </h1>
                      <Form.Group className="flex flex-col lg:flex-row gap-3 lg:mb-5">
                        <FloatingLabel label="Nome do Cliente">
                          <Form.Control
                            type="text"
                            name="client"
                            value={values.clientFirstName}
                            onChange={handleChange}
                            isInvalid={touched.clientFirstName && !!errors.clientFirstName}
                          />
                          <Form.Control.Feedback type="invalid">{errors.clientFirstName}</Form.Control.Feedback>
                        </FloatingLabel>

                        <FloatingLabel label="Sobre Nome">
                          <Form.Control
                            type="text"
                            name="client"
                            value={values.clientLastName}
                            onChange={handleChange}
                            isInvalid={touched.clientLastName && !!errors.clientLastName}
                          />
                          <Form.Control.Feedback type="invalid">{errors.clientLastName}</Form.Control.Feedback>
                        </FloatingLabel>
                      </Form.Group>

                      <h1 className="text-xl font-blinker text-stone-400 select-none mb-3"> Endereço </h1>
                      <Form.Group className="flex flex-col lg:flex-row gap-3 lg:mb-5">
                        <FloatingLabel label="Rua">
                          <Form.Control
                            type="text"
                            name="street"
                            value={values.street}
                            onChange={handleChange}
                            isInvalid={touched.street && !!errors.street}
                          />
                          <Form.Control.Feedback type="invalid">{errors.street}</Form.Control.Feedback>
                        </FloatingLabel>

                        <FloatingLabel label="Complemento">
                          <Form.Control
                            type="string"
                            name="complement"
                            value={values.complement}
                            onChange={handleChange}
                            isInvalid={touched.complement && !!errors.complement}
                          />
                          <Form.Control.Feedback type="invalid">{errors.complement}</Form.Control.Feedback>
                        </FloatingLabel>

                        <FloatingLabel label="Número">
                          <Form.Control
                            type="string"
                            name="number"
                            value={values.number}
                            onChange={handleChange}
                            isInvalid={touched.number && !!errors.number}
                            className="w-1/2"
                          />
                        </FloatingLabel>

                      </Form.Group>

                      <Form.Group className="flex flex-col lg:flex-row gap-3 lg:mb-5">
                        <FloatingLabel label="CEP">
                          <Form.Control
                            type="text"
                            name="zipCode"
                            value={values.zipCode}
                            onChange={handleChange}
                            isInvalid={touched.zipCode && !!errors.zipCode}
                          />
                          <Form.Control.Feedback type="invalid">{errors.zipCode}</Form.Control.Feedback>
                        </FloatingLabel>

                        <FloatingLabel label="Cidade">
                          <Form.Control
                            type="string"
                            name="city"
                            value={values.city}
                            onChange={handleChange}
                            isInvalid={touched.city && !!errors.city}                            
                          />
                          <Form.Control.Feedback type="invalid">{errors.city}</Form.Control.Feedback>
                        </FloatingLabel>                        

                        <FloatingLabel label="Estado">
                          <Form.Control
                            type="string"
                            name="state"
                            value={values.state}
                            onChange={handleChange}
                            isInvalid={touched.state && !!errors.state}
                            className="w-1/2"
                          />
                          <Form.Control.Feedback type="invalid">{errors.state}</Form.Control.Feedback>
                        </FloatingLabel>
                      </Form.Group>     

                      <h1 className="text-xl font-blinker text-stone-400 select-none mb-1"> Produtos </h1>      
                      <div className="w-[10rem] h-[0.5px] bg-stone-400 mb-[1rem]"></div>

                      <Form.Select>
                                            
                      </Form.Select>
                    </Col>

                    <Col sm>
                      <h1 className="text-xl font-blinker text-stone-400 select-none mb-3"> Pagamento </h1>
                      <Form.Group className="flex flex-col gap-3">
                        <FloatingLabel controlId="paymentForm" label="Forma de Pagamento">
                          <Form.Control
                            type="text"
                            name="paymentForm"
                            value={values.paymentForm}
                            onChange={handleChange}
                            isInvalid={touched.paymentForm && !!errors.paymentForm}
                          />
                          <Form.Control.Feedback type="invalid">{errors.paymentForm}</Form.Control.Feedback>
                        </FloatingLabel>

                        <FloatingLabel controlId="total" label="Total">
                          <Form.Control
                            type="number"
                            name="total"
                            value={values.total}
                            onChange={handleChange}
                            isInvalid={touched.total && !!errors.total}
                          />
                          <Form.Control.Feedback type="invalid">{errors.total}</Form.Control.Feedback>
                        </FloatingLabel>
                      </Form.Group>
                    </Col>
                  </Row>
                </Form>
              )
            }}
          </Formik>
        </Container>
      </article>
    </section>
  )
}

export default New_Order