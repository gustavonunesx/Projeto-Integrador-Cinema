import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SeatSelector = ({ movieId, onSeatsSelected }) => {
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);

  useEffect(() => {
    // Fetch available seats (simplified; in real app, fetch from backend)
    setSeats(Array.from({ length: 20 }, (_, i) => ({ id: `A${i + 1}`, available: Math.random() > 0.2 })));  // 80% available
  }, [movieId]);

  const toggleSeat = (seatId) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  useEffect(() => {
    onSeatsSelected(selectedSeats);
  }, [selectedSeats]);

  return (
    <div className="my-4">
      <h5>Select Seats</h5>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 30px)', gap: '5px', margin: '20px 0' }}>
        {seats.map((seat) => (
          <button
            key={seat.id}
            className={`btn ${seat.available ? 'btn-success' : 'btn-danger'} btn-sm ${selectedSeats.includes(seat.id) ? 'btn-warning' : ''}`}
            onClick={() => seat.available && toggleSeat(seat.id)}
            disabled={!seat.available}
          >
            {seat.id}
          </button>
        ))}
      </div>
      <p>Selected: {selectedSeats.length} seats</p>
    </div>
  );
};

export default SeatSelector;
