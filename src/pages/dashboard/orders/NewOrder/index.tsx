/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react"
import { Col, Container, FloatingLabel, Form, Image, InputGroup, ListGroup, ListGroupItem, Row, Spinner } from "react-bootstrap"
import { useCookies } from "react-cookie";
import { Slide, ToastContainer, toast } from "react-toastify";
import { Helmet } from "react-helmet";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import { APIproduct, getProducts } from "../../../../utils/api/product";
import * as formik from 'formik';
import * as yup from 'yup';
import { AxiosResponse } from "axios";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import inputMask from 'react-input-mask';


function New_Order() {
  const [products, setProducts] = useState<APIproduct[]>([])
  const [loading, setLoading] = useState(false)
  const [inputLoading, setInputLoading] = useState(false)
  const [street, setStreet] = useState('')
  const [complement, setComplement] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [cookies] = useCookies(['authToken'])
  const navigate = useNavigate()
  const { Formik } = formik;

  const newOrderSchema = yup.object().shape({
    clientFirstName: yup.string().required('Campo obrigatório'),
    clientLastName: yup.string().required('Campo obrigatório'),
    number: yup.string().required('Campo obrigatório'),
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
    number: '',
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
        await new Promise((resolve) => {
          getProducts().then((res) => {
            if (res.statusCode === 200) {
              setProducts(res.found)
              setLoading(false)
              resolve(res)
            }
          })
        })
      } catch (e) {
        console.log(e)
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])


  const checkCEP = async (cep: string) => {
    setInputLoading(true)
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
      const data = await response.json()

      if (data.erro) {
        setInputLoading(false)
        console.log("CEP inválido")
        return
      } else {
        setStreet(data.logradouro)
        setCity(data.localidade)
        setComplement(data.complemento)
        setState(data.uf)
        setTimeout(() => {
          setInputLoading(false)
        }, 1500)
      }

    } catch (e) {
      console.log(e)
      setInputLoading(false)
    }
  }


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
                        <FloatingLabel label="Nome">
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

                        <FloatingLabel label="CEP">
                          <Form.Control
                            type="text"
                            as={inputMask}
                            mask="99999-999"
                            name="zipCode"
                            value={values.zipCode}
                            onChange={handleChange}
                            onBlur={(e: React.FocusEvent<HTMLInputElement>) => checkCEP(e.target.value)}
                            isInvalid={touched.zipCode && !!errors.zipCode}
                          />
                          <Form.Control.Feedback type="invalid">{errors.zipCode}</Form.Control.Feedback>
                        </FloatingLabel>

                        {inputLoading ? (
                          <FloatingLabel label="Rua" className="animate-pulse">
                            <Form.Control
                              type="text"
                              name="street"
                              value={street}
                              onChange={(e) => setStreet(e.target.value)}
                              required
                              disabled
                            />
                          </FloatingLabel>
                        ) : (
                          <FloatingLabel label="Rua">
                            <Form.Control
                              type="text"
                              name="street"
                              value={street}
                              onChange={(e) => setStreet(e.target.value)}
                              required
                            />
                          </FloatingLabel>
                        )}

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
                        {inputLoading ? (
                          <FloatingLabel label="Complemento" className="animate-pulse">
                            <Form.Control
                              type="string"
                              name="complement"
                              value={complement}
                              onChange={(e) => setComplement(e.target.value)}
                              required
                            />
                          </FloatingLabel>
                        ) : (
                          <FloatingLabel label="Complemento">
                            <Form.Control
                              type="string"
                              name="complement"
                              value={complement}
                              onChange={(e) => setComplement(e.target.value)}
                              required
                            />
                          </FloatingLabel>
                        )}

                        {inputLoading ? (
                          <FloatingLabel label="Cidade" className="animate-pulse">
                            <Form.Control
                              type="string"
                              name="city"
                              value={city}
                              onChange={(e) => setCity(e.target.value)}
                              required
                              disabled
                            />
                          </FloatingLabel>
                        ) : (
                          <FloatingLabel label="Cidade">
                            <Form.Control
                              type="string"
                              name="city"
                              value={city}
                              onChange={(e) => setCity(e.target.value)}
                              required
                            />
                          </FloatingLabel>
                        )}

                        {inputLoading ? (
                          <FloatingLabel label="Estado" className="animate-pulse">
                            <Form.Control
                              type="string"
                              name="state"
                              value={state}
                              onChange={(e) => setState(e.target.value)}
                              required
                              disabled
                              className="w-1/2"
                            />
                          </FloatingLabel>
                        ) : (
                          <FloatingLabel label="Estado">
                            <Form.Control
                              type="string"
                              name="state"
                              value={state}
                              onChange={(e) => setState(e.target.value)}
                              required
                              className="w-1/2"
                            />
                          </FloatingLabel>
                        )}

                      </Form.Group>

                      <h1 className="text-xl font-blinker text-stone-400 select-none mb-1"> Produtos </h1>
                      <div className="w-[10rem] h-[0.5px] bg-stone-300 mb-[1rem]"></div>

                      <h2 className="m-2 font-blinker select-none text-stone-400">Selecione um ou mais produtos</h2>
                      <section className="overflow-auto h-[15rem] w-[32rem]">
                        {products.map((product: APIproduct, i: number) => {
                          return (
                            <ListGroup defaultActiveKey={i} className="w-[30rem]">
                              <ListGroup.Item className="flex flex-row items-center mt-3 justify-between">
                                <div className="flex flex-row gap-2 items-center">
                                  <Link to={`../../dashboard/product/${product.id}`}>
                                    <Image src={product.details.imgLink} alt={product.name} className="w-[50px] h-[50px] object-cover" />
                                  </Link>
                                  <div className="flex flex-col gap-1">
                                    <span className="text-stone-500 font-blinker text-lg">{product.name}</span>
                                    <Form.Check type="checkbox" label="Adicionar" />
                                  </div>
                                </div>
                                <div className="flex flex-row gap-0 items-center justify-center">
                                  <button type="button">
                                    <CaretLeft weight="fill" />
                                  </button>
                                  <span className="font-blinker">{product.quantity}</span>
                                  <button type="button">
                                    <CaretRight weight="fill" />
                                  </button>
                                </div>
                              </ListGroup.Item>
                            </ListGroup>
                          )
                        })}
                      </section>
                    </Col>

                    <Col sm>
                      <h1 className="text-xl font-blinker text-stone-400 select-none mb-3"> Pagamento </h1>
                      <Form.Group className="flex flex-col gap-3">
                        <FloatingLabel controlId="paymentForm" label="Forma de Pagamento">
                          {/* <Form.Control
                            type="text"
                            name="paymentForm"
                            value={values.paymentForm}
                            onChange={handleChange}
                            isInvalid={touched.paymentForm && !!errors.paymentForm}
                          /> */}
                          <Form.Select
                            name="paymentForm"
                            value={values.paymentForm}
                            onChange={handleChange}
                            isInvalid={touched.paymentForm && !!errors.paymentForm}
                          >
                            <option value="">Selecione uma opção</option>
                            <option value="credit">Crédito</option>
                            <option value="debit">Débito</option>
                            <option value="money">Dinheiro</option>
                            <option value="pix">Pix</option>
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">{errors.paymentForm}</Form.Control.Feedback>
                        </FloatingLabel>

                        <InputGroup>                          
                            <InputGroup.Text>R$</InputGroup.Text>
                            <Form.Control
                              type="number"
                              name="total"
                              placeholder="Total"
                              value={values.total}
                              onChange={handleChange}
                              isInvalid={touched.total && !!errors.total}
                            />
                            <Form.Control.Feedback type="invalid">{errors.total}</Form.Control.Feedback>                          
                        </InputGroup>
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