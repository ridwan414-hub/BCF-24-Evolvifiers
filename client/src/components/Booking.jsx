import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { createBooking } from '../services/api';

function Booking() {
  const [seatNumber, setSeatNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { token, user } = useSelector((state) => state.auth);

  const trainId = new URLSearchParams(location.search).get('trainId');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      await createBooking({
        trainId,
        seatNumber,
        userId: user.id,
        userEmail: user.email,
      });
      alert('Booking successful!');
      navigate('/');
    } catch (error) {
      console.error('Booking failed:', error);
      alert('Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Book a Seat</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="Seat Number"
          value={seatNumber}
          onChange={(e) => setSeatNumber(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Booking...' : 'Book Now'}
        </button>
      </form>
    </div>
  );
}

export default Booking;
