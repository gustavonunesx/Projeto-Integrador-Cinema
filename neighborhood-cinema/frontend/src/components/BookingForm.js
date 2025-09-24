import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';  // Requires Stripe Elements setup

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const BookingForm = ({ movie, selectedSeats, onClose }) => {
  const [price, setPrice] = useState(10 * selectedSeats.length);  // $10 per seat
  const [promotionCode, setPromotionCode] = useState('');
  const { user } = useAuth();
  const stripe = useStripe();
  const elements = useElements();

  const handleReserve = async () => {
    if (!selectedSeats.length) return alert('Select seats');
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/tickets/reserve`, {
        movieId: movie._id,
        seats: selectedSeats,
        price
      });
      alert('Seats reserved! Proceed to payment.');
      // Redirect to payment or auto-trigger
      handlePurchase(res.data._id);
    } catch (err) {
      alert(err.response?.data?.msg || 'Reservation failed');
    }
  };

  const handlePurchase = async (ticketId) => {
    if (!stripe || !elements) return;
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/tickets/purchase/${ticketId}`);
      // const { error } = await stripe.confirmCardPayment(res.data.clientSecret, {
      //   payment_method: {
      //     card: elements.getElement(CardElement),
      //     billing_details: { email: user.email }
      //   }
      // });
        alert('Pagamento simulado com sucesso!');
      if (!error) {
        alert('Purchase successful! Check your email.');
        onClose();
      } else {
        alert(error.message);
      }
    } catch (err) {
      alert('Payment failed');
    }
  };

  const applyPromotion = () => {
    // Simplified; fetch from /promotions endpoint
    if (promotionCode === 'FAMILY20') setPrice(price * 0.8);
  };

  if (!user) return <p>Please <a href="/login">login</a> to book.</p>;

  return (
    <div className="card p-4">
      <h4>Book for {movie.title}</h4>
      <p>Total: ${price} for {selectedSeats.length} seats</p>
      <input
        type="text"
        placeholder="Promo Code (e.g., FAMILY20)"
        value={promotionCode}
        onChange={(e) => setPromotionCode(e.target.value)}
        className="form-control mb-2"
      />
      <button className="btn btn-secondary me-2" onClick={applyPromotion}>Apply</button>
      <SeatSelector movieId={movie._id} onSeatsSelected={(seats) => setPrice(10 * seats.length)} />
      <CardElement className="form-control mb-3" />  {/* Stripe card input */}
      <button className="btn btn-success" onClick={handleReserve}>Reserve & Pay</button>
    </div>
  );
};

export default BookingForm;
