import { Container, Col, Row, Card, Modal, FormControl, Form } from "react-bootstrap"
import { useCookies } from "react-cookie"
import { useEffect, useState } from "react"
import * as formik from 'formik'
import * as yup from 'yup'
import { toast } from "react-toastify"
import { getUserData, userData } from "../../../utils/api/users"
import { CheckCircle } from "@phosphor-icons/react"
import { LinearProgress } from "@mui/material"
import { sendReportEmail, sendSuggestionEmail } from "../../../utils/api/auth"

function Support() {
    const [cookies] = useCookies(['userData', 'authToken'])
    const [openModalSupport, setOpenModalSupport] = useState(false)
    const [openSuggestionsModal, setOpenSuggestionsModal] = useState(false)
    const [UserInfo, setUserInfo] = useState<userData>()
    const [success, setSuccess] = useState(false)
    const [sucessMessage, setSucessMessage] = useState('')
    const [progressNumber, setProgressNumber] = useState(0)

    useEffect(() => {
        const fetchUserData = async () => {
            await new Promise((resolve) => setTimeout(resolve, 1500))
            await getUserData(cookies.authToken, cookies.userData.id).then((res) => {
                setUserInfo(res.found)
            })
            await new Promise((resolve) => setTimeout(resolve, 1500))
        }
        fetchUserData()
    }, [cookies.authToken, cookies.userData.id])

    const { Formik } = formik;

    const suggestionSchema = yup.object().shape({
        suggestion: yup.string().required('Campo Obrigatório').min(5, 'Mínimo de 5 caracteres').max(100, 'Máximo de 100 caracteres')
    })

    const supportSchema = yup.object().shape({
        support: yup.string().required('Campo Obrigatório').min(5, 'Mínimo de 5 caracteres').max(100, 'Máximo de 100 caracteres')
    })



    interface supportMSG { support: string }
    const handleSendSupport = (value: supportMSG) => {

        const infos = {
            userEmail: /*UserInfo?.email as never,*/ 'luisthalys1@hotmail.com',
            userName: UserInfo?.name as never,
            id: cookies.userData.id as never,
            errorReport: value.support
        }

        const resPromise = new Promise((resolve) => {
            sendReportEmail(infos, cookies.authToken).then((res) => {
                if (res) {
                    if (res.statusCode === 200) {
                        setSuccess(true)
                        setSucessMessage(res.message)
                        resolve(res)
                    }
                }
            }).catch((err) => {
                console.error(err);
                console.log(err.message);
                console.log(cookies.authToken);
                
                
                resolve(false)
            })
        })

        toast.promise(resPromise, {
            pending: 'Enviando Relatório...',
            success: 'Relatório Enviado com Sucesso!',
            error: 'Erro ao Enviar Relatório'
        })        

        setTimeout(() => {
            setOpenModalSupport(false)
            setSuccess(false)   
            setSucessMessage('')     
        }, 5000)
    }

    interface suggestionMSG { suggestion: string }

    const handleSendSuggestions = async (value: suggestionMSG) => {
        const infos = {
            userEmail: /*UserInfo?.email as never,*/ 'luisthalys1@hotmail.com',
            userName: UserInfo?.name as never,
            id: cookies.userData.id as never,
            suggestion: value.suggestion
        }

        const resPromise = new Promise((resolve) => {
            sendSuggestionEmail(infos ,cookies.authToken).then((res) => {
                if (res) {
                    if (res.statusCode === 200) {
                        setSuccess(true)
                        setSucessMessage(res.message)
                        resolve(res)
                    }
                }
            }).catch((err) => {
                console.error(err);
                resolve(false)
            })
        })

        toast.promise(resPromise, {
            pending: 'Enviando Sugestão...',
            success: 'Sugestão Enviada com Sucesso!',
            error: 'Erro ao Enviar Sugestão'
        })
        
        setTimeout(() => {
            setOpenSuggestionsModal(false)
            setSuccess(false)
            setSucessMessage('')
        }, 5000)
    }

    useEffect(() => {
        if (success) {
            const interval = setInterval(() => {
                setProgressNumber((oldProgress) => {
                    if (oldProgress === 100) {
                        clearInterval(interval)
                        return 100
                    }
                    const diff = Math.random() * 10
                    return Math.min(oldProgress + diff, 100)
                })
            }, 500)
        }

        return () => {
            clearInterval(progressNumber)
        }
    }, [progressNumber, success])

    const SuggestionsModal = () => {
        return (
            <Formik validationSchema={suggestionSchema} onSubmit={handleSendSuggestions} initialValues={{ suggestion: '' }}>
                {({ handleSubmit, handleChange, values, errors }) => (
                    <Form noValidate onSubmit={handleSubmit}>
                        {success && (
                            <div className="bg-stone-50 rounded absolute h-full w-full z-10 p-3">
                                <div className="flex flex-col items-center justify-center mt-5">
                                    <CheckCircle size={100} className="text-emerald-500" />
                                    <h1 className="text-stone-500 font-blinker text-2xl select-none mt-3">{sucessMessage}!</h1>
                                    <div>
                                        <LinearProgress value={progressNumber} variant="determinate" color="success" className="w-[15rem] mt-3 transition-all" />
                                    </div>
                                </div>
                            </div>
                        )}

                        <Modal.Header>
                            <Modal.Title>Enviar Sugestão</Modal.Title>
                        </Modal.Header>


                        <Modal.Body>
                            <p className="text-stone-400 font-blinker ">
                                Deseja alguma melhora no sistema, algum ponto que precisa Otimizar? <br />
                                envie para nossa equipe de desenvolvimento</p>

                            <FormControl as="textarea" name="suggestion" value={values.suggestion} onChange={handleChange} className="mt-3" rows={3} placeholder="Digite sua sugestão aqui" />
                            {errors.suggestion && <span className="text-rose-500 pt-3 select-none">{errors.suggestion}</span>}
                        </Modal.Body>

                        <Modal.Footer>
                            <button className="p-2 bg-emerald-500 text-stone-50 rounded hover:bg-emerald-300  transition-all" type="submit"> Enviar Sugestão </button>
                        </Modal.Footer>
                    </Form>
                )}
            </Formik>
        )
    }

    const SupportModal = () => {
        return (
            <Formik validationSchema={supportSchema} onSubmit={handleSendSupport} initialValues={{ support: '' }}>
                {({ handleSubmit, handleChange, values, errors }) => (
                    <Form noValidate onSubmit={handleSubmit}>
                        {success && (
                            <div className="bg-stone-50 rounded absolute h-full w-full z-10 p-3">
                                <div className="flex flex-col items-center justify-center mt-5">
                                    <CheckCircle size={100} className="text-emerald-500" />
                                    <h1 className="text-stone-500 font-blinker text-2xl select-none mt-3">{sucessMessage}!</h1>
                                    <div>
                                        <LinearProgress value={progressNumber} variant="determinate" color="success" className="w-[15rem] mt-3 transition-all" />
                                    </div>
                                </div>
                            </div>
                        )}

                        <Modal.Header>
                            <Modal.Title>Relatar um Bug</Modal.Title>
                        </Modal.Header>


                        <Modal.Body>
                            <p className="text-stone-400 font-blinker ">
                                Encontrou algum bug ou está enfrentando algum erro na plataforma? <br />
                                Envie para nossa equipe de suporte, para que possamos ajudar-la(o) o mais breve possivel</p>

                            <FormControl as="textarea" name="support" value={values.support} onChange={handleChange} className="mt-3" rows={3} placeholder="Digite sua sugestão aqui" />
                            {errors.support && <span className="text-rose-500 pt-3 select-none">{errors.support}</span>}
                        </Modal.Body>

                        <Modal.Footer>
                            <button className="p-2 bg-yellow-500 text-stone-50 rounded hover:bg-yellow-300  transition-all" type="submit"> Enviar Relatório </button>
                        </Modal.Footer>
                    </Form>
                )}
            </Formik>
        )
    }



    return (
        <Container>
            <Modal show={openModalSupport} onHide={() => setOpenModalSupport(false)} centered>
                <SupportModal />
            </Modal>
            <Modal show={openSuggestionsModal} onHide={() => setOpenSuggestionsModal(false)} centered>
                <SuggestionsModal />
            </Modal>
            <Row>
                <span className='font-blinker text-stone-400 uppercase select-none text-md'>Suporte Técnico</span>
                <div className='w-[10rem] h-[1px] bg-stone-300'></div>

                <h1 className='text-stone-400 font-blinker text-2xl select-none mt-3'>Como podemos Ajudar você hoje? , {UserInfo.name} </h1>

                <Col className="flex flex-col lg:flex-row gap-5 items-center justify-center mt-[5rem]">
                    <Card className='text-stone-500 shadow-md shadow-stone-300 w-[15rem]' >
                        <Card.Body>
                            <Card.Title>Relatar um Bug</Card.Title>
                            <Card.Img variant='top' src='/svg/bug.svg' className="w-[15rem] h-[10rem] p-4" />
                            <Card.Text className="font-blinker text-stone-400 select-none">
                                Encontrou Algum bug no Sistema? Relate para nossa equipe de desenvolvimento.
                            </Card.Text>
                        </Card.Body>
                        <Card.Footer className="flex flex-row justify-center items-center">
                            <button className="p-2 bg-rose-500 text-stone-50 rounded hover:bg-rose-300  transition-all" onClick={() => setOpenModalSupport(true)}> Relatar Bug</button>
                        </Card.Footer>
                    </Card>

                    <Card className='text-stone-500 shadow-md shadow-stone-300 w-[15rem]' >
                        <Card.Body>
                            <Card.Title>Sugestões</Card.Title>
                            <Card.Img variant='top' src='/svg/suggestions.svg' className="w-[15rem] h-[10rem] p-4" />
                            <Card.Text className="font-blinker text-stone-400 select-none">
                                Tem alguma sugestão para o Sistema? Envie para nossa equipe de desenvolvimento.
                            </Card.Text>
                        </Card.Body>
                        <Card.Footer className="flex flex-row justify-center items-center">
                            <button className="p-2 bg-emerald-500 text-stone-50 rounded hover:bg-emerald-300  transition-all" onClick={() => setOpenSuggestionsModal(true)}>Enviar Sugestão</button>
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>

            <footer className="flex flex-row items-center justify-center mt-[8rem]">
                <span className='text-stone-300 font-blinker text-md select-none mt-5'>Thalys © 2024 - 2030 | Todos os Direitos Reservados</span>
            </footer>
        </Container>
    )
}

export default Support