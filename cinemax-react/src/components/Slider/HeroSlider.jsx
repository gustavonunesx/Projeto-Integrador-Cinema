import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const HeroSlider = ({ movies = [] }) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const navigate = useNavigate()

  // Slides padrão caso não tenha dados
  const defaultMovies = [
    {
      id: 'duna-2',
      title: 'Duna: Parte Dois',
      description: 'A lenda continua na maior aventura do ano',
      image: '../images/duna.webp'
    },
    {
      id: 'deadpool-3',
      title: 'Deadpool & Wolverine',
      description: 'O duo mais explosivo dos cinemas',
      image: '../images/deadpool+e+wolverine+capa.webp'
    },
    {
      id: 'inside-out-2',
      title: 'Divertidamente 2',
      description: 'Novas emoções estão chegando',
      image: '../images/divertidamente.webp'
    }
  ]

  const slides = movies.length > 0 ? movies : defaultMovies

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [slides.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToSlide = (index) => {
    setCurrentSlide(index)
  }

  const handleBookTickets = () => {
    navigate(`/movie/${slides[currentSlide].id}`)
  }

  return (
    <section className="relative h-screen overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${slides[currentSlide].image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          {/* Overlay escuro */}
          <div className="absolute inset-0 bg-black/50" />
          
          {/* Overlay gradiente */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Conteúdo do Slide */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="max-w-2xl"
            >
              <motion.h1
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
              >
                {slides[currentSlide].title}
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed"
              >
                {slides[currentSlide].description}
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleBookTickets}
                  className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-300 shadow-2xl"
                >
                  Comprar Ingressos
                </motion.button>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Controles */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full p-3 transition-all duration-300"
      >
        <ChevronLeft className="text-white" size={24} />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full p-3 transition-all duration-300"
      >
        <ChevronRight className="text-white" size={24} />
      </button>

      {/* Indicadores */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-red-500 w-8' 
                : 'bg-white/50 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </section>
  )
}

export default HeroSlider