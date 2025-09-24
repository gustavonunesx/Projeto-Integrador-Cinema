import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const [movies, setMovies] = useState([]);
  const [analytics, setAnalytics] = useState({ topMovies: [], peakHours: [] });
  const [newMovie, setNewMovie] = useState({ title: '', duration: '', genre: '', synopsis: '', poster: '', showtimes: [] });

  useEffect(() => {
    fetchMovies();
    fetchAnalytics();
  }, []);

  const fetchMovies = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/movies`);
    setMovies(res.data);
  };

  const fetchAnalytics = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/analytics`);
    setAnalytics(res.data);
  };

  const addMovie = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/movies`, newMovie);
      fetchMovies();
      setNewMovie({ title: '', duration: '', genre: '', synopsis: '', poster: '', showtimes: [] });
      alert('Movie added successfully!');
    } catch (err) {
      alert('Failed to add movie');
    }
  };

  const chartData = {
    labels: analytics.topMovies.map(m => m.movie[0]?.title || 'Unknown'),
    datasets: [{ label: 'Tickets Sold', data: analytics.topMovies.map(m => m.count), backgroundColor: 'rgba(75,192,192,0.6)' }]
  };

  const options = {
    responsive: true,
    plugins: { legend: { position: 'top' }, title: { display: true, text: 'Top Movies' } }
  };

  return (
    <div className="container my-5">
      <h2>Admin Dashboard</h2>
      
      {/* Add Movie Form */}
      <form onSubmit={addMovie} className="card p-4 mb-4">
        <h4>Add New Movie</h4>
        <input className="form-control mb-2" placeholder="Title" value={newMovie.title} onChange={(e) => setNewMovie({...newMovie, title: e.target.value})} required />
        <input className="form-control mb-2" placeholder="Duration (e.g., 2h35m)" value={newMovie.duration} onChange={(e) => setNewMovie({...newMovie, duration: e.target.value})} required />
        <input className="form-control mb-2" placeholder="Genre" value={newMovie.genre} onChange={(e) => setNewMovie({...newMovie, genre: e.target.value})} required />
        <textarea className="form-control mb-2" placeholder="Synopsis" value={newMovie.synopsis} onChange={(e) => setNewMovie({...newMovie, synopsis: e.target.value})} required />
        <input className="form-control mb-2" placeholder="Poster URL" value={newMovie.poster} onChange={(e) => setNewMovie({...newMovie, poster: e.target.value})} />
        <input className="form-control mb-2" type="date" placeholder="Showtime Date" onChange={(e) => setNewMovie({...newMovie, showtimes: [{ date: new Date(e.target.value), time: '19:00' }] })} required />
        <button type="submit" className="btn btn-primary">Add Movie</button>
      </form>

      {/* Analytics */}
      <div className="row mb-4">
        <div className="col-md-6">
          <h4>Top Movies</h4>
          <Bar data={chartData} options={options} />
        </div>
        <div className="col-md-6">
          <h4>Peak Hours</h4>
          <ul>
            {analytics.peakHours.slice(0, 5).map((hour, i) => (
              <li key={i}>Hour {hour._id}: {hour.count} tickets</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Current Movies List */}
      <h4>Current Movies</h4>
      <div className="row">
        {movies.map((movie) => (
          <div key={movie._id} className="col-md-4 mb-3">
            <div className="card">
              <img src={movie.poster} className="card-img-top" alt={movie.title} />
              <div className="card-body">
                <h5>{movie.title}</h5>
                <p>Available Seats: {movie.seats.available}/{movie.seats.total}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
