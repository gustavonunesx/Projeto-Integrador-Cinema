import { motion } from 'framer-motion';
import { useMovies } from '../../hooks/useMovies';
import HeroSlider from '../../components/Slider/HeroSlider';
import MoviesSlider from '../../components/Slider/MoviesSlider';
import MovieCard from '../../components/MovieCard/MovieCard';
import { Loading } from '../../components/Loading/Loading';
import { Wifi, WifiOff, AlertCircle } from 'lucide-react';

const Home = () => {
    const { movies, loading, error, backendStatus } = useMovies();

    // Dados para o Hero Slider (baseado no seu HTML original)
    const heroMovies = [
        {
            id: 'duna-2',
            title: 'Duna: Parte Dois',
            description: 'A lenda continua na maior aventura do ano',
            image: '../images/duna.webp'
        },
        {
            id: 'deadpool-3',
            title: 'Deadpool & Wolverine', 
            description: 'O duo mais explosivo dos cinemas',
            image: '../images/deadpool+e+wolverine+capa.webp'
        },
        {
            id: 'inside-out-2',
            title: 'Divertidamente 2',
            description: 'Novas emoções estão chegando',
            image: '../images/divertidamente.webp'
        },
        {
            id: 'kingdom-of-the-planet-of-the-apes',
            title: 'O Reino do Planeta dos Macacos',
            description: 'Uma nova era começa',
            image: '../images/planeta-dos-macacos.webp'
        }
    ];

    const getStatusIcon = () => {
        switch (backendStatus) {
            case 'online':
                return <Wifi className="text-green-500" size={16} />;
            case 'offline':
                return <WifiOff className="text-yellow-500" size={16} />;
            case 'error':
                return <AlertCircle className="text-red-500" size={16} />;
            default:
                return null;
        }
    };

    const getStatusText = () => {
        switch (backendStatus) {
            case 'online':
                return 'Backend Online';
            case 'offline':
                return 'Modo Offline - Dados Locais';
            case 'error':
                return 'Erro de Conexão';
            default:
                return 'Verificando...';
        }
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-gray-900"
        >
            {/* Status do Backend */}
            <div className="fixed top-20 right-4 z-50">
                <motion.div
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center space-x-2 bg-gray-800/90 backdrop-blur-md px-4 py-2 rounded-lg border border-gray-700"
                >
                    {getStatusIcon()}
                    <span className="text-sm text-white">{getStatusText()}</span>
                </motion.div>
            </div>

            {/* Hero Slider */}
            <section className="relative">
                <HeroSlider movies={heroMovies} />
            </section>

            {/* Filmes em Alta */}
            <section className="py-16 bg-gray-900">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl font-bold mb-4 text-white">
                            Filmes em Alta
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Os filmes mais populares do momento que estão arrasando nas bilheterias
                        </p>
                    </motion.div>

                    {error && backendStatus === 'offline' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-4 mb-6 text-center"
                        >
                            <p className="text-yellow-400">
                                {error} - Mostrando dados de demonstração.
                            </p>
                        </motion.div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {movies.trending.length > 0 ? (
                            movies.trending.map((movie, index) => (
                                <MovieCard 
                                    key={movie.id} 
                                    movie={{
                                        id: movie.id,
                                        title: movie.titulo || movie.title,
                                        genre: movie.genero || movie.genre,
                                        duration: movie.duracao || movie.duration,
                                        rating: movie.classificacao || movie.rating,
                                        posterUrl: movie.posterUrl || movie.poster,
                                        description: movie.descricao || movie.description
                                    }} 
                                    index={index} 
                                />
                            ))
                        ) : (
                            // Fallback visual caso não haja filmes
                            Array.from({ length: 4 }).map((_, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-gray-800 rounded-2xl p-4 animate-pulse"
                                >
                                    <div className="bg-gray-700 h-80 rounded-lg mb-4"></div>
                                    <div className="bg-gray-700 h-4 rounded mb-2"></div>
                                    <div className="bg-gray-700 h-3 rounded w-2/3"></div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* Em Cartaz */}
            <section className="py-16 bg-gray-800">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl font-bold mb-4 text-white">
                            Em Cartaz
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Descubra os próximos lançamentos e as maiores produções do cinema
                        </p>
                    </motion.div>

                    <MoviesSlider 
                        movies={movies.featured.map(movie => ({
                            id: movie.id,
                            title: movie.titulo || movie.title,
                            genre: movie.genero || movie.genre,
                            duration: movie.duracao || movie.duration,
                            rating: movie.classificacao || movie.rating,
                            posterUrl: movie.posterUrl || movie.poster,
                            description: movie.descricao || movie.description
                        }))} 
                    />
                </div>
            </section>

            {/* Promoções (do seu HTML original) */}
            <section className="py-16 bg-gray-900">
                <div className="container mx-auto px-4">
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-3xl font-bold text-center mb-12 text-white"
                    >
                        Promoções do Dia
                    </motion.h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            whileHover={{ scale: 1.02 }}
                            className="bg-gradient-to-r from-red-500 to-orange-500 p-6 rounded-xl shadow-lg"
                        >
                            <h3 className="text-xl font-bold mb-3 text-white">Meia-Entrada para Todos</h3>
                            <p className="text-white/90">
                                Todas as sessões de segunda a quinta com preço único de meia-entrada!
                            </p>
                        </motion.div>
                        
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                            whileHover={{ scale: 1.02 }}
                            className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 rounded-xl shadow-lg"
                        >
                            <h3 className="text-xl font-bold mb-3 text-white">Combo Família</h3>
                            <p className="text-white/90">
                                Compre 4 ingressos e ganhe um combo de pipoca e refrigerante grande!
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>
        </motion.main>
    );
};

export default Home;