import React, { useEffect, useState } from 'react';
import { getDashboard, getFilmesMaisVendidos, getHorariosMaisMovimentados } from '../services/analyticsService';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from 'recharts';
import { TrendingUp, Users, DollarSign, Clock } from 'lucide-react';
import { subDays } from 'date-fns';

const Relatorios = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [popularMovies, setPopularMovies] = useState([]);
  const [busyHours, setBusyHours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    inicio: subDays(new Date(), 30).toISOString().split('T')[0],
    fim: new Date().toISOString().split('T')[0]
  });

  const loadDashboard = async () => {
    try {
      const data = await getDashboard();
      console.log('📊 DASHBOARD DATA completo:', data);
      
      // Backend retorna:
      // {
      //   filmesPopularesSemana: [{titulo, totalVendas, receitaTotal}, ...],
      //   resumoPeriodo: {semana: '...', mes: '...'},
      //   horariosPopularesMes: [{horario, totalReservas}, ...]
      // }
      
      // Calcular totais a partir dos arrays
      const filmesPopulares = data?.filmesPopularesSemana || [];
      const horarios = data?.horariosPopularesMes || [];
      
      console.log('📊 Filmes populares:', filmesPopulares);
      console.log('📊 Horários populares:', horarios);
      
      // Somar total de ingressos dos filmes
      const totalIngressos = filmesPopulares.reduce((total, filme) => {
        return total + (filme.totalVendas || 0);
      }, 0);
      
      // Somar receita total dos filmes
      const receitaTotal = filmesPopulares.reduce((total, filme) => {
        return total + (filme.receitaTotal || 0);
      }, 0);
      
      // Contar sessões únicas (ou usar o total de horários como aproximação)
      const totalSessoes = horarios.reduce((total, hora) => {
        return total + (hora.totalReservas || 0);
      }, 0);
      
      console.log('📊 Valores calculados:');
      console.log('  - totalIngressos:', totalIngressos);
      console.log('  - receitaTotal:', receitaTotal);
      console.log('  - totalSessoes:', totalSessoes);
      
      const dashboardFormatted = {
        totalIngressos,
        receitaTotal,
        totalSessoes
      };
      
      setDashboardData(dashboardFormatted);
    } catch (error) {
      console.error('❌ Erro ao carregar dashboard:', error);
    }
  };

  const loadCharts = async () => {
    try {
      setLoading(true);
      
      const moviesResponse = await getFilmesMaisVendidos(dateRange.inicio, dateRange.fim);
      console.log('🎬 FILMES RECEBIDOS (raw):', moviesResponse);
      
      // Backend retorna: { periodo: '...', filmes: [...], totalFilmes: 3 }
      // Os dados estão dentro de .filmes
      const movies = moviesResponse?.filmes || [];
      
      console.log('🎬 Array de filmes extraído:', movies);
      console.log('🎬 Primeiro filme (exemplo):', movies[0]);
      
      let moviesArray = [];
      
      if (Array.isArray(movies)) {
        moviesArray = movies.map(item => {
          console.log('   📽️ Processando filme:', item);
          const processed = {
            name: item.titulo || item.tituloFilme || item.name || 'Sem título',
            count: Number(item.totalVendas || item.quantidade || item.count || 0),
            receita: Number(item.receitaTotal || item.receita || 0)
          };
          console.log('   ✅ Resultado:', processed);
          return processed;
        });
      }
      
      // Filtra itens válidos e ordena por quantidade
      moviesArray = moviesArray
        .filter(item => item.count > 0)
        .sort((a, b) => b.count - a.count)
        .slice(0, 10); // Top 10
      
      console.log('🎬 FILMES PROCESSADOS:', moviesArray);
      setPopularMovies(moviesArray);

      const hoursResponse = await getHorariosMaisMovimentados(dateRange.inicio, dateRange.fim);
      console.log('⏰ HORÁRIOS RECEBIDOS (raw):', hoursResponse);
      
      // Backend retorna: { horarios: [...], dias: [...] }
      // Os dados estão dentro de .horarios
      const hours = hoursResponse?.horarios || [];
      
      console.log('⏰ Array de horários extraído:', hours);
      console.log('⏰ Primeiro horário (exemplo):', hours[0]);
      
      let hoursArray = [];
      
      if (Array.isArray(hours)) {
        hoursArray = hours.map(item => {
          console.log('   🕐 Processando horário:', item);
          const processed = {
            hour: String(item.horario || item.hora || item.hour || '00:00'),
            count: Number(item.totalReservas || item.quantidade || item.totalVendas || item.count || 0)
          };
          console.log('   ✅ Resultado:', processed);
          return processed;
        });
      }
      
      // Filtra e ordena horários
      hoursArray = hoursArray
        .filter(item => item.count > 0)
        .sort((a, b) => a.hour.localeCompare(b.hour));
      
      console.log('⏰ HORÁRIOS PROCESSADOS:', hoursArray);
      setBusyHours(hoursArray);
    } catch (error) {
      console.error('❌ Erro ao carregar gráficos:', error);
      setPopularMovies([]);
      setBusyHours([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  useEffect(() => {
    loadCharts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <TrendingUp className="text-cinema-neon" />
        Dashboard & Analytics
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-blue-500/20 rounded-full text-blue-400">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Total de Ingressos</p>
            <p className="text-2xl font-bold">{dashboardData?.totalIngressos || 0}</p>
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-green-500/20 rounded-full text-green-400">
            <DollarSign className="w-8 h-8" />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Receita Total</p>
            <p className="text-2xl font-bold">R$ {dashboardData?.receitaTotal?.toFixed(2) || '0.00'}</p>
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-purple-500/20 rounded-full text-purple-400">
            <Clock className="w-8 h-8" />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Sessões Realizadas</p>
            <p className="text-2xl font-bold">{dashboardData?.totalSessoes || 0}</p>
          </div>
        </div>
      </div>

      {/* Date Filter */}
      <div className="flex gap-4 mb-8 bg-white/5 p-4 rounded-xl inline-flex items-center">
        <span className="text-gray-400 text-sm">Filtrar período:</span>
        <input
          type="date"
          value={dateRange.inicio}
          onChange={(e) => setDateRange({ ...dateRange, inicio: e.target.value })}
          className="bg-black/40 border border-white/20 rounded px-3 py-1 text-sm text-white focus:border-cinema-neon outline-none"
        />
        <span className="text-gray-400">-</span>
        <input
          type="date"
          value={dateRange.fim}
          onChange={(e) => setDateRange({ ...dateRange, fim: e.target.value })}
          className="bg-black/40 border border-white/20 rounded px-3 py-1 text-sm text-white focus:border-cinema-neon outline-none"
        />
      </div>

      {/* Charts */}
      {loading ? (
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cinema-neon"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Popular Movies */}
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
            <h3 className="text-xl font-bold mb-6">Filmes Mais Populares</h3>
            {popularMovies.length > 0 ? (
              <div className="w-full" style={{ height: 320 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={popularMovies} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
                    <XAxis type="number" stroke="#888" />
                    <YAxis dataKey="name" type="category" width={120} stroke="#888" fontSize={12} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1a1a2e', borderColor: '#333', borderRadius: '8px' }}
                      labelStyle={{ color: '#fff' }}
                      formatter={(value, name) => {
                        if (name === 'count') return [value, 'Ingressos'];
                        return [value, name];
                      }}
                    />
                    <Bar dataKey="count" fill="#e50914" radius={[0, 4, 4, 0]} name="Ingressos" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-500">
                Nenhum dado disponível para o período selecionado
              </div>
            )}
          </div>

          {/* Busy Hours */}
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
            <h3 className="text-xl font-bold mb-6">Horários de Maior Movimento</h3>
            {busyHours.length > 0 ? (
              <div className="w-full" style={{ height: 320 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={busyHours} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                    <XAxis dataKey="hour" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1a1a2e', borderColor: '#333', borderRadius: '8px' }}
                      labelStyle={{ color: '#fff' }}
                      formatter={(value) => [value, 'Ingressos']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="count" 
                      stroke="#00f7ff" 
                      strokeWidth={3} 
                      dot={{ fill: '#00f7ff', r: 4 }}
                      activeDot={{ r: 6 }}
                      name="Ingressos"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-500">
                Nenhum dado disponível para o período selecionado
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Relatorios;