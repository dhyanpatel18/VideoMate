import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:3000/api/v1';

const HealthcheckPage = () => {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`${API_BASE}/healthcheck`)
      .then(res => setStatus(res.data.message))
      .catch(() => setError('Healthcheck failed'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="healthcheck-container">
      <h2>Healthcheck</h2>
      <div>Status: {status}</div>
    </div>
  );
};

export default HealthcheckPage; 