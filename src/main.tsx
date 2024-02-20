import React from 'react'
import ReactDOM from 'react-dom/client'
// Estilos
import './assets/global/fonts.css'
import './assets/global/styles.css'
import './assets/global/tailwind.css'

// Rotas
import Routes from './utils/routes.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Routes/>
  </React.StrictMode>,
)
