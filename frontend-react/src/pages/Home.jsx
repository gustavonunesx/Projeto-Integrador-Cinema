import React, { useEffect, useState } from 'react';
import { getFilmesEmCartaz } from '../services/filmeService';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';
import { getImageUrl } from '../utils/imageUtils';

const Home = () => {
  const [filmes, setFilmes] = useState([]);

  useEffect(() => {
    getFilmesEmCartaz().then(setFilmes).catch(console.error);
  }, []);

  const featuredMovie = filmes[0];

  return (
    <div className="relative">
      {/* Hero Section */}
      {featuredMovie && (
        <div className="relative h-[80vh] w-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-cinema-dark via-cinema-dark/50 to-transparent z-10" />
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
          <div className="absolute bottom-0 left-0 z-20 w-full p-8 md:p-16">
            <div className="max-w-4xl">
              <span className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-wider text-cinema-black bg-cinema-neon rounded-full">
                EM ESTREIA
              </span>
              <h1 className="text-5xl md:text-7xl font-bold mb-4 leading-tight">{featuredMovie.titulo}</h1>
              <p className="text-lg text-gray-300 mb-8 max-w-2xl line-clamp-3">{featuredMovie.descricao}</p>
              <div className="flex gap-4">
                 <Link
                  to={`/filme/${featuredMovie.id}`}
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
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Movies Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
          <span className="w-1 h-8 bg-cinema-neon rounded-full block"></span>
          Em Cartaz
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filmes.map(filme => (
            <Link key={filme.id} to={`/filme/${filme.id}`} className="group relative rounded-xl overflow-hidden aspect-[2/3] bg-gray-800">
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
