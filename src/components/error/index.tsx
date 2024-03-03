

function ErrorPage() {    
    const handleBack = () => {
        window.location.href = '/dashboard/home'    
    }

  return (
    <div className="flex flex-col justify-center items-center bg-stone-700 rounded-lg">
        <h1 className="font-bebas font-3xl text-stone-50">404 - Page Not Found</h1>
        <button onClick={handleBack} className="bg-red-900 text-stone-50 p-5 rounded-lg hover:bg-red-500 hover:text-stone-300">Voltar para a Home</button>         
    </div>
  )
}

export default ErrorPage