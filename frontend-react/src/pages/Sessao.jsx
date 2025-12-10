import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAssentosSessao, reservarAssento } from '../services/sessaoService';
import { Monitor, Check } from 'lucide-react';

const Sessao = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assentos, setAssentos] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [cpf, setCpf] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const loadAssentos = async () => {
    try {
      const data = await getAssentosSessao(id);

      // Transform map to array with row/col info
      const seatsArray = Object.entries(data).map(([numero, disponivel]) => {
        const row = numero.charAt(0);
        const col = parseInt(numero.substring(1));
        return {
          numero,
          disponivel,
          row,
          col
        };
      }).sort((a, b) => {
          if (a.row === b.row) return a.col - b.col;
          return a.row.localeCompare(b.row);
      });
      setAssentos(seatsArray);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadAssentos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Group seats by row
  const rows = [...new Set(assentos.map(s => s.row))].sort();

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!selectedSeat || !cpf) return;

    setLoading(true);
    try {
      await reservarAssento(id, selectedSeat, cpf);
      setMessage({ type: 'success', text: 'Reserva realizada com sucesso!' });
      loadAssentos(); // Refresh seats
      setSelectedSeat(null);
      setCpf('');
      setTimeout(() => {
          navigate('/');
      }, 2000);
    } catch {
      setMessage({ type: 'error', text: 'Erro ao realizar reserva. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Selecione seu Assento</h1>

      {/* Screen */}
      <div className="mb-12">
        <div className="w-full h-2 bg-cinema-neon shadow-[0_0_20px_rgba(0,247,255,0.5)] rounded-full mb-4 mx-auto max-w-2xl"></div>
        <p className="text-center text-gray-500 text-sm flex items-center justify-center gap-2">
            <Monitor className="w-4 h-4"/> TELA
        </p>
      </div>

      {/* Seats Grid */}
      <div className="flex justify-center mb-12 overflow-x-auto">
        <div className="bg-[#0c0c0c] p-8 rounded-lg border border-white/10 shadow-2xl min-w-fit">
          <div className="flex flex-col gap-2">
            {rows.map(rowLetter => (
              <div key={rowLetter} className="flex justify-center gap-2 items-center">
                <span className="w-4 text-gray-500 text-[10px] font-bold">{rowLetter}</span>
                {assentos.filter(s => s.row === rowLetter).map((seat) => (
                  <button
                    key={seat.numero}
                    disabled={!seat.disponivel}
                    onClick={() => setSelectedSeat(seat.numero)}
                    className={`
                      w-8 h-8 rounded text-[9px] font-bold transition-all duration-200 flex items-center justify-center
                      ${!seat.disponivel
                        ? 'bg-[#e50914] opacity-70 cursor-not-allowed'
                        : selectedSeat === seat.numero
                          ? 'bg-[#4CAF50] scale-110 text-white shadow-[0_0_10px_rgba(76,175,80,0.6)]'
                          : 'bg-[#444] text-[#111] hover:bg-[#666] hover:scale-110'
                      }
                    `}
                    title={`Assento ${seat.numero}`}
                  >
                    {seat.col}
                  </button>
                ))}
                 <span className="w-4 text-gray-500 text-[10px] font-bold text-right">{rowLetter}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 mb-12 text-sm">
        <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#444] rounded"></div>
            <span className="text-gray-400">Disponível</span>
        </div>
        <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#4CAF50] rounded"></div>
            <span className="text-gray-400">Selecionado</span>
        </div>
        <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#e50914] opacity-70 rounded"></div>
            <span className="text-gray-400">Ocupado</span>
        </div>
      </div>

      {/* Booking Form */}
      <div className="max-w-md mx-auto bg-white/5 border border-white/10 p-8 rounded-2xl">
        <h3 className="text-xl font-bold mb-6">Finalizar Reserva</h3>

        {message && (
          <div className={`p-4 rounded-lg mb-4 text-sm ${message.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleBooking} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Assento Selecionado</label>
            <input
              type="text"
              value={selectedSeat || 'Nenhum'}
              disabled
              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white disabled:text-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">CPF</label>
            <input
              type="text"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              placeholder="000.000.000-00"
              required
              className="w-full bg-black/40 border border-white/20 focus:border-cinema-neon rounded-lg px-4 py-2 text-white focus:outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={!selectedSeat || !cpf || loading}
            className="w-full bg-cinema-neon hover:bg-cyan-400 disabled:bg-gray-700 disabled:cursor-not-allowed text-cinema-black font-bold py-3 rounded-lg transition-all duration-300 flex justify-center items-center gap-2"
          >
            {loading ? 'Processando...' : <><Check className="w-5 h-5" /> Confirmar Reserva</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Sessao;
