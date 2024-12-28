import React, { useState } from 'react';
import { useNavigate } from "react-router";
import axios from 'axios';
import './LoginPage.css';  // Import your existing CSS for styling

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
    <div className="container gradient-form">
      <div className="row">
        {/* Left Column */}
        <div className="col-md-6 col-left">
          <div className="content-left">
            <div className="text-center">
              <img
                src="https://www.shutterstock.com/image-vector/go-vote-text-vector-calligraphy-260nw-2416008915.jpg"
                style={{ width: '185px' }}
                alt="logo"
              />
              <h4 className="mt-1 mb-5 pb-1">One Vote | One Nation</h4>
            </div>

            <form onSubmit={handleSubmit}>
              <p>Please enter your Aadhaar and phone number</p>

              <input
                type="text"
                className="form-input mb-4"
                placeholder="Aadhaar Number"
                value={aadhaar}
                onChange={(e) => setAadhaar(e.target.value)}
                required
              />
              <input
                type="text"
                className="form-input mb-4"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />

              <div className="text-center pt-1 mb-5 pb-1">
                <button type="submit" className="btn-signin">
                  Submit
                </button>
              </div>
            </form>

            {error && <p className="text-center text-danger">{error}</p>}
          </div>
        </div>

        {/* Right Column */}
        <div className="col-md-6 col-right">
          <div className="content-right gradient-custom-2">
            <div className="text-white px-3 py-4 p-md-5 mx-md-4">
              <h4 className="mb-4">We are more than just a Responsibility</h4>
              <p className="small mb-0">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
                quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

