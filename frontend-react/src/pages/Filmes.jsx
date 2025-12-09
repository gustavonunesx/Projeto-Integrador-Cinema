import React, { useEffect, useState } from 'react';
import { getFilmes, searchFilmes } from '../services/filmeService';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';

const Filmes = () => {
  const [filmes, setFilmes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadFilmes();
  }, []);

  const loadFilmes = async () => {
    try {
      const data = await getFilmes();
      setFilmes(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      try {
        const data = await searchFilmes(searchTerm);
        setFilmes(data);
      } catch (error) {
        console.error(error);
      }
    } else {
      loadFilmes();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <h1 className="text-4xl font-bold">Catálogo Completo</h1>
        <form onSubmit={handleSearch} className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Buscar filmes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-full py-3 px-6 pl-12 text-white placeholder-gray-400 focus:outline-none focus:border-cinema-neon focus:ring-1 focus:ring-cinema-neon transition-all"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </form>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {filmes.map(filme => (
          <Link key={filme.id} to={`/filme/${filme.id}`} className="group relative rounded-xl overflow-hidden aspect-[2/3] bg-gray-800 border border-white/5 hover:border-cinema-neon/50 transition-all duration-300">
            <img
              src={filme.posterUrl}
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
      {filmes.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          Nenhum filme encontrado.
        </div>
      )}
    </div>
  );
};

export default Filmes;
