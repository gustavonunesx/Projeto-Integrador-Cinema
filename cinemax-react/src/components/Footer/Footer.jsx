import { motion } from 'framer-motion'
import { Film, Mail, Phone, Facebook, Instagram, Twitter } from 'lucide-react'

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="bg-gray-900 border-t border-gray-800"
    >
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                <Film className="text-white" size={20} />
              </div>
              <h3 className="text-2xl font-bold text-white">
                Cine<span className="text-red-500">Max</span>
              </h3>
            </div>
            <p className="text-gray-400 leading-relaxed">
              O CineMax é a maior rede de cinemas do país, oferecendo a melhor experiência 
              em entretenimento com tecnologia de ponta e conforto incomparável.
            </p>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-semibold text-white">Contato</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-400">
                <Mail size={18} />
                <span>contato@cinemax.com</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <Phone size={18} />
                <span>(11) 1234-5678</span>
              </div>
            </div>
          </motion.div>

          {/* Social */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-semibold text-white">Redes Sociais</h3>
            <div className="flex space-x-4">
              {[
                { icon: Facebook, href: 'https://facebook.com', color: 'hover:text-blue-500' },
                { icon: Instagram, href: 'https://instagram.com', color: 'hover:text-pink-500' },
                { icon: Twitter, href: 'https://twitter.com', color: 'hover:text-blue-400' }
              ].map((social, index) => (
                <motion.a
                  key={index}
                  whileHover={{ scale: 1.1, y: -2 }}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-3 bg-gray-800 rounded-lg text-gray-400 transition-colors ${social.color}`}
                >
                  <social.icon size={20} />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400"
        >
          <p>&copy; 2024 CineMax. Todos os direitos reservados.</p>
        </motion.div>
      </div>
    </motion.footer>
  )
}

export default Footer