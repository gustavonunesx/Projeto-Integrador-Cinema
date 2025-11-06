// src/components/MovieCard.jsx
import React from 'react';

// Recebe o filme como uma "prop" (propriedade)
function MovieCard({ filme }) {
  
  // A função goToMovie será tratada pelo "React Router" (Passo 4)
  const handleClick = () => {
    console.log(`Clicou no filme ${filme.id}`);
    // A navegação será feita de outra forma
  };

  return (
    <div className="movie-card" onClick={handleClick} style={{ cursor: 'pointer' }}>
      <img 
        src={filme.posterUrl || '../images/placeholder.jpg'} 
        alt={filme.titulo} 
        className="movie-poster"
        onError={(e) => { e.target.src = '../images/placeholder.jpg'; }}
      />
      <div className="movie-info">
        <div className="movie-title">{filme.titulo}</div>
        <div className="movie-genre">{filme.genero}</div>
      </div>
    </div>
  );
}

export default MovieCard;