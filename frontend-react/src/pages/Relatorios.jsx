import React, { useEffect, useState } from 'react';
import { getDashboard, getFilmesMaisVendidos, getHorariosMaisMovimentados } from '../services/analyticsService';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from 'recharts';
import { TrendingUp, Users, DollarSign, Clock } from 'lucide-react';
import { subDays } from 'date-fns';

const Relatorios = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [popularMovies, setPopularMovies] = useState([]);
  const [busyHours, setBusyHours] = useState([]);
  const [dateRange, setDateRange] = useState({
    inicio: subDays(new Date(), 30).toISOString().split('T')[0],
    fim: new Date().toISOString().split('T')[0]
  });

  const loadDashboard = async () => {
    try {
      const data = await getDashboard();
      setDashboardData(data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadCharts = async () => {
    try {
      const movies = await getFilmesMaisVendidos(dateRange.inicio, dateRange.fim);
      // Transform map to array for Recharts
      const moviesArray = Object.entries(movies).map(([name, count]) => ({ name, count }));
      setPopularMovies(moviesArray);

      const hours = await getHorariosMaisMovimentados(dateRange.inicio, dateRange.fim);
      const hoursArray = Object.entries(hours).map(([hour, count]) => ({ hour, count }));
      setBusyHours(hoursArray);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadDashboard();
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
          onChange={(e) => setDateRange({...dateRange, inicio: e.target.value})}
          className="bg-black/40 border border-white/20 rounded px-3 py-1 text-sm text-white focus:border-cinema-neon outline-none"
        />
        <span className="text-gray-400">-</span>
        <input
          type="date"
          value={dateRange.fim}
          onChange={(e) => setDateRange({...dateRange, fim: e.target.value})}
          className="bg-black/40 border border-white/20 rounded px-3 py-1 text-sm text-white focus:border-cinema-neon outline-none"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Popular Movies */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
          <h3 className="text-xl font-bold mb-6">Filmes Mais Populares</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={popularMovies} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
                <XAxis type="number" stroke="#888" />
                <YAxis dataKey="name" type="category" width={100} stroke="#888" fontSize={12} />
                <Tooltip
                    contentStyle={{ backgroundColor: '#1a1a2e', borderColor: '#333' }}
                    itemStyle={{ color: '#00f7ff' }}
                />
                <Bar dataKey="count" fill="#e50914" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Busy Hours */}
         <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
          <h3 className="text-xl font-bold mb-6">Horários de Maior Movimento</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={busyHours}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="hour" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip
                    contentStyle={{ backgroundColor: '#1a1a2e', borderColor: '#333' }}
                    itemStyle={{ color: '#00f7ff' }}
                />
                <Line type="monotone" dataKey="count" stroke="#00f7ff" strokeWidth={3} dot={{ fill: '#00f7ff' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Relatorios;
