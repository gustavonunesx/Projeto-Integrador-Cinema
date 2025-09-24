import React from 'react';

const Hero = ({ featuredMovies }) => {
  // Simplified; use react-slick or similar for real carousel
  const featured = featuredMovies[0] || { title: 'Discover Local Magic', synopsis: 'Book tickets and explore schedules.' };

  return (
    <section className="hero" style={{ background: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(https://via.placeholder.com/1920x600?text=Movie+BG)', backgroundSize: 'cover', color: 'white', padding: '100px 0', textAlign: 'center' }}>
      <div className="container">
        <h1>{featured.title}</h1>
        <p>{featured.synopsis}</p>
        <a href="/" className="btn btn-primary btn-lg">Browse Movies</a>
      </div>
    </section>
  );
};

export default Hero;
