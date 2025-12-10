import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAssentosSessao, reservarAssento } from '../services/sessaoService';
import { Monitor, Check } from 'lucide-react';

const Sessao = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assentos, setAssentos] = useState([]);
  // ALTERAÇÃO 1: Mudar para array para armazenar múltiplos assentos
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [cpf, setCpf] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const loadAssentos = async () => {
    try {
      // O endpoint /sessoes/{id}/assentos retorna { sessao: {...}, assentos: [...] }
      const response = await getAssentosSessao(id); 
      
      if (!response.assentos || !Array.isArray(response.assentos)) {
          console.error("Resposta da API de assentos inválida:", response);
          setError("Erro ao carregar o layout da sala.");
          return;
      }

      const seatsArray = response.assentos.map(seat => {
        const row = seat.numeroAssento.charAt(0);
        const colMatch = seat.numeroAssento.substring(1); 
        const col = parseInt(colMatch);
        
        return {
          ...seat,
          row,
          col
        };
      }).sort((a, b) => {
          if (a.row === b.row) return a.col - b.col;
          return a.row.localeCompare(b.row);
      });
      
      setAssentos(seatsArray);
      setError(null);

    } catch (error) {
      console.error("Erro ao carregar assentos:", error);
      setError("Erro ao se comunicar com o servidor. Tente novamente mais tarde.");
    }
  };
  
  // LÓGICA DE SELEÇÃO DE ASSENTO
  const toggleSeatSelection = (seatNumber) => {
    // ALTERAÇÃO 2: Adiciona ou remove o assento do array
    setSelectedSeats(prevSeats => {
      if (prevSeats.includes(seatNumber)) {
        // Se já está selecionado, remove
        return prevSeats.filter(seat => seat !== seatNumber);
      } else {
        // Se não está selecionado, adiciona
        return [...prevSeats, seatNumber];
      }
    });
  };

  useEffect(() => {
    loadAssentos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Encontra o número máximo de colunas para definir o layout do grid
  const maxCol = assentos.reduce((max, seat) => Math.max(max, seat.col), 0);

  // Group seats by row (apenas letras únicas)
  const rows = [...new Set(assentos.map(s => s.row))].sort();

  const handleBooking = async (e) => {
    e.preventDefault();
    // ALTERAÇÃO 3: Verificar selectedSeats
    if (selectedSeats.length === 0 || !cpf) {
        setMessage({ type: 'error', text: 'Selecione pelo menos um assento e digite o CPF.' });
        return;
    };

    setLoading(true);
    setMessage(null);
    try {
      // ALTERAÇÃO 4: Itera sobre selectedSeats para reservar cada um
      for (const assento of selectedSeats) {
        // Chama a API de reserva para cada assento selecionado
        await reservarAssento(id, assento, cpf);
      }
      
      // Se todas as reservas forem bem-sucedidas
      setMessage({ type: 'success', text: `Reserva de ${selectedSeats.length} assento(s) realizada com sucesso!` });
      loadAssentos(); // Refresh seats
      // ALTERAÇÃO 5: Limpar selectedSeats
      setSelectedSeats([]);
      setCpf('');
      setTimeout(() => {
          navigate('/');
      }, 2000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Erro ao realizar reserva. Um ou mais assentos podem estar ocupados.';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  // Se houver um erro geral de carregamento
  if (error) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-64px)]">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  // Se a lista de assentos estiver vazia (carregando)
  if (assentos.length === 0) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-64px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cinema-neon"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Selecione seu Assento</h1>

      {message && (
          <div className={`max-w-md mx-auto p-4 rounded-lg mb-8 text-sm ${message.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
            {message.text}
          </div>
      )}

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
              <div 
                key={rowLetter} 
                className="flex justify-center gap-2 items-center"
                style={{ 
                    display: 'grid', 
                    gridTemplateColumns: `auto repeat(${maxCol}, 1fr) auto`, 
                    gap: '8px'
                }}
              >
                {/* Indicador de Linha Esquerda */}
                <span className="text-gray-500 text-[10px] font-bold self-center justify-self-end">{rowLetter}</span>
                
                {/* Renderização dos Assentos da Linha */}
                {Array.from({ length: maxCol }, (_, colIndex) => {
                    const colNum = colIndex + 1;
                    const seat = assentos.find(s => s.row === rowLetter && s.col === colNum);
                    
                    if (seat) {
                        const isSelected = selectedSeats.includes(seat.numeroAssento);
                        
                        // Renderiza o botão do assento real
                        return (
                            <button
                                key={seat.id}
                                disabled={seat.status !== 'DISPONIVEL'} 
                                // ALTERAÇÃO 6: Chamar a nova função de toggle
                                onClick={() => toggleSeatSelection(seat.numeroAssento)}
                                className={`
                                    w-8 h-8 rounded text-[9px] font-bold transition-all duration-200 flex items-center justify-center
                                    ${seat.status !== 'DISPONIVEL'
                                        ? 'bg-[#e50914] opacity-70 cursor-not-allowed'
                                        // ALTERAÇÃO 7: Verificar se está no array de selectedSeats
                                        : isSelected
                                            ? 'bg-[#4CAF50] scale-110 text-white shadow-[0_0_10px_rgba(76,175,80,0.6)]'
                                            : 'bg-[#444] text-[#111] hover:bg-[#666] hover:scale-110'
                                    }
                                `}
                                title={`Assento ${seat.numeroAssento}`}
                            >
                                {seat.col}
                            </button>
                        );
                    } else {
                        // Renderiza um espaço vazio se não houver assento nesta posição
                        return <div key={`${rowLetter}-${colNum}-empty`} className="w-8 h-8 opacity-0 pointer-events-none"></div>;
                    }
                })}
                 {/* Indicador de Linha Direita */}
                 <span className="text-gray-500 text-[10px] font-bold self-center justify-self-start">{rowLetter}</span>
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
            <span className="text-gray-400">Ocupado/Reservado</span>
        </div>
      </div>

      {/* Booking Form */}
      <div className="max-w-md mx-auto bg-white/5 border border-white/10 p-8 rounded-2xl">
        <h3 className="text-xl font-bold mb-6">Finalizar Reserva</h3>
        
        <form onSubmit={handleBooking} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Assentos Selecionados</label>
            <input
              type="text"
              // ALTERAÇÃO 8: Exibir todos os assentos selecionados
              value={selectedSeats.length > 0 ? selectedSeats.join(', ') : 'Nenhum'}
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
            // ALTERAÇÃO 9: Verificar se há assentos selecionados
            disabled={selectedSeats.length === 0 || !cpf || loading}
            className="w-full bg-cinema-neon hover:bg-cyan-400 disabled:bg-gray-700 disabled:cursor-not-allowed text-cinema-black font-bold py-3 rounded-lg transition-all duration-300 flex justify-center items-center gap-2"
          >
            {loading ? 'Processando...' : <><Check className="w-5 h-5" /> Confirmar Reserva ({selectedSeats.length})</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Sessao;