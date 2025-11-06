import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Play, Star, Clock } from 'lucide-react';

const MovieCard = ({ movie, index }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/movie/${movie.id}`);
    };

    // Função para determinar a cor da classificação (baseada no seu CSS original)
    const getRatingColor = (rating) => {
        if (!rating) return 'bg-gray-500';
        
        const ratingNum = parseInt(rating) || 0;
        
        if (rating === 'L' || rating.includes('Livre')) return 'bg-green-500';
        if (ratingNum === 10) return 'bg-blue-500';
        if (ratingNum === 12) return 'bg-yellow-500';
        if (ratingNum === 14) return 'bg-orange-500';
        if (ratingNum === 16) return 'bg-red-500';
        if (ratingNum >= 18) return 'bg-red-700';
        
        return 'bg-gray-500';
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
                delay: index * 0.1,
                duration: 0.5
            }}
            whileHover={{ 
                scale: 1.05,
                y: -10
            }}
            className="group relative bg-gray-800 rounded-2xl overflow-hidden cursor-pointer shadow-2xl"
            onClick={handleClick}
        >
            {/* Poster com Overlay */}
            <div className="relative overflow-hidden">
                <motion.img
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                    src={movie.posterUrl || '../images/placeholder.jpg'}
                    alt={movie.title}
                    className="w-full h-80 object-cover"
                    onError={(e) => {
                        e.target.src = '../images/placeholder.jpg';
                    }}
                />
                
                {/* Overlay no Hover */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        whileHover={{ scale: 1 }}
                        className="bg-red-500 rounded-full p-4 shadow-2xl"
                    >
                        <Play className="text-white" size={24} fill="currentColor" />
                    </motion.div>
                </div>

                {/* Badges */}
                <div className="absolute top-3 right-3 flex flex-col space-y-2">
                    <div className={`${getRatingColor(movie.rating)} backdrop-blur-sm rounded-full px-3 py-1 text-sm font-semibold text-white`}>
                        {movie.rating || 'L'}
                    </div>
                    {movie.duration && (
                        <div className="bg-blue-500/80 backdrop-blur-sm rounded-full px-2 py-1 text-xs text-white flex items-center space-x-1">
                            <Clock size={12} />
                            <span>{movie.duration}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Informações do Filme */}
            <div className="p-6 relative z-10">
                <h3 className="font-bold text-xl mb-3 line-clamp-2 group-hover:text-red-400 transition-colors duration-300">
                    {movie.title}
                </h3>
                
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">{movie.genre}</span>
                    <div className="flex items-center space-x-1 text-yellow-400">
                        <Star size={16} fill="currentColor" />
                        <span className="text-white">4.8</span>
                    </div>
                </div>

                {/* Efeito de Brilho no Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
            </div>

            {/* Efeito de Borda Luminosa */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-md" />
        </motion.div>
    );
};

export default MovieCard;