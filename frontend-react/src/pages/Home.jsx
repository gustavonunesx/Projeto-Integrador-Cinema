import React, { useEffect, useState, useRef } from 'react';
import { getFilmesEmCartaz } from '../services/filmeService';
import { Link } from 'react-router-dom';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { getImageUrl } from '../utils/imageUtils';

const Home = () => {
  const [filmes, setFilmes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const autoPlayRef = useRef(null);

  // Carrega os filmes do backend
  useEffect(() => {
    getFilmesEmCartaz().then(setFilmes).catch(console.error);
  }, []);

  // Auto-play do carrossel - CORRIGIDO
  useEffect(() => {
    if (filmes.length <= 1) return; // Não faz sentido auto-play com 1 filme

    // Limpa o intervalo anterior se existir
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }

    // Cria novo intervalo
    autoPlayRef.current = setInterval(() => {
      nextSlide();
    }, 5000);

    // Cleanup: limpa quando o componente desmontar
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [filmes.length]); // Agora só depende do tamanho do array, não do currentIndex

  const nextSlide = () => {
    if (isTransitioning || filmes.length === 0) return;
    
    setIsTransitioning(true);
    setImageLoaded(false); // Reset para nova imagem
    
    // Aguarda um pouquinho antes de mudar o índice
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % filmes.length);
      
      // Depois de mudar, aguarda a animação completar
      setTimeout(() => {
        setIsTransitioning(false);
        setImageLoaded(true); // Inicia o zoom
      }, 300);
    }, 100);
  };

  const prevSlide = () => {
    if (isTransitioning || filmes.length === 0) return;
    
    setIsTransitioning(true);
    setImageLoaded(false); // Reset para nova imagem
    
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + filmes.length) % filmes.length);
      
      setTimeout(() => {
        setIsTransitioning(false);
        setImageLoaded(true); // Inicia o zoom
      }, 300);
    }, 100);
  };

  const goToSlide = (index) => {
    if (isTransitioning || index === currentIndex) return;
    
    setIsTransitioning(true);
    setImageLoaded(false); // Reset para nova imagem
    
    setTimeout(() => {
      setCurrentIndex(index);
      
      setTimeout(() => {
        setIsTransitioning(false);
        setImageLoaded(true); // Inicia o zoom
      }, 300);
    }, 100);
  };

  if (filmes.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cinema-neon"></div>
      </div>
    );
  }

  const currentMovie = filmes[currentIndex];

  return (
    <div className="relative">
      {/* Hero Carousel Section */}
      <div className="relative h-[80vh] w-full overflow-hidden">
        {/* Background Image com Transição e Zoom Progressivo */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-t from-cinema-dark via-cinema-dark/50 to-transparent z-10" />
          <div
            className="absolute inset-0 transition-all duration-700 ease-in-out"
            style={{
              opacity: isTransitioning ? 0 : 1,
              transform: isTransitioning ? 'scale(1.1)' : 'scale(1)'
            }}
          >
            <img
              key={currentMovie.id}
              src={getImageUrl(currentMovie.bannerUrl || currentMovie.posterUrl)}
              alt={currentMovie.titulo}
              className="w-full h-full object-cover object-center transition-transform ease-linear"
              style={{
                transform: imageLoaded ? 'scale(1.15)' : 'scale(1)',
                transitionDuration: '5000ms' // Zoom suave durante 5 segundos
              }}
              onLoad={() => setImageLoaded(true)}
              onError={(e) => {
                if (currentMovie.posterUrl && e.target.src !== getImageUrl(currentMovie.posterUrl)) {
                  e.target.src = getImageUrl(currentMovie.posterUrl);
                }
              }}
            />
          </div>
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          disabled={isTransitioning}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-black/50 hover:bg-black/70 backdrop-blur-sm p-3 rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Filme anterior"
        >
          <ChevronLeft className="w-8 h-8 text-white" />
        </button>

        <button
          onClick={nextSlide}
          disabled={isTransitioning}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-black/50 hover:bg-black/70 backdrop-blur-sm p-3 rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Próximo filme"
        >
          <ChevronRight className="w-8 h-8 text-white" />
        </button>

        {/* Movie Information com Transição CORRIGIDA */}
        <div className="absolute bottom-0 left-0 z-20 w-full p-8 md:p-16">
          <div
            className="max-w-4xl transition-all duration-700 ease-in-out"
            style={{
              opacity: isTransitioning ? 0 : 1,
              transform: isTransitioning ? 'translateY(20px)' : 'translateY(0)'
            }}
          >
            <span className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-wider text-cinema-black bg-cinema-neon rounded-full">
              EM DESTAQUE
            </span>
            <h1 className="text-5xl md:text-7xl font-bold mb-4 leading-tight">
              {currentMovie.titulo}
            </h1>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl line-clamp-3">
              {currentMovie.descricao}
            </p>
            <div className="flex gap-4">
              <Link
                to={`/filme/${currentMovie.id}`}
                className="px-8 py-3 bg-cinema-red hover:bg-red-700 text-white font-bold rounded-lg transition-all duration-300 flex items-center gap-2 transform hover:scale-105"
              >
                <Play className="h-5 w-5 fill-current" />
                Ver Sessões
              </Link>
              <Link
                to="/filmes"
                className="px-8 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-bold rounded-lg transition-all duration-300 border border-white/20"
              >
                Ver Todos
              </Link>
            </div>
          </div>
        </div>

        {/* Slide Indicators (bolinhas) */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {filmes.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              disabled={isTransitioning}
              className={`transition-all duration-300 rounded-full disabled:cursor-not-allowed ${
                index === currentIndex
                  ? 'w-8 h-2 bg-cinema-neon'
                  : 'w-2 h-2 bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Ir para filme ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Movies Grid - Lista completa abaixo */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
          <span className="w-1 h-8 bg-cinema-neon rounded-full block"></span>
          Em Cartaz
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filmes.map((filme) => (
            <Link
              key={filme.id}
              to={`/filme/${filme.id}`}
              className="group relative rounded-xl overflow-hidden aspect-[2/3] bg-gray-800 border border-white/5 hover:border-cinema-neon/50 transition-all duration-300"
            >
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