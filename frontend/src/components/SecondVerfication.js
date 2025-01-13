import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import axios from 'axios';
import './SecondStepVerification.css'; // Create a separate CSS file for styling

const SecondStepVerification = () => {
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { phone, secondVerificationNumbers } = location.state; // Passed from the OTP verification step

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedNumber === null) {
      setError('Please select a number');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/users/secondverify', { 
        phone, 
        selectedNumber 
      });
      if (response.status === 200) {
        navigate('/cameraverification');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Verification failed');
    }
  };

  return (
    <div className="second-verification-container">
      <div className="second-verification-card">
        <h2>Second Step Verification</h2>
        <p>Select the correct number to proceed</p>
        <form onSubmit={handleSubmit}>
          <div className="number-options">
            {secondVerificationNumbers.map((num, index) => (
              <div key={index} className="number-option">
                <input
                  type="radio"
                  id={`number-${index}`}
                  name="verificationNumber"
                  value={num}
                  onChange={(e) => setSelectedNumber(e.target.value)}
                />
                <label htmlFor={`number-${index}`}>{num}</label>
              </div>
            ))}
          </div>
          <button type="submit" className="btn-submit">Submit</button>
        </form>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default SecondStepVerification;
