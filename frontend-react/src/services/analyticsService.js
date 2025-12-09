import api from './api';

export const getFilmesMaisVendidos = async (inicio, fim) => {
  const response = await api.get(`/analytics/filmes-populares?inicio=${inicio}&fim=${fim}`);
  return response.data;
};

export const getHorariosMaisMovimentados = async (inicio, fim) => {
  const response = await api.get(`/analytics/horarios-movimento?inicio=${inicio}&fim=${fim}`);
  return response.data;
};

export const getDashboard = async () => {
  const response = await api.get('/analytics/dashboard');
  return response.data;
};
