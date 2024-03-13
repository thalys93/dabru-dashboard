import { Col, Container, FloatingLabel, Form, Row, Spinner } from "react-bootstrap"
import ProductDrop from "../../../../components/product_image_drop/ProductDrop"
import { UploadResult, getDownloadURL, getStorage, ref as storageRef } from 'firebase/storage';
import { useUploadFile } from 'react-firebase-hooks/storage';
import { useState } from "react";
import * as formik from "formik"
import * as yup from "yup"
import { useCookies } from "react-cookie";
import { registerProduct } from "../../../../utils/api/product";
import { Slide, ToastContainer, toast } from "react-toastify";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import {v4  as uuidv4} from 'uuid';


export interface newProduct {
  id: string;
  name: string;
  description: string;
  dimensionX: number;
  dimensionY: number;
  type: string;
  quantity: number;
  price: number;
  ready: boolean;
  image: string;
  colors: string[];
  observations: string;
}

export interface ImageProps {
  name: string;
  size: number;
  type: string;
  path: string;
}

function New_Product() {
  const [colors, setColors] = useState(['#ffffff']);
  const [setWarn, setSetWarn] = useState(false);
  const [loading, setLoading] = useState(false)
  const [errorImage, setErrorImage] = useState(false)
  const [imagePath, setImagePath] = useState({})
  const [cookies] = useCookies(['authToken']);
  const [uploudFile] = useUploadFile();
  const { Formik } = formik;
  const navigate = useNavigate();

  const newProductSchema = yup.object().shape({
    name: yup.string().required('Nome do Produto é obrigatório'),
    description: yup.string().required('Descrição do Produto é obrigatório'),
    dimensionX: yup.number().required('Dimensão X é obrigatório'),
    dimensionY: yup.number().required('Dimensão Y é obrigatório'),
    type: yup.string().required('Tipo do Produto é obrigatório'),
    quantity: yup.number().required('Quantidade é obrigatório'),
    price: yup.number().required('Preço é obrigatório'),
    ready: yup.boolean(),
    observations: yup.string()
  })

  const handleImageDrop = (Image: ImageProps) => {
    setErrorImage(false);
    setImagePath(Image);
  }

  const handleSelectColor = (color: string, index: number) => {
    const updatedColors = [...colors];
    updatedColors[index] = color;
    setColors(updatedColors);
  }

  const ToastInformation = (code: number , message: string) => {
    if (code === 401) {
      return (
        <div className="flex flex-row gap-2 items-center justify-between">
          <span> {message} </span> 
          <span className="text-sm font-abel text-stone-400 mt-2"> {code} </span> 
        </div>
      )
    } else if (code === 500) {
      return (
        <div className="flex flex-row gap-2 items-center justify-between">
          <span> Erro Interno </span> 
          <span className="text-sm font-abel text-stone-400 mt-2"> {code} </span> 
        </div>
      )
    } else {
      return (
        <div className="flex flex-row gap-2 items-center justify-between">
          <span> {message} </span> 
          <span className="text-sm font-abel text-stone-400 mt-2"> {code} </span> 
        </div>
      )
    }
  }

  const handleSendData = async (values: newProduct) => {
    const sendFormData = {
      name: values.name,
      description: values.description,
      dimensionX: values.dimensionX,
      dimensionY: values.dimensionY,
      type: values.type,
      quantity: values.quantity,
      price: values.price,
      ready: values.ready,
      image: imagePath as ImageProps,
      colors: colors,
      observations: values.observations
    }

    toast.info('Cadastrando Produto...' , {transition: Slide})

    if (Object.keys(sendFormData.image).length === 0) {
      setErrorImage(true);
    } else {
      setLoading(true);
      setErrorImage(false);
      try {
        const UUID = uuidv4();
        const productRef = storageRef(getStorage(), `produtos/${UUID}`);
        const result = await uploudFile(productRef, sendFormData.image as never, { contentType: 'image/jpeg' }) as UploadResult
        toast.info('Enviando Imagem...' , {transition: Slide})

        if (result !== null) {
          const downloadURL = await getDownloadURL(result.ref) as string;

          const productData = {
            id: UUID,
            name: sendFormData.name,
            value: sendFormData.price,
            details: {
              dimX: sendFormData.dimensionX,
              dimY: sendFormData.dimensionY,
              type: sendFormData.type,
              delivery: sendFormData.ready,
              observation: sendFormData.observations,
              imgLink: downloadURL,
            },
            description: sendFormData.description,
            quantity: sendFormData.quantity,
            colors: sendFormData.colors,
          }
          
          await new Promise((resolve) => setTimeout(resolve, 3000));          
          const apiSend = await registerProduct(productData, cookies.authToken);
          if (apiSend) {
            toast.success(ToastInformation(apiSend.statusCode, apiSend.message), {transition: Slide})
            setLoading(false);            
            await new Promise((resolve) => setTimeout(resolve, 3500));          
            navigate('/dashboard/products')
          } else {            
            setLoading(false);
            toast.error(ToastInformation(apiSend.statusCode, apiSend.message), {transition: Slide})
          }
        }
      } catch (e) {
        toast.error('Erro ao cadastrar Produto', {transition: Slide})
        setLoading(false);
        console.log(e);
      }
    }
  }


  const handleAddNewColor = () => {
    if (colors.length < 4) {
      setColors([...colors, '#000000']);
    } else {
      setSetWarn(true);
      setTimeout(() => {
        setSetWarn(false);
      }, 3000);
    }
  }


  return (    
    <section className="flex flex-col items-start justify-start m-3">
      <Helmet>
        <title> Dashboard - Novo Produto </title>
      </Helmet>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      <h1 className="text-xl font-blinker text-stone-400 select-none">Adicionar um novo Produto </h1>
      <div className='w-[rem] h-[1px] bg-stone-300'></div>
      <article className="h-full w-full mt-3">
        <Container fluid>
          <Formik
            validationSchema={newProductSchema}
            onSubmit={handleSendData}
            initialValues={{
              name: '',
              description: '',
              dimensionX: 0,
              dimensionY: 0,
              type: '',
              quantity: 0,
              price: 0,
              ready: false,
              // image: '',
              // colors: [''],
              observations: ''
            } as newProduct}
          >
            {({ handleSubmit, handleChange, values, touched, errors }) => {
              return (
                <Form noValidate onSubmit={handleSubmit}>
                  <Row>
                    <Col sm>
                      <h1 className="text-xl font-blinker text-stone-400 select-none mb-3"> Detalhes </h1>
                      <Form.Group className="flex flex-col gap-3" controlId="name_description">
                        <FloatingLabel label="Nome do Produto">
                          <Form.Control
                            type="text"
                            name="name"
                            onChange={handleChange}
                            isValid={touched.name && !errors.name}
                            isInvalid={touched.name && !!errors.name}
                            value={values.name} />
                        </FloatingLabel>

                        <FloatingLabel label="Descrição do Produto">
                          <Form.Control
                            name="description"
                            onChange={handleChange}
                            value={values.description}
                            isValid={touched.description && !errors.description}
                            isInvalid={touched.description && !!errors.description}
                            as="textarea"
                            style={{ height: '200px' }} />
                        </FloatingLabel>
                      </Form.Group>

                      <Form.Group className="flex flex-row gap-3 mt-3">
                        <FloatingLabel label="Dimensão X (cm)">
                          <Form.Control
                            name="dimensionX"
                            onChange={handleChange}
                            isValid={touched.dimensionX && !errors.dimensionX}
                            isInvalid={touched.dimensionX && !!errors.dimensionX}
                            value={values.dimensionX}
                            type="number" />
                        </FloatingLabel>

                        <FloatingLabel label="Dimensão Y (cm)">
                          <Form.Control
                            name="dimensionY"
                            onChange={handleChange}
                            isValid={touched.dimensionY && !errors.dimensionY}
                            isInvalid={touched.dimensionY && !!errors.dimensionY}
                            value={values.dimensionY}
                            type="number" />
                        </FloatingLabel>

                        <FloatingLabel label="Tipo">
                          <Form.Select
                            name="type"
                            onChange={handleChange}
                            isValid={touched.type && !errors.type}
                            isInvalid={touched.type && !!errors.type}
                            value={values.type}
                            className="font-blinker text-stone-500">
                            <option></option>
                            <option value="Pano">Pano</option>
                            <option value="Fio">Fio</option>
                            <option value="Tecido">Tecido</option>
                          </Form.Select>
                        </FloatingLabel>
                      </Form.Group>

                      <Form.Group className="flex flex-row gap-3 mt-3">

                        <FloatingLabel label="Quantidade">
                          <Form.Control
                            name="quantity"
                            onChange={handleChange}
                            isValid={touched.quantity && !errors.quantity}
                            isInvalid={touched.quantity && !!errors.quantity}
                            value={values.quantity}
                            type="number" />
                        </FloatingLabel>

                        <FloatingLabel label="Preço Unitário R$">
                          <Form.Control
                            name="price"
                            onChange={handleChange}
                            isValid={touched.price && !errors.price}
                            isInvalid={touched.price && !!errors.price}
                            value={values.price}
                            type="number" />
                        </FloatingLabel>
                      </Form.Group>

                      <Form.Group className="mt-3">
                        <Form.Check
                          name="ready"
                          onChange={handleChange}
                          checked={values.ready}
                          type="checkbox"
                          label="Pronta Entrega" />
                      </Form.Group>

                      <article>
                        {loading ? (
                          <button className="bg-emerald-500 text-stone-100 font-blinker px-[4rem] py-2 mt-3 hover:bg-emerald-700 transition-all">
                            <Spinner animation="border" role="status" size="sm" />
                          </button>
                        ) : (
                          <button
                            className="bg-emerald-500 text-stone-100 font-blinker px-4 py-2 mt-3 hover:bg-emerald-700 transition-all"
                            type="submit">
                            Adicionar Produto
                          </button>
                        )}

                        <button
                          className="border-rose-500 border-[1px] text-rose-500 font-blinker px-4 py-2 mt-3 ml-3 hover:text-rose-300 hover:border-rose-300 transition-all"
                          type="reset">Cancelar</button>
                      </article>
                    </Col>

                    <Col sm lg={3}>
                      <h1 className="text-xl font-blinker text-stone-400 select-none mb-3"> Foto e Cores </h1>

                      <Form.Group>
                        <ProductDrop onImageDrop={handleImageDrop} errorStatus={errorImage} />
                      </Form.Group>

                      <Form.Group className="flex flex-col mt-3 w-[15rem]">
                        <Form.Label className="font-blinker text-stone-400">Cores</Form.Label>
                        <div className="flex flex-row gap-3">
                          {colors.map((color: string, index: number) => (
                            <Form.Control
                              name="colors"
                              type="color"
                              key={index}
                              value={color}
                              onChange={(e) => handleSelectColor(e.target.value, index)} />
                          ))}
                        </div>
                        {setWarn && <span className="text-rose-400 font-blinker mt-2 select-none">Limite de cores atingido!</span>}
                        <button className="bg-stone-500 text-stone-100 font-blinker px-4 py-2 mt-3 hover:bg-stone-700 transition-all" type="button" onClick={handleAddNewColor}>Adicionar Cor</button>
                      </Form.Group>

                      <Form.Group className="mt-2">
                        <Form.Label className="font-blinker text-stone-400">Observações
                          <Form.Control
                            name="observations"
                            onChange={handleChange}
                            isValid={touched.observations && !errors.observations}
                            isInvalid={touched.observations && !!errors.observations}
                            value={values.observations}
                            as="textarea"
                            style={{ height: '70px', width: '290px' }}
                            className="text-stone-400 placeholder:text-stone-400 focus:text-stone-500 font-blinker" placeholder="Observações do Produto" />
                        </Form.Label>
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

export default New_Product