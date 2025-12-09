import React, { useEffect, useState } from 'react';
import { getFilmesEmCartaz } from '../services/filmeService';
import { Link } from 'react-router-dom';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { getImageUrl } from '../utils/imageUtils';
import { motion, AnimatePresence } from 'framer-motion';

const Home = () => {
  const [filmes, setFilmes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    getFilmesEmCartaz().then(setFilmes).catch(console.error);
  }, []);

  // Auto-play slider
  useEffect(() => {
    if (filmes.length === 0) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(interval);
  }, [currentIndex, filmes]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % Math.min(filmes.length, 5));
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + Math.min(filmes.length, 5)) % Math.min(filmes.length, 5));
  };

  const featuredMovies = filmes.slice(0, 5);
  const featuredMovie = featuredMovies[currentIndex];

  return (
    <div className="relative">
      {/* Hero Section */}
      <div className="relative h-[80vh] w-full overflow-hidden bg-cinema-black">
        <AnimatePresence mode='wait'>
          {featuredMovie && (
            <motion.div
              key={featuredMovie.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0"
            >
               <div className="absolute inset-0 bg-gradient-to-t from-cinema-dark via-cinema-dark/50 to-transparent z-10" />
               <div className="absolute inset-0 bg-gradient-to-r from-cinema-dark via-transparent to-transparent z-10" />

               <img
                src={getImageUrl(featuredMovie.bannerUrl || featuredMovie.posterUrl)}
                alt={featuredMovie.titulo}
                className="w-full h-full object-cover object-center"
                onError={(e) => {
                  if (featuredMovie.posterUrl && e.target.src !== getImageUrl(featuredMovie.posterUrl)) {
                     e.target.src = getImageUrl(featuredMovie.posterUrl);
                  }
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content */}
        <div className="absolute bottom-0 left-0 z-20 w-full p-8 md:p-16">
           <div className="max-w-7xl mx-auto w-full flex items-end justify-between">
              <div className="max-w-3xl">
                <AnimatePresence mode='wait'>
                  {featuredMovie && (
                    <motion.div
                      key={featuredMovie.id}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                    >
                      <span className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-wider text-cinema-black bg-cinema-neon rounded-full">
                        EM ESTREIA
                      </span>
                      <h1 className="text-4xl md:text-7xl font-bold mb-4 leading-tight drop-shadow-lg">{featuredMovie.titulo}</h1>
                      <div className="flex gap-4 mb-6 text-sm md:text-base text-gray-300">
                        <span className="bg-white/10 px-2 py-1 rounded border border-white/20">{featuredMovie.genero}</span>
                        <span className="bg-white/10 px-2 py-1 rounded border border-white/20">{featuredMovie.duracao}</span>
                        <span className="bg-white/10 px-2 py-1 rounded border border-white/20">{featuredMovie.classificacao}</span>
                      </div>
                      <p className="text-lg text-gray-300 mb-8 max-w-2xl line-clamp-3 drop-shadow-md">{featuredMovie.descricao}</p>

                      <div className="flex gap-4">
                        <Link
                          to={`/filme/${featuredMovie.id}`}
                          className="px-8 py-3 bg-cinema-red hover:bg-red-700 text-white font-bold rounded-lg transition-all duration-300 flex items-center gap-2 transform hover:scale-105 shadow-lg shadow-red-500/30"
                        >
                          <Play className="h-5 w-5 fill-current" />
                          Ver Sessões
                        </Link>
                        <Link
                          to={`/filmes`}
                          className="px-8 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-bold rounded-lg transition-all duration-300 border border-white/20 hover:border-cinema-neon"
                        >
                          Ver Todos
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Slider Controls */}
              <div className="hidden md:flex flex-col gap-4 items-end">
                <div className="flex gap-2">
                  <button
                    onClick={prevSlide}
                    className="p-3 rounded-full bg-white/10 hover:bg-cinema-neon hover:text-cinema-black transition-all border border-white/20 backdrop-blur-sm"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="p-3 rounded-full bg-white/10 hover:bg-cinema-neon hover:text-cinema-black transition-all border border-white/20 backdrop-blur-sm"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
                {/* Dots */}
                <div className="flex gap-2">
                  {featuredMovies.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        idx === currentIndex ? 'w-8 bg-cinema-neon' : 'w-2 bg-white/30 hover:bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </div>
           </div>
        </div>
      </div>

      {/* Movies Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
          <span className="w-1 h-8 bg-cinema-neon rounded-full block"></span>
          Em Cartaz
        </h2>
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
                <p className="text-sm text-cinema-neon">{filme.genero}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
