import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Hero from '../components/Hero';
import MovieGrid from '../components/MovieGrid';
import Promotions from '../components/Promotions';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [featuredMovies, setFeaturedMovies] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/movies`)
      .then(res => {
        setMovies(res.data);
        setFeaturedMovies(res.data.slice(0, 3));  // First 3 for hero
      })
      .catch(err => console.error('Failed to fetch movies'));
  }, []);

  return (
    <>
      <Hero featuredMovies={featuredMovies} />
      <MovieGrid movies={movies} />
      <Promotions />
    </>
  );
};

export default Home;
