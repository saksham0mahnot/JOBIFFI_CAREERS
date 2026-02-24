import './App.css'
import Header from './Component/Header/Header'
import Footer from './Component/Footer/Footer'
import Home from './Component/Home/Home'

function App() {
  return (
    <div className="flex flex-col min-h-screen w-full font-sans bg-white">
      <Header />
      <main className="flex-1 flex flex-col w-full">
        <Home />
      </main>
      <Footer />
    </div>
  )
}

export default App
