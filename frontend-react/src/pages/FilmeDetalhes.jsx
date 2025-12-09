import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getFilmeById } from '../services/filmeService';
import { getSessoesPorFilme } from '../services/sessaoService';
import { Calendar, Clock, MapPin, Tag, Star } from 'lucide-react';
import { format } from 'date-fns';
import { getImageUrl } from '../utils/imageUtils';

const FilmeDetalhes = () => {
  const { id } = useParams();
  const [filme, setFilme] = useState(null);
  const [sessoes, setSessoes] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    getFilmeById(id).then(setFilme).catch(console.error);
  }, [id]);

  useEffect(() => {
    if (filme) {
      getSessoesPorFilme(id, selectedDate).then(setSessoes).catch(console.error);
    }
  }, [id, filme, selectedDate]);

  if (!filme) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cinema-neon"></div></div>;

  return (
    <div>
       {/* Banner Backdrop */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-cinema-dark via-cinema-dark/80 to-transparent z-10" />
        <img
          src={getImageUrl(filme.bannerUrl || filme.posterUrl)}
          alt={filme.titulo}
          className="w-full h-full object-cover object-top blur-sm"
          onError={(e) => {
             if (filme.posterUrl && e.target.src !== getImageUrl(filme.posterUrl)) {
                 e.target.src = getImageUrl(filme.posterUrl);
             }
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-64 relative z-20 pb-12">
        <div className="flex flex-col md:flex-row gap-10">
          {/* Poster */}
          <div className="flex-shrink-0 w-64 md:w-80 mx-auto md:mx-0">
            <img
              src={getImageUrl(filme.posterUrl)}
              alt={filme.titulo}
              className="w-full rounded-xl shadow-2xl border-4 border-white/10"
            />
          </div>

          {/* Info */}
          <div className="flex-grow text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{filme.titulo}</h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-8 text-sm md:text-base">
              <span className="flex items-center gap-1 text-cinema-neon"><Clock className="w-4 h-4"/> {filme.duracao}</span>
              <span className="flex items-center gap-1"><Tag className="w-4 h-4"/> {filme.genero}</span>
              <span className="border border-white/30 px-2 py-0.5 rounded font-mono">{filme.classificacao}</span>
            </div>

            <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-3xl">{filme.descricao}</p>

             {/* Sessions */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/10">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Calendar className="text-cinema-neon" />
                Sessões Disponíveis
              </h3>

              <div className="mb-6">
                <label className="block text-sm text-gray-400 mb-2">Escolha a data:</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-black/40 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cinema-neon"
                />
              </div>

              {sessoes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {sessoes.map(sessao => (
                    <Link
                      key={sessao.id}
                      to={`/sessao/${sessao.id}`}
                      className="group flex flex-col p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cinema-neon/50 rounded-xl transition-all duration-300"
                    >
                      <div className="flex justify-between items-center mb-2">
                         <span className="text-2xl font-bold text-white group-hover:text-cinema-neon transition-colors">{sessao.horario.substring(0, 5)}</span>
                         <span className="text-xs bg-white/10 px-2 py-1 rounded">{sessao.tipoExibicao || '2D'}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-400">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Sala {sessao.sala.numero}</span>
                        <span>R$ {sessao.preco.toFixed(2)}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 py-4">Não há sessões para esta data.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilmeDetalhes;
