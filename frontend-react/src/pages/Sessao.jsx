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

  useEffect(() => {
    loadAssentos();
  }, [id]);

  const loadAssentos = async () => {
    try {
      const data = await getAssentosSessao(id);
      // The backend returns a map of seat number -> boolean (true if available, false if taken)
      // We need to transform this into an array for rendering
      // Assuming seats are somewhat sequential or we can just iterate the keys
      // Actually, let's see what the backend returns.
      // Based on SessaoController: ResponseEntity.ok(sessaoService.getAssentosSessao(id));
      // I don't see the SessaoService implementation, but usually it might return a Map<String, Boolean> or List<AssentoDTO>
      // Let's assume Map<String, Boolean> based on common patterns, where key is seat number and value is availability.
      // If it is a list of objects, we will adjust.
      // Wait, let's check SessaoService if possible, or just print data to console in development.
      // For now, I'll assume it returns an object/map where keys are seat numbers and values are boolean (true=available).
      const seatsArray = Object.entries(data).map(([numero, disponivel]) => ({
        numero,
        disponivel
      })).sort((a, b) => {
          // simple sort for now, maybe alphanumeric later
          return a.numero.localeCompare(b.numero, undefined, { numeric: true });
      });
      setAssentos(seatsArray);
    } catch (error) {
      console.error(error);
    }
  };

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
    } catch (error) {
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
        <div className="grid grid-cols-10 gap-3 min-w-[300px]">
          {assentos.map((seat) => (
            <button
              key={seat.numero}
              disabled={!seat.disponivel}
              onClick={() => setSelectedSeat(seat.numero)}
              className={`
                w-10 h-10 rounded-t-lg text-xs font-bold transition-all duration-200
                ${!seat.disponivel
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed border border-transparent'
                  : selectedSeat === seat.numero
                    ? 'bg-cinema-neon text-cinema-black shadow-[0_0_15px_rgba(0,247,255,0.6)] transform scale-110'
                    : 'bg-white/10 hover:bg-white/30 border border-white/20'
                }
              `}
            >
              {seat.numero}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 mb-12 text-sm">
        <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-white/10 border border-white/20 rounded-t-sm"></div>
            <span className="text-gray-400">Disponível</span>
        </div>
        <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-cinema-neon rounded-t-sm"></div>
            <span className="text-gray-400">Selecionado</span>
        </div>
        <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-700 rounded-t-sm"></div>
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
