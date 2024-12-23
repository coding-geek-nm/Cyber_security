import React from 'react';
import ReactDOM from "react-dom/client";

import { BrowserRouter, Routes, Route } from "react-router";
import App from './App';
import LoginPage from './components/LoginPage';
import OtpVerification from './components/OtpVerification';
import HomePage from './components/HomePage';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<LoginPage/>} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/otp-verification" element={<OtpVerification />} />
            <Route path="/home" element={<HomePage />} />
        </Routes>
    </BrowserRouter>
);
