import { useState, useEffect } from 'react';
import { ApiService } from '../services/apiService';

export const useMovies = () => {
    const [movies, setMovies] = useState({
        trending: [],
        featured: [],
        all: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [backendStatus, setBackendStatus] = useState('checking');

    const loadMovies = async () => {
        try {
            setLoading(true);
            setBackendStatus('checking');

            // Verificar se o backend está disponível
            const isBackendAvailable = await ApiService.isBackendAvailable();
            
            if (!isBackendAvailable) {
                setBackendStatus('offline');
                setError('Backend indisponível. Usando dados locais.');
                // Aqui você pode carregar dados locais como fallback
                loadLocalMovies();
                return;
            }

            setBackendStatus('online');

            // Carregar filmes do backend
            const [trendingResult, allResult] = await Promise.all([
                ApiService.getFilmesEmCartaz(),
                ApiService.getAllFilmes()
            ]);

            if (trendingResult.success && allResult.success) {
                const trendingMovies = trendingResult.data.slice(0, 4);
                const trendingIds = trendingMovies.map(movie => movie.id);
                
                const featuredMovies = allResult.data.filter(
                    movie => !trendingIds.includes(movie.id)
                );

                setMovies({
                    trending: trendingMovies,
                    featured: featuredMovies,
                    all: allResult.data
                });
            } else {
                throw new Error('Erro ao carregar filmes do backend');
            }

        } catch (err) {
            console.error('Erro ao carregar filmes:', err);
            setError(err.message);
            setBackendStatus('error');
        } finally {
            setLoading(false);
        }
    };

    const loadLocalMovies = () => {
        // Dados locais de fallback baseados no seu HTML original
        const localMovies = {
            trending: [
                {
                    id: 'duna-2',
                    titulo: 'Duna: Parte Dois',
                    genero: 'Ficção Científica',
                    duracao: '2h 46m',
                    classificacao: '14',
                    posterUrl: '../images/duna.webp',
                    descricao: 'A lenda continua na maior aventura do ano'
                },
                {
                    id: 'deadpool-3',
                    titulo: 'Deadpool & Wolverine',
                    genero: 'Ação/Comédia',
                    duracao: '2h 30m',
                    classificacao: '16',
                    posterUrl: '../images/deadpool+e+wolverine+capa.webp',
                    descricao: 'O duo mais explosivo dos cinemas'
                }
            ],
            featured: [],
            all: []
        };
        setMovies(localMovies);
    };

    const getMovieById = async (id) => {
        try {
            const result = await ApiService.getFilmeById(id);
            if (result.success) {
                return result.data;
            }
            return null;
        } catch (error) {
            console.error('Erro ao buscar filme:', error);
            return null;
        }
    };

    const searchMovies = async (query) => {
        try {
            const result = await ApiService.searchFilmes(query);
            if (result.success) {
                return result.data;
            }
            return [];
        } catch (error) {
            console.error('Erro ao buscar filmes:', error);
            return [];
        }
    };

    useEffect(() => {
        loadMovies();
    }, []);

    return {
        movies,
        loading,
        error,
        backendStatus,
        refetch: loadMovies,
        getMovieById,
        searchMovies
    };
};