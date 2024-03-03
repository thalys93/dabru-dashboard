import { Bank, CaretLeft, CaretRight, ChartLine, ClipboardText, Cube, DoorOpen, Gear, Info, SquaresFour, Storefront } from "@phosphor-icons/react"
import { GiWool } from "react-icons/gi"
import { Link, useLocation } from "react-router-dom"

function DashboardSideNav({ isOpen, onToggle }: { isOpen: boolean, onToggle: (value: boolean) => void }) {
  const defaultRoute = "/dashboard"
  const iconDefaultSize = 30
  const principal_menu = [
    { id: 1, name: "Dashboard", icon: <SquaresFour size={iconDefaultSize} weight="fill" />, link: "home" },
    { id: 2, name: "Produtos", icon: <Cube size={iconDefaultSize} weight="fill" />, link: "products" },
    { id: 3, name: "Pedidos", icon: <ClipboardText size={iconDefaultSize} weight="fill" />, link: "orders" },
    { id: 4, name: "Ateliê", icon: <Storefront size={iconDefaultSize} weight="regular" />, link: "atelie" },
    { id: 5, name: "Estatisticas", icon: <ChartLine size={iconDefaultSize} weight="regular" />, link: "statistics" },
    { id: 6, name: "Financeiro", icon: <Bank size={iconDefaultSize} weight="fill" />, link: "finances" },
  ]
  const helpAndSupport = [
    { id: 1, name: "Suporte Técnico", icon: <Info size={iconDefaultSize} weight="fill" />, link: "support" },
    { id: 2, name: "Configurações", icon: <Gear size={iconDefaultSize} weight="fill" />, link: "settings" },
  ]

  const location = useLocation()

  const activeRoute = (path: string) => {    
    const currentPathSegments = location.pathname.split('/');
    const currentRoute = currentPathSegments[currentPathSegments.length - 1];

    return currentRoute === path ? true : false;
  }

  const menuItemDefaultClass = "bg-stone-500 text-stone-50 font-blinker uppercase flex flex-row gap-1 items-center justify-start p-2 hover:bg-sky-500 transition-all duration-200"
  const menuItemActiveClass = "bg-sky-500 text-stone-50 font-blinker uppercase flex flex-row gap-1 items-center justify-start p-2 hover:bg-sky-500 transition-all duration-200"

  const handleOpenMenu = () => {
    onToggle(false)
  }

  const handleCloseMenu = () => {
    onToggle(true)
  }

  return !isOpen ? (
    <section className="flex flex-col justify-start p-3 animate__animated animate__fadeInLeft h-screen w-[5rem]">
      <div className="flex flex-col gap-1">
        <div className="flex flex-row gap-2 items-center justify-center">
          <GiWool className="text-stone-50 text-3xl" />
        </div>
        <div className="w-[3rem] bg-stone-200 h-[1px]"></div>
        <aside className="flex flex-row items-center justify-center ml-2">
          <button className="flex flex-row gap-0 text-stone-200 items-center hover:text-stone-400 font-light font-blinker transition-all" onClick={() => handleOpenMenu()}>Abrir<CaretRight weight="fill" /> </button>
        </aside>
      </div>
      <aside className="flex flex-col justify-center items-center mt-2">
        <ul className="flex flex-col gap-2">
          {principal_menu.map((item, i) => (
            <Link key={i} to={item.link}>
              <li key={item.id} className={activeRoute(item.link) ? menuItemActiveClass : menuItemDefaultClass}>
                {item.icon}
              </li>
            </Link>
          ))}
        </ul>
        <div className="w-[3rem] bg-stone-200 h-[1px] mt-3 mb-3"></div>
        <ul className="flex flex-col gap-2">
          {helpAndSupport.map((item, i) => (
            <Link key={i} to={item.link}>
              <li key={item.id} className={activeRoute(item.link) ? menuItemActiveClass : menuItemDefaultClass}>
                {item.icon}
              </li>
            </Link>
          ))}
        </ul>

        <div className="w-[3rem] bg-stone-200 h-[1px] mt-3 mb-3"></div>

        <ul className="mt-5 flex flex-col">
          <button>
            <li className={menuItemDefaultClass}>
              <DoorOpen size={iconDefaultSize} weight="fill" />
            </li>
          </button>
        </ul>
      </aside>
    </section>
  ) : (
    <section className="flex flex-col justify-start p-3 animate__animated animate__fadeInLeftBig h-screen">
      <div className="flex flex-col gap-1">
        <div className="flex flex-row gap-2 items-center">
          <GiWool className="text-stone-50 text-3xl mb-2" />
          <span className="text-stone-50 font-bebas text-2xl">Dabru Ateliê</span>
        </div>
        <h1 className="font-blinker text-stone-400 text-md"> painel de gerenciamento do ateliê</h1>
        <aside className="flex flex-row items-center">
          <div className="w-[10rem] bg-stone-200 h-[1px]"></div>
          <button className="flex flex-row gap-0 text-stone-200 items-center hover:text-stone-400 font-light font-blinker transition-all" onClick={() => handleCloseMenu()}> <CaretLeft weight="light" /> Minimize </button>
        </aside>
      </div>
      <aside className="flex flex-col justify-center mt-2">
        <h1 className="font-blinker font-semibold text-sm text-stone-50 uppercase select-none mb-2"> Menu Principal </h1>
        <ul className="flex flex-col gap-2">
          {principal_menu.map((item, i) => (
            <Link to={item.link}>
              <li key={i} className={activeRoute(defaultRoute + item.link) ? menuItemActiveClass : menuItemDefaultClass}>
                {item.icon}
                {item.name}
              </li>
            </Link>
          ))}
        </ul>
        <h1 className="font-blinker font-semibold text-sm text-stone-50 uppercase select-none mt-3 mb-2"> Ajuda & Suporte </h1>
        <ul className="flex flex-col gap-2">
          {helpAndSupport.map((item, i) => (
            <Link to={item.link} preventScrollReset reloadDocument={false}>
              <li key={i} className={activeRoute(defaultRoute + item.link) ? menuItemActiveClass : menuItemDefaultClass}>
                {item.icon}
                {item.name}
              </li>
            </Link>
          ))}
        </ul>

        <ul className="mt-5 flex flex-col">
          <button>
            <li className={menuItemDefaultClass}>
              <DoorOpen size={iconDefaultSize} weight="fill" /> Fazer Logout
            </li>
          </button>
        </ul>
      </aside>


    </section>
  )
}

export default DashboardSideNav