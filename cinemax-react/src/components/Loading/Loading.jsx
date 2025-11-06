import { motion } from 'framer-motion'

export const Loading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full mx-auto mb-4"
        />
        <p className="text-white text-lg">Carregando CineMax...</p>
        <p className="text-gray-400 text-sm mt-2">Verificando configurações</p>
      </div>
    </div>
  )
}

export const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center py-8">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full"
      />
    </div>
  )
}