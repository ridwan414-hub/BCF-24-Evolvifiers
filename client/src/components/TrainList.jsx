import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTrains } from '../services/api';

function TrainList() {
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrains = async () => {
      try {
        const response = await getTrains();
        setTrains(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching trains:', error);
        setLoading(false);
      }
    };

    fetchTrains();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Available Trains</h2>
      <ul>
        {trains.map((train) => (
          <li key={train._id}>
            <Link to={`/trains/${train._id}`}>
              {train.name} - From: {train.source}, To: {train.destination}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TrainList;
