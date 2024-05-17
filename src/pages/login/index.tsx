import { useEffect, useState } from "react"
import { Col, Container, Figure, FloatingLabel, Form, InputGroup, Row, Spinner } from "react-bootstrap"
import { Helmet } from "react-helmet"
import * as formik from "formik"
import * as yup from "yup"
import { LoginProps, doLogin } from "../../utils/api/auth"
import { Slide, ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css";
import { useCookies } from "react-cookie"
import { Circle, Envelope, Lock } from "@phosphor-icons/react"



function Login() {
  const { Formik } = formik;

  const loginSchema = yup.object().shape({
    email: yup.string().email('Digite um email válido').required('Email é obrigatório'),
    password: yup.string().min(6, 'Senha deve conter um Caractere maísculo, minisculo um número e um Simbolo').required('Senha é obrigatória')
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [statusCode, setStatusCode] = useState(0)
  const [cookies, setCookie] = useCookies(['authToken', 'userData'])

  const ToastStatusCode = (code: number) => {
    if (code === 401) {
      return (
        <div className="flex flex-row gap-2 items-center justify-between">
          <span> Email ou Senha Incorretos </span>
          <span className="text-xs font-abel text-stone-500 mt-2"> {code} </span>
        </div>
      )
    } else if (code === 500) {
      return (
        <div className="flex flex-row gap-2 items-center justify-between">
          <span> Erro Interno </span>
          <span className="text-sm font-abel text-stone-400 mt-2"> {code}</span>
        </div>
      )
    }
  }

  useEffect(() => {
    const checkIsHaveToken = async () => {
      const checkPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
          if (cookies.authToken) {
            resolve(true)
          } else {
            reject(true)
          }
        }, 1500)
      });

      const result = await toast.promise(
        checkPromise,
        {
          pending: "Verificando login ...",
          success: "Login Efetuado com Sucesso",
          error: "Você não está logado"
        }
      )

      if (result === true) {
        window.location.href = '/dashboard/home'
      }

    }
    checkIsHaveToken()
  }, [])

  const handleSendData = async (values: LoginProps) => {
    const sendFormData = {
      email: values.email,
      password: values.password
    }

    try {
      setLoading(true)
      setError(false)
      toast.info("Enviando Dados..", { transition: Slide })
      await new Promise((resolve) => setTimeout(resolve, 2000))
      const res = await doLogin(sendFormData)

      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 3);


      if (res?.statusCode === 200) {
        toast.success("Login Efetuado com Sucesso", { transition: Slide })
        setCookie('authToken', res.token, { path: '/', expires: expirationDate })
        setCookie('userData', JSON.stringify(res.userData), { path: '/', expires: expirationDate })
        setLoading(false)
        await new Promise((resolve) => setTimeout(resolve, 2500))
        window.location.href = '/dashboard/home'
      }

    } catch (e) {
      if (e === 500) {
        setStatusCode(500)
        toast.error(ToastStatusCode(statusCode), { transition: Slide })
        setError(true)
      } else if (e === 401) {
        setStatusCode(401)
        setError(true)
        toast.error(ToastStatusCode(statusCode), { transition: Slide })
        setLoading(false)
        await new Promise((resolve) => setTimeout(resolve, 5000))
      }
    }

  }

  return (
    <>
      <Helmet>
        <title> Página de Login </title>
      </Helmet>


      <Container fluid>

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

        <Row>
          <Col className="bg-stone-100 flex flex-col justify-center h-screen" sm>
            <div className="select-none lg:ml-[5rem] lg:mr-[5rem] mb-[5rem] lg:mb-5">
              <h3 className="font-bebas text-lg text-stone-500"> EC - Gestor </h3>
              <h1 className="font-blinker text-2xl text-stone-500">Inicie a Sessão da sua Conta</h1>
              <div className="w-[auto] h-[1.2px] bg-stone-500 mb-2"></div>
              <p className="text-stone-400 font-abel text-lg leading-5">
                Bem vindo ao seu painel de administração, aqui <br /> você cadastra, atualiza, modifica seus produtos
              </p>
            </div>
            <div className="ml-0 lg:ml-[5rem] mr-0 lg:mr-[5rem]">
              <h2 className="font-abel text-lg text-stone-400 select-none"> dados de acesso </h2>
              <Formik
                validationSchema={loginSchema}
                onSubmit={handleSendData}
                initialValues={{ email: '', password: '' } as LoginProps}
              >
                {({ handleSubmit, handleChange, values, touched, errors }) => {
                  return (
                    <Form noValidate onSubmit={handleSubmit}>
                      <Form.Group className="mb-3" controlId="email">
                        <InputGroup hasValidation>
                          <InputGroup.Text>
                            <Envelope className="text-stone-500" />
                          </InputGroup.Text>
                          <FloatingLabel label="Email" className="text-stone-500">
                            <Form.Control
                              type="email"
                              placeholder="Digite seu email"
                              name="email"
                              className="rounded-xl"
                              value={values.email}
                              onChange={handleChange}
                              isValid={touched.email && !errors.email}
                              isInvalid={!!errors.email} />
                          </FloatingLabel>
                        </InputGroup>
                        <span className={errors.email ? 'text-red-500 font-abel ml-[2.5rem]' : 'font-abel ml-[2.5rem]'}> {errors.email} </span>
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="password">
                        <InputGroup hasValidation>
                          <InputGroup.Text>
                            <Lock className="text-stone-500" />
                          </InputGroup.Text>
                          <FloatingLabel label="Senha" className="text-stone-500">
                            <Form.Control
                              type="password"
                              placeholder="Digite sua senha"
                              name="password"
                              className="rounded-xl"
                              value={values.password}
                              onChange={handleChange}
                              isValid={touched.password && !errors.password}
                              isInvalid={!!errors.password} />
                          </FloatingLabel>
                        </InputGroup>
                        <span className={errors.password ? 'text-red-500 font-abel ml-[2.5rem]' : 'font-abel ml-[2.5rem]'}> {errors.password} </span>
                      </Form.Group>

                      <Form.Group controlId="remember" className="flex flex-row items-center justify-between">
                        <Form.Check type="checkbox" className="flex flex-row items-center gap-2">
                          <Form.Check.Input type="checkbox" className="rounded-none text-lg" />
                          <Form.Check.Label className="text-stone-500 pt-1">Lembrar de mim</Form.Check.Label>
                        </Form.Check>

                        <button disabled>
                          <span className="text-[#3a98c4] underline underline-offset-4 text-lg transition-all">Esqueci minha senha</span>
                        </button>
                      </Form.Group>

                      <div className="flex flex-col justify-center items-center mt-5">
                        {errors.email || errors.password ? (
                          <button type="submit" disabled className="rounded bg-red-700 text-stone-50  text-lg font-abel p-3 h-[3rem] w-[7rem] justify-center items-center flex">
                            Acessar
                          </button>
                        ) : (
                          error ? (
                            <button type="submit" className="rounded bg-red-500 text-stone-50 hover:bg-red-700 hover:text-stone-50 text-lg font-abel p-3 h-[3rem] w-[7rem] justify-center items-center flex">
                              {!loading ? (<> Acessar </>) : (<Spinner animation="border" variant="light" />)}
                            </button>
                          ) : (
                            <button type="submit" className="rounded bg-sky-500 text-stone-50 hover:bg-sky-300 hover:text-stone-50 text-lg font-abel p-3 h-[3rem] w-[7rem] justify-center items-center flex">
                              {!loading ? (<> Acessar </>) : (<Spinner animation="border" variant="light" />)}
                            </button>
                          )
                        )}
                      </div>
                    </Form>
                  )
                }}
              </Formik>

            </div>
            <div className="flex flex-col justify-center items-center mt-5">
              <Figure>
                <Figure.Image
                  className="w-[150px] h-[150px] object-cover"
                  roundedCircle
                  src="/img/company_logo.png"
                />
              </Figure>
            </div>
          </Col>

          <Col className="bg-stone-600 h-screen" sm>
            <section className="flex flex-col justify-center items-center mg:mt-[6rem] lg:mt-[10rem]">
              <Figure>
                <Figure.Image
                  width={330}
                  alt="500x500"
                  src="/png/login_icon.png"
                />
              </Figure>
              {RenderGallery()}
            </section>
          </Col>
        </Row>
      </Container>
    </>
  )

  function RenderGallery() {

    const titles = [
      { id: 1, title: "Tenha Controle das suas vendas", descriptionShort: <p>tudo que você precisa em um só lugar , <br /> veja suas vendas, seus produtos, finanças e clientes</p> },
      { id: 2, title: "Atualize seus produtos e muito mais..", descriptionShort: <p>adicione novos produtos, atualize os anteriores, <br /> marque como venda única, isso e muito mais</p> },
      { id: 3, title: "Veja seus pedidos pendentes", descriptionShort: <p>veja os pedidos das suas clientes, <br /> entre em contato ou finalize-os</p> }
    ]

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % titles.length)
      }, 6000)
      return () => clearInterval(interval)
    }, [titles.length])

    return (
      <div className="flex flex-col justify-center items-center">
        <section>
          <h3 className="text-stone-50 font-abel text-2xl text-center">{titles[currentIndex].title}</h3>
          <p className="text-stone-400 font-abel text-md select-none">
            {titles[currentIndex].descriptionShort}
          </p>
        </section>

        <section className="flex flex-row gap-3 mt-5">
          <button type="button" onClick={() => setCurrentIndex(0)}>
            <Circle weight={currentIndex === 0 ? "fill" : "regular"} className={titles[currentIndex].id === 1 ? 'text-stone-50 animate__animated animate__fadeIn transition-all' : 'text-stone-500 transition-all'} />
          </button>

          <button type="button" onClick={() => setCurrentIndex(1)}>
            <Circle weight={currentIndex === 1 ? "fill" : "regular"} className={titles[currentIndex].id === 2 ? 'text-stone-50 animate__animated animate__fadeIn transition-all' : 'text-stone-500 transition-all'} />
          </button>

          <button type="button" onClick={() => setCurrentIndex(2)}>
            <Circle weight={currentIndex === 2 ? "fill" : "regular"} className={titles[currentIndex].id === 3 ? 'text-stone-50 animate__animated animate__fadeIn transition-all' : 'text-stone-500 transition-all'} />
          </button>
        </section>
      </div>
    )
  }
}

export default Login