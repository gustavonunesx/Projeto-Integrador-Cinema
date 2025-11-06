import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import MovieCard from '../MovieCard/MovieCard'

const MoviesSlider = ({ movies = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [slidesPerView, setSlidesPerView] = useState(4)
  const sliderRef = useRef(null)

  useEffect(() => {
    const updateSlidesPerView = () => {
      const width = window.innerWidth
      if (width < 640) setSlidesPerView(1)
      else if (width < 768) setSlidesPerView(2)
      else if (width < 1024) setSlidesPerView(3)
      else setSlidesPerView(4)
    }

    updateSlidesPerView()
    window.addEventListener('resize', updateSlidesPerView)
    return () => window.removeEventListener('resize', updateSlidesPerView)
  }, [])

  const maxIndex = Math.max(0, movies.length - slidesPerView)

  const next = () => {
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex))
  }

  const prev = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0))
  }

  if (movies.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">Nenhum filme disponível no momento.</p>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Controles */}
      <div className="flex justify-between items-center mb-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={prev}
          disabled={currentIndex === 0}
          className="p-3 bg-gray-800 hover:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
        >
          <ChevronLeft className="text-white" size={24} />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={next}
          disabled={currentIndex >= maxIndex}
          className="p-3 bg-gray-800 hover:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
        >
          <ChevronRight className="text-white" size={24} />
        </motion.button>
      </div>

      {/* Slider */}
      <div className="overflow-hidden">
        <motion.div
          ref={sliderRef}
          className="grid gap-6"
          style={{
            gridTemplateColumns: `repeat(${movies.length}, 1fr)`,
            transform: `translateX(-${currentIndex * (100 / slidesPerView)}%)`
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {movies.map((movie, index) => (
            <div key={movie.id} className="w-full">
              <MovieCard movie={movie} index={index} />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Indicadores */}
      <div className="flex justify-center space-x-2 mt-8">
        {Array.from({ length: maxIndex + 1 }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-red-500 w-6' 
                : 'bg-gray-600 hover:bg-gray-500'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export default MoviesSlider