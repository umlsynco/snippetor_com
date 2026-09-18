import { Route, Routes, useLocation } from 'react-router-dom'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Home } from './pages/Home'
import { Play } from './pages/Play'
import { Theme } from './pages/Theme'

function App() {
  const location = useLocation()
  const isPlayRoute = /\/play\//.test(location.pathname)

  return (
    <div className="min-h-screen bg-white">
      {!isPlayRoute && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:theme/play/:snippetId" element={<Play />} />
        <Route path="/:theme" element={<Theme />} />
      </Routes>
      {!isPlayRoute && <Footer />}
    </div>
  )
}

export default App
