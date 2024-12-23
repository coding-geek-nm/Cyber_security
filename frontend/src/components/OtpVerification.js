import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import axios from 'axios';

const OtpVerification = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const phone = location.state.phone;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otp) {
      setError('OTP is required');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/users/verify', { phone, otp });
      if (response.status === 200) {
        navigate('/home');
      }
    } catch (error) {
      setError(error.response.data.message || 'Invalid OTP');
    }
  };

  return (
    <div>
      <h2>OTP Verification</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Enter OTP" 
          value={otp} 
          onChange={(e) => setOtp(e.target.value)} 
        />
        <button type="submit">Verify OTP</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default OtpVerification;
