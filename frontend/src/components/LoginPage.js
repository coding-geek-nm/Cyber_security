import React, { useState } from 'react';
import { useNavigate } from "react-router";
import axios from 'axios';

const LoginPage = () => {
  const [phone, setPhone] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phone || !aadhaar) {
      setError('Phone and Aadhaar are required');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/users/login', { phone, aadhaar });
      if (response.status === 200) {
        navigate('/otp-verification', { state: { phone } });
      }
    } catch (error) {
      setError(error.response.data.message || 'An error occurred');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Phone" 
          value={phone} 
          onChange={(e) => setPhone(e.target.value)} 
        />
        <input 
          type="text" 
          placeholder="Aadhaar" 
          value={aadhaar} 
          onChange={(e) => setAadhaar(e.target.value)} 
        />
        <button type="submit">Submit</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default LoginPage;
