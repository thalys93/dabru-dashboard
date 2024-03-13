import { useCookies } from "react-cookie"
import { useEffect, useState } from "react"
import { Container, Dropdown, Navbar, Stack } from "react-bootstrap"
import { CaretDown, Door, Gear, Headset, UserCircle } from "@phosphor-icons/react"
import NotificationBell from "./NotificationBell"
import DashboardSearchBar from "./DashboardSearchBar"
import UserAvatar from "./UserAvatar"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import { getUserData } from "../../utils/api/users"

interface UserData {
  id: string,
  name: string,
  email: string,
  role: string,
  avatar: string,
  lastName: string
}


function DashboardNav() {
  const [User, setUser] = useState<UserData>({} as UserData)
  const [cookies, setCookie] = useCookies(['userData', 'authToken'])
  const [IsLoading, setIsLoading] = useState<boolean>(false)
  const [windowSize, setWindowSize] = useState<number>(window.innerWidth)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [filterText, setFilterText] = useState('');

  const handleFilterByText = (text: string) => {
    setFilterText(text)
  }

  useEffect(() => {
    const handleRezise = () => setWindowSize(window.innerWidth)
    window.addEventListener('resize', handleRezise);
    return () => {
      window.removeEventListener('resize', handleRezise);
    };
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 1500))
      await getUserData(cookies.authToken, cookies.userData.id).then((res) => {
        setUser(res.found)
      })
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setIsLoading(false)
    }
    fetchUserData()
  }, [cookies.authToken, cookies.userData.id])

  const handleLogout = async () => {
    const logout = await new Promise((resolve) => {
      setCookie('authToken', '', { path: '/', expires: new Date(0) })
      setCookie('userData', '', { path: '/', expires: new Date(0) })
      setTimeout(() => {
        resolve(true)
      }, 2500)
    })

    toast.promise(
      logout == true ? Promise.resolve('success') : Promise.reject('error'),
      {
        pending: 'Deslogando...',
        success: 'Deslogado com sucesso!',
        error: 'Erro ao deslogar!'
      }
    )

    setTimeout(() => {
      if (logout === true) {
        window.location.href = '/'
      }
    }, 2500)

  }

  return (
    windowSize < 768 ? (
      <Navbar>
        <Container>
          <Navbar.Brand className="text-stone-600 font-blinker hover:text-stone-600 select-none animate__animated animate__fadeIn"> Boas Vindas , {!IsLoading ? `${User.name} ! ` : 'Carregando..'} </Navbar.Brand>
          <div className="flex flex-row gap-2 items-center justify-center">
            <NotificationBell quantity={0 as never} />
            <div className="h-[2rem] bg-stone-300 bg-opacity-60 w-[0.1rem]"></div>
            <div className="mt-2">
              <UserAvatar />
            </div>
          </div>
        </Container>
      </Navbar>
    ) : (
      <Container fluid>
        <Stack direction="horizontal" className="p-1 justify-between items-center">
          <h1 className="text-stone-600 font-blinker hover:text-stone-600 select-none animate__animated animate__fadeIn text-xl"> Boas Vindas , {!IsLoading ? `${User.name} ! ` : 'Carregando..'}</h1>
          <DashboardSearchBar queryText='' onSearchItem={handleFilterByText} />
          <div className="flex flex-row gap-3 items-center justify-around">
            <div className="h-[2rem] bg-stone-300 bg-opacity-60 w-[0.1rem]"></div>
            <div className="animate__animated animate__fadeInDown flex-row flex gap-3 justify-center items-center">
              <NotificationBell quantity={0 as never} />
              <UserAvatar src={User.avatar}/>
            </div>
            <span className="text-stone-600 font-blinker hover:text-stone-600 select-none animate__animated animate__fadeIn ">{!IsLoading ? `${User.name} ${User.lastName}` : "Usuário..."}</span>
            <Dropdown>
              <Dropdown.Toggle className="bg-transparent border-0 flex flex-col items-center">
                <CaretDown className="text-stone-600 text-xs hover:cursor-pointer" weight="fill" />
              </Dropdown.Toggle>
              <Dropdown.Menu className="mt-2 border-stone-200">
                <Dropdown.Item className="text-stone-600 font-blinker hover:text-sky-600 select-none animate__animated animate__fadeIn">
                  <Link to={`profile/${User.id}`} className="flex flex-row items-center gap-1">
                    <UserCircle /> Perfil
                  </Link>
                </Dropdown.Item>
                <Dropdown.Item className="text-stone-600 font-blinker hover:text-sky-600 select-none animate__animated animate__fadeIn">
                  <Link to="settings" className="flex flex-row items-center gap-1">
                    <Gear /> Configurações
                  </Link>
                </Dropdown.Item>
                <Dropdown.Item className="text-stone-600 font-blinker hover:text-sky-600 select-none animate__animated animate__fadeIn">
                  <Link to="support" className="flex flex-row items-center gap-1">
                    <Headset /> Suporte
                  </Link>
                </Dropdown.Item>
                <Dropdown.Divider className="border-stone-200" />
                <Dropdown.Item className="flex flex-row gap-2 items-center text-stone-600 font-blinker hover:text-sky-600 select-none animate__animated animate__fadeIn" onClick={() => handleLogout()} >
                  <Door /> Sair
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </Stack>
      </Container>
    )
  )
}

export default DashboardNav