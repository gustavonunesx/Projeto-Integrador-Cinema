import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Film, User, BarChart3 } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()

  const menuItems = [
    { path: '/', label: 'Início', icon: Film },
    { path: '/cinemas', label: 'Cinemas', icon: Film },
    { path: '/relatorios', label: 'Relatórios', icon: BarChart3 },
    { path: '/login', label: 'Minha Conta', icon: User }
  ]

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-gray-900/95 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2"
          >
            <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
              <Film className="text-white" size={20} />
            </div>
            <Link to="/" className="text-2xl font-bold text-white">
              Cine<span className="text-red-500">Max</span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    location.pathname === item.path 
                      ? 'bg-red-500 text-white shadow-lg' 
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="md:hidden p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-gray-800/95 backdrop-blur-md border-t border-gray-700 overflow-hidden"
            >
              <div className="py-4 space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="flex items-center space-x-3 px-4 py-3 text-lg transition-all duration-300 hover:bg-gray-700 hover:text-red-400 rounded-lg"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Icon size={20} />
                      <span>{item.label}</span>
                    </Link>
                  )
                })}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}

export default Header