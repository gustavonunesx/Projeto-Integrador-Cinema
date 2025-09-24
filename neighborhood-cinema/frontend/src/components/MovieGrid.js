import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const MovieGrid = ({ movies }) => {
  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Now Showing</h2>
      <div className="row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {movies.map((movie) => (
          <div key={movie._id} className="col-md-4">
            <div className="card movie-card">
              <img src={movie.poster || 'https://via.placeholder.com/300x450?text=Movie+Poster'} className="card-img-top" alt={movie.title} />
              <div className="card-body">
                <h5 className="card-title">{movie.title}</h5>
                <p className="card-text">{movie.duration} • {movie.genre}<br/>{movie.synopsis?.substring(0, 100)}...</p>
                <Link to={`/movie/${movie._id}`} className="btn btn-success">Buy Tickets</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieGrid;
