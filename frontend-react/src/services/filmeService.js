import api from './api';

export const getFilmes = async () => {
  const response = await api.get('/filmes');
  return response.data;
};

export const getFilmesEmCartaz = async () => {
  const response = await api.get('/filmes/em-cartaz');
  return response.data;
};

export const getFilmeById = async (id) => {
  const response = await api.get(`/filmes/${id}`);
  return response.data;
};

export const searchFilmes = async (titulo) => {
  const response = await api.get(`/filmes/buscar?titulo=${titulo}`);
  return response.data;
};
