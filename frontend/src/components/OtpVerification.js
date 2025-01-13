import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import axios from 'axios';
import './OtpVerification.css';  // Create a separate CSS for OTP verification page

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
      console.log(response);
      if (response.status === 200) {
        navigate('/second-step-verification', {
          state: {
            phone,
            secondVerificationNumbers: response.data.secondVerificationNumbers, // Pass the numbers to the next step
          },
        });
      }
    } catch (error) {
      setError(error.response.data.message || 'Invalid OTP');
    }
  };

  return (
    <div className="otp-container">
      <div className="otp-card">
        <div className="text-center">
          <h2>OTP Verification</h2>
          <p>Please enter the OTP sent to your phone</p>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="form-input mb-4"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength="6"
            required
          />
          <button type="submit" className="btn-verify">Verify OTP</button>
        </form>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default OtpVerification;

