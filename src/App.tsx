import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { TopicsSection } from './components/TopicsSection'

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <TopicsSection />
      <Footer />
    </div>
  )
}

export default App
