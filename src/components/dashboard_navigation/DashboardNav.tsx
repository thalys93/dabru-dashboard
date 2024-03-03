import { useCookies } from "react-cookie"
import { Suspense, lazy, useEffect, useState } from "react"
import { Container, Navbar, Spinner } from "react-bootstrap"
import { CaretDown } from "@phosphor-icons/react"
import NotificationBell from "./NotificationBell"
import DashboardSearchBar from "./DashboardSearchBar"

interface UserData {
  name: string,
  email: string,
  role: string,
  avatar: string,
  fullName: string
}

const UserAvatar = lazy(() => delayState(import('./UserAvatar')))

async function delayState(promise: Promise<typeof import("./UserAvatar")>) {
  await new Promise(resolve => {
    setTimeout(resolve, 2000)
  })
  return promise
}


function DashboardNav() {
  const [User, setUser] = useState<UserData>({} as UserData)
  const [cookies] = useCookies(['userData'])
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
    const getUserData = async () => {
      setIsLoading(true)      
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setUser(cookies.userData)
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setIsLoading(false)
    }
    getUserData()
  }, [User, cookies.userData])

  return (
    windowSize < 768 ? (
      <Navbar>
        <Container>
          <Navbar.Brand className="text-stone-600 font-blinker hover:text-stone-600 select-none animate__animated animate__fadeIn"> Boas Vindas , {!IsLoading ? `${User.name} ! ` : 'Carregando..'} </Navbar.Brand>
          <div className="flex flex-row gap-2 items-center justify-center">
            <NotificationBell quantity={0 as never} />
            <span className="text-stone-400 text-2xl ">|</span>
            <div className="mt-2">
              <UserAvatar />
            </div>
          </div>
        </Container>
      </Navbar>
    ) : (
      <Navbar expand="lg">
        <Container>
          <Navbar.Brand className="text-stone-600 font-blinker hover:text-stone-600 select-none animate__animated animate__fadeIn"> Boas Vindas , {!IsLoading ? `${User.name} ! ` : 'Carregando..'}</Navbar.Brand>
          <Navbar.Toggle aria-controls="dashboardNavigationToggle" />          
            <Navbar.Collapse id="dashboardNavigationToggle" className="flex flex-row gap-3 items-center justify-end">
              <DashboardSearchBar queryText='' onSearchItem={handleFilterByText} />
              <span className="text-stone-400 text-2xl mb-2 ">|</span>
            </Navbar.Collapse>
            <div className="flex flex-row gap-3 items-center justify-end">
              <div className="animate__animated animate__fadeInDown flex-row flex gap-3 ml-3">
                <NotificationBell quantity={0 as never} />
                <Suspense fallback={<Spinner animation="border" variant="dark" />}>
                  <UserAvatar />
                </Suspense>
              </div>
              <Navbar.Text className="text-stone-600 font-blinker hover:text-stone-600 select-none animate__animated animate__fadeIn">{!IsLoading ? User.fullName : "..."}</Navbar.Text>
              <CaretDown className="text-stone-600 text-xs" weight="fill" />
            </div>          
        </Container>
      </Navbar>
    )
  )
}

export default DashboardNav