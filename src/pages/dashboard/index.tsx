import { Col, Container, Row } from 'react-bootstrap'
import DashboardNav from '../../components/dashboard_navigation/DashboardNav'
import DashboardSideNav from '../../components/dashboard_sideNavigation/DashboardSideNav'
import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { initializeApp } from '@firebase/app'
import { Helmet } from 'react-helmet'
import { ToastContainer } from 'react-toastify'



function Dashboard() {
  const [menuOpen, setMenuOpen] = useState(true)
  const handleToggleMenu = () => {
    setMenuOpen((prevMenuOpen) => !prevMenuOpen);
  }
  useEffect(() => {
    const storedMenuOpen = localStorage.getItem('menuOpen') === 'true';
    setMenuOpen(storedMenuOpen)
  }, [])
  useEffect(() => {
    localStorage.setItem('menuOpen', menuOpen.toString());
  }, [menuOpen])

  // Inicializador do Firebase
  useEffect(() => {
    const firebaseConfig = {
      apiKey: "AIzaSyDNlh048Q_CWuLUeFPqCg-H-5uqkG84wjk",
      authDomain: "dabruatelie-cf3fc.firebaseapp.com",
      projectId: "dabruatelie-cf3fc",
      storageBucket: "dabruatelie-cf3fc.appspot.com",
      messagingSenderId: "614083227007",
      appId: "1:614083227007:web:bbfe27f7e680222872be4a"
    }

    initializeApp(firebaseConfig)
  })


  return (
    <Container fluid className="pl-0 ">
      <Helmet>
        <title> Dashboard - Inicio </title>
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
      
      <Row className='flex justify-evenly w-full'>
        <Col sm={menuOpen ? 1 : 10} className={!menuOpen ? 'bg-stone-600 w-[6.5rem]' : "bg-stone-600 w-[16rem]"}>
          <DashboardSideNav isOpen={menuOpen} onToggle={handleToggleMenu} />
        </Col>
        <Col>
          <DashboardNav />
          <Outlet />
        </Col>
      </Row>
    </Container>
  )
}

export default Dashboard