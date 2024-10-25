import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getTrainDetails } from '../services/api';

function TrainDetails() {
  const [train, setTrain] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const fetchTrainDetails = async () => {
      try {
        const response = await getTrainDetails(id);
        setTrain(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching train details:', error);
        setLoading(false);
      }
    };

    fetchTrainDetails();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!train) {
    return <div>Train not found</div>;
  }

  return (
    <div>
      <h2>{train.name}</h2>
      <p>From: {train.source}</p>
      <p>To: {train.destination}</p>
      <p>Departure: {new Date(train.departureTime).toLocaleString()}</p>
      <p>Arrival: {new Date(train.arrivalTime).toLocaleString()}</p>
      <h3>Available Seats:</h3>
      <ul>
        {train.seats.map((seat) => (
          <li key={seat._id}>
            Seat {seat.number} - {seat.isBooked ? 'Booked' : 'Available'}
          </li>
        ))}
      </ul>
      <Link to={`/booking?trainId=${train._id}`}>Book Now</Link>
    </div>
  );
}

export default TrainDetails;
