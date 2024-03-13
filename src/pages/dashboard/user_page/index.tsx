import { FileArrowDown, Trash, UploadSimple } from "@phosphor-icons/react"
import { useCallback, useEffect, useState } from "react"
import { Col, Container, Form, Image, Row, Stack } from "react-bootstrap"
import { useCookies } from "react-cookie"
import { useParams } from "react-router-dom"
import { getUserData, patchUserData, userData } from "../../../utils/api/users"
import inputMask from "react-input-mask"
import * as formik from "formik"
import * as yup from "yup"
import { Slide, toast } from "react-toastify"
import { useDropzone } from "react-dropzone"
import { UploadResult, getDownloadURL, getStorage, ref as storageRef } from 'firebase/storage';
import { useUploadFile } from 'react-firebase-hooks/storage';


interface userDataUpdate {
  name: string
  lastName: string
  email: string
  phone: string
  birth: string
  gender: string
  avatar: string
}

function User_Page() {
  const [userInformation, setUserInformation] = useState({} as userData)
  const [showOverlay, setShowOverlay] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { id }: any = useParams();
  const [cookies] = useCookies(['authToken'])
  const { Formik } = formik;
  const [uploudFile] = useUploadFile();  

  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageLink, setImageLink] = useState("")
  const [imageBlob, setImageBlob] = useState<Blob | null>(null)

  const userUpdateValidation = yup.object().shape({
    name: yup.string(),
    lastname: yup.string(),
    email: yup.string().email("Email Inválido"),
    phone: yup.string(),
    birth: yup.string(),
    gender: yup.string()
  })

  useEffect(() => {
    async function fetchData() {
      const res = new Promise((resolve, reject) => {
        getUserData(cookies.authToken, id).then((res) => {
          resolve(res.found)
        }).catch((err) => {
          reject(err)
        })
      })
      const data = await res as userData
      if (data !== undefined) {
        setUserInformation(data)
      } else {
        window.location.reload()
      }
    }
    fetchData()
  }, [cookies.authToken, id])

  // const onImageDrop = (img: ImageProps) => {
  //   setImagePreview(img as never);
  // }  

  const onDrop = useCallback((aceptedFiles: unknown[]) => {
    const file = aceptedFiles[0];

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file as Blob)

    if (setImageBlob) {
      setImageBlob(file as never);
    }

  }, [])


  const handleMouseEnter = () => {
    setShowOverlay(true)
  }

  const handleMouseLeave = () => {
    setShowOverlay(false)
  }

  const handleClearImage = () => {
    setImagePreview(null)
  }

  const { getRootProps, getInputProps } = useDropzone({ onDrop, multiple: false })
  const handleSendImage = async () => {
    try {
      const imageRef = storageRef(getStorage(), `users/${id}/profileimage`)
      const result = await uploudFile(imageRef, imageBlob as never, { contentType: 'image/jpeg' }) as UploadResult
      toast.info("Enviando Imagem...", { transition: Slide })

      if (result !== null) {
        const downloadURL = await getDownloadURL(result.ref) as string

        setImageLink(downloadURL)
        toast.success("Imagem Enviada com Sucesso")
      } else {
        toast.error("Erro ao Enviar a Imagem")
      }

    } catch (err) {
      toast.error("Falha ao Enviar a Imagem")
    }
  }

  const handleUpdateUser = async (values: userDataUpdate) => {
    const formValues = {
      name: userInformation.name,
      lastName: values.lastName,
      email: userInformation.email,
      phone: values.phone,
      birthDate: values.birth,
      gender: values.gender,
      avatar: imageLink || userInformation.avatar
    }        

    const res = new Promise((resolve, reject) => {
      patchUserData(cookies.authToken, id, formValues).then((res) => {
        resolve(res)
      }).catch((err) => {
        reject(err)
      })
    })

    toast.promise(res, {
      pending: "Atualizando Dados",
      success: "Dados Atualizados",
      error: "Erro ao Atualizar os Dados"
    })

    if (await res) {
      setTimeout(() => {
        window.location.reload()
      }, 2500)
    }
  }

  return (
    <Container fluid>
      <Row>
        <h1 className="font-abel text-xl text-stone-500 pb-3 pt-3 select-none font-medium"> Detalhes da Conta </h1>
        <Stack direction="horizontal" className="border-stone-200 border-[1px] rounded-lg p-3">
          <section className="flex flex-row justify-center items-center m-2">
            <div {...getRootProps()} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
              <input {...getInputProps()} />
              {showOverlay && (
                <div className='bg-stone-700 bg-opacity-50 absolute h-[85px] w-[85px] rounded-full flex items-center justify-center animate__animated animate__fadeIn'>
                  <FileArrowDown size={30} color='white' />
                </div>
              )}
              <Image src={imagePreview || userInformation.avatar || "/img/placeholder.jpg"} roundedCircle width={85} alt="Placeholder" />
            </div>

            <div className="flex flex-row gap-4 ml-10">
              <button onClick={() => handleSendImage()}
                className="flex flex-row gap-1 items-center border-sky-500 border-[1px] p-2 rounded-md text-sky-500 font-blinker font-normal hover:border-sky-300 hover:text-sky-300 transition-all">
                <UploadSimple />
                <span> Uploud </span>
              </button>

              <button onClick={handleClearImage}
                className="flex flex-row gap-1 items-center border-rose-500 border-[1px] p-2 rounded-md text-rose-500 font-blinker font-normal hover:border-rose-300 hover:text-rose-300 transition-all">
                <Trash />
                <span> Remover </span>
              </button>
            </div>
          </section>

        </Stack>
        <Formik
          validationSchema={userUpdateValidation}
          onSubmit={handleUpdateUser}
          initialValues={{
            name: userInformation.name,
            lastName: userInformation.lastName,
            email: userInformation.email ,
            phone: userInformation.phone,
            birth: userInformation.birthDate,
            avatar: userInformation.avatar || imageLink,
            gender: userInformation.gender
          }}>

          {({ handleSubmit, handleChange, values, handleReset }) => {
            return (
              <Form noValidate onSubmit={handleSubmit}>
                <Col className="mt-4">
                  <Row>
                    <Col>
                      <Form.Text muted> Nome </Form.Text>
                      <Form.Control
                        type="text"
                        plaintext
                        disabled
                        value={userInformation.name}
                        className="border-stone-200 bg-stone-200 border-[1px] p-2 rounded-md" />
                    </Col>
                    <Col>
                      <Form.Text muted> Sobre Nome </Form.Text>
                      <Form.Control
                        type="text"
                        name="lastName"
                        onChange={handleChange}
                        plaintext
                        value={values.lastName || userInformation.lastName}
                        className="border-stone-200  border-[1px] p-2 rounded-md" />
                    </Col>
                  </Row>

                  <Row className="mt-4">
                    <Col>
                      <Form.Text muted>
                        Email
                      </Form.Text>
                      <Form.Control
                        type="text"
                        plaintext
                        disabled
                        value={userInformation.email}
                        className="border-stone-200 bg-stone-200 border-[1px] p-2 rounded-md" />
                    </Col>
                    <Col>
                      <Form.Text muted>
                        Telefone
                      </Form.Text>
                      <Form.Control
                        name="phone"
                        onChange={handleChange}
                        as={inputMask}
                        mask="99 9999-9999"
                        type="text"
                        placeholder="51 9999-9999"
                        plaintext
                        value={values.phone || userInformation.phone}
                        className="border-stone-200 border-[1px] p-2 rounded-md" />
                    </Col>
                  </Row>

                  <Row className="mt-4">
                    <Col>
                      <Form.Text>Gênero</Form.Text>
                      <Form.Select name="gender" value={values.gender || userInformation.gender } onChange={handleChange} className="border-stone-200 border-[1px] p-2 rounded-md">
                        <option value=""> Selecione </option>
                        <option value="M"> Masculino </option>
                        <option value="F"> Feminino </option>
                      </Form.Select>
                    </Col>

                    <Col>
                      <Form.Text muted> Data de Nascimento </Form.Text>
                      <Form.Control
                        as={inputMask}
                        mask="99/99/9999"
                        type="text"
                        name="birth"
                        onChange={handleChange}
                        plaintext
                        placeholder="01/01/2000"
                        value={values.birth || userInformation.birthDate}
                        className="border-stone-200 border-[1px] p-2 rounded-md" />
                    </Col>
                  </Row>

                  <div className="flex flex-row gap-3 mt-10">
                    <button
                      type="submit"
                      className="p-2 bg-emerald-500 text-stone-50 hover:bg-emerald-300 transition-all border-[1px]rounded-sm flex flex-row gap-2 font-abel font-light"> Salvar Dados </button>
                    <button onClick={handleReset}
                      className="p-2 bg-rose-500 text-stone-50 hover:bg-rose-300 transition-all border-[1px] rounded-sm flex flex-row gap-2 font-abel font-light"> Cancelar </button>
                  </div>
                </Col>
              </Form>
            )
          }}
        </Formik>
      </Row>
    </Container >
  )
}

export default User_Page