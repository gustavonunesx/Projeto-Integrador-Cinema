import { motion } from 'framer-motion'
import { useParams } from 'react-router-dom'

const Movie = () => {
  const { id } = useParams()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-20"
    >
      <div className="container mx-auto px-4">
        <motion.h1
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-4xl font-bold text-center mb-8"
        >
          Página do Filme: {id}
        </motion.h1>
        <motion.p
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-center text-gray-400"
        >
          Esta página está em desenvolvimento. Em breve terá todas as funcionalidades.
        </motion.p>
      </div>
    </motion.div>
  )
}

export default Movie