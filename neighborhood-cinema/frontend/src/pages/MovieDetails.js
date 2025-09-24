import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import BookingForm from '../components/BookingForm';
import SeatSelector from '../components/SeatSelector';
import 'bootstrap/dist/css/bootstrap.min.css';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showBooking, setShowBooking] = useState(false);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/movies/${id}`)  // Note: Add this endpoint to backend if needed; for now, assume /movies returns all
      .then(res => {
        const foundMovie = res.data.find(m => m._id === id);
        setMovie(foundMovie);
      })
      .catch(err => console.error('Failed to fetch movie'));
  }, [id]);

  if (!movie) return <div className="container my-5">Loading...</div>;

  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-md-4">
          <img src={movie.poster || 'https://via.placeholder.com/300x450'} alt={movie.title} className="img-fluid" />
        </div>
        <div className="col-md-8">
          <h1>{movie.title}</h1>
          <p><strong>Duration:</strong> {movie.duration}</p>
          <p><strong>Genre:</strong> {movie.genre}</p>
          <p><strong>Synopsis:</strong> {movie.synopsis}</p>
          <p><strong>Showtimes:</strong> {movie.showtimes.map(s => `${s.date.toDateString()} at ${s.time}`).join(', ')}</p>
          <p><strong>Seats Available:</strong> {movie.seats.available}/{movie.seats.total}</p>
          <button className="btn btn-success" onClick={() => setShowBooking(true)}>Book Tickets</button>
        </div>
      </div>

      {showBooking && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Book Tickets</h5>
                <button className="btn-close" onClick={() => setShowBooking(false)}></button>
              </div>
              <div className="modal-body">
                <Elements stripe={stripePromise}>
                  <BookingForm movie={movie} selectedSeats={selectedSeats} onClose={() => setShowBooking(false)} />
                </Elements>
                <SeatSelector movieId={movie._id} onSeatsSelected={setSelectedSeats} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetails;
