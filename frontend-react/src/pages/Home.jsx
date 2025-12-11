import React, { useEffect, useState, useRef } from 'react';
import { getFilmesEmCartaz } from '../services/filmeService';
import { Link } from 'react-router-dom';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { getImageUrl } from '../utils/imageUtils';
import { motion, AnimatePresence } from 'framer-motion';

const Home = () => {
  const [filmes, setFilmes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Carrega os filmes do backend
  useEffect(() => {
    getFilmesEmCartaz().then(setFilmes).catch(console.error);
  }, []);

  const featuredMovies = filmes.slice(0, 5);

  useEffect(() => {
    if (featuredMovies.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [featuredMovies.length]);

  const nextSlide = () => {
      setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
  };

  const prevSlide = () => {
      setCurrentIndex((prev) => (prev - 1 + featuredMovies.length) % featuredMovies.length);
  };

  return (
    <div className="relative">
      {/* Hero Carousel */}
      {featuredMovies.length > 0 && (
          <div className="relative h-[80vh] w-full overflow-hidden bg-black">
             <AnimatePresence mode='wait'>
                {featuredMovies.map((movie, index) => (
                    index === currentIndex && (
                        <motion.div
                            key={movie.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.7 }}
                            className="absolute inset-0"
                        >
                             {/* Background Image & Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-cinema-dark via-cinema-dark/50 to-transparent z-10" />
                            <img
                                src={getImageUrl(movie.bannerUrl || movie.posterUrl)}
                                alt={movie.titulo}
                                className="w-full h-full object-cover object-center"
                                 onError={(e) => {
                                    if (movie.posterUrl && e.target.src !== getImageUrl(movie.posterUrl)) {
                                        e.target.src = getImageUrl(movie.posterUrl);
                                    }
                                }}
                            />

                            {/* Content */}
                            <div className="absolute bottom-0 left-0 z-20 w-full p-8 md:p-16">
                                <div className="max-w-4xl">
                                    <motion.span
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                        className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-wider text-cinema-black bg-cinema-neon rounded-full"
                                    >
                                        DESTAQUE
                                    </motion.span>
                                    <motion.h1
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.4 }}
                                        className="text-5xl md:text-7xl font-bold mb-4 leading-tight"
                                    >
                                        {movie.titulo}
                                    </motion.h1>
                                    <motion.p
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.5 }}
                                        className="text-lg text-gray-300 mb-8 max-w-2xl line-clamp-3"
                                    >
                                        {movie.descricao}
                                    </motion.p>
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.6 }}
                                        className="flex gap-4"
                                    >
                                        <Link
                                            to={`/filme/${movie.id}`}
                                            className="px-8 py-3 bg-cinema-red hover:bg-red-700 text-white font-bold rounded-lg transition-all duration-300 flex items-center gap-2 transform hover:scale-105"
                                        >
                                            <Play className="h-5 w-5 fill-current" />
                                            Ver Sessões
                                        </Link>
                                        <Link
                                            to={`/filmes`}
                                            className="px-8 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-bold rounded-lg transition-all duration-300 border border-white/20"
                                        >
                                            Ver Todos
                                        </Link>
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    )
                ))}
             </AnimatePresence>

             {/* Navigation Arrows */}
             <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 bg-black/30 hover:bg-cinema-neon/20 rounded-full text-white hover:text-cinema-neon transition-all border border-white/10 hover:border-cinema-neon">
                <ChevronLeft size={32} />
             </button>
             <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 bg-black/30 hover:bg-cinema-neon/20 rounded-full text-white hover:text-cinema-neon transition-all border border-white/10 hover:border-cinema-neon">
                <ChevronRight size={32} />
             </button>

             {/* Indicators */}
             <div className="absolute bottom-8 right-8 z-30 flex gap-2">
                {featuredMovies.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-cinema-neon' : 'w-4 bg-white/30 hover:bg-white/50'}`}
                    />
                ))}
             </div>
          </div>
      )}

      {/* Movies Grid (Rest of the page) */}
       <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
          <span className="w-1 h-8 bg-cinema-neon rounded-full block"></span>
          Em Cartaz
        </h2>
        {filmes.length === 0 ? (
            <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cinema-neon"></div>
            </div>
        ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {filmes.map(filme => (
                <Link key={filme.id} to={`/filme/${filme.id}`} className="group relative rounded-xl overflow-hidden aspect-[2/3] bg-gray-800 border border-white/5 hover:border-cinema-neon/50 transition-all duration-300">
                <img
                    src={getImageUrl(filme.posterUrl)}
                    alt={filme.titulo}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <h3 className="font-bold text-lg leading-tight mb-1">{filme.titulo}</h3>
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-cinema-neon">{filme.genero}</p>
                        <span className="text-xs border border-white/30 px-1 rounded">{filme.classificacao}</span>
                    </div>
                </div>
                </Link>
            ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default Home;