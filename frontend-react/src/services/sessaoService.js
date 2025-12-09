import api from './api';

export const getSessoesPorFilme = async (filmeId, data) => {
  const response = await api.get(`/sessoes/filme/${filmeId}?data=${data}`);
  return response.data;
};

export const getAssentosSessao = async (sessaoId) => {
  const response = await api.get(`/sessoes/${sessaoId}/assentos`);
  return response.data;
};

export const reservarAssento = async (sessaoId, numeroAssento, cpf) => {
  const response = await api.post(`/sessoes/${sessaoId}/reservar?numeroAssento=${numeroAssento}&cpf=${cpf}`);
  return response.data;
};
