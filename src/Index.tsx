import { Outlet } from "react-router-dom"

function Index() {

  return (
    <>
      <section>
        <Outlet />
      </section>
    </>
  )
}

export default Index
