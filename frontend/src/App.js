import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import SipCalculator from './page/Calculators/Pages/SipCalculator.js';
import CompoundInterestCalculator from './page/Calculators/Pages/CompoundInterest/CompoundInterestCalculator.js';
import Calculators from './page/Calculators/Calculators.js';
import Navbar from './page/Components/Navbar.js';
import Footer from './page/Components/Footer.js';
import Currency from './page/Currency/Currency.js';
import Cryptocurrency from './page/Cryptocurrency/Cryptocurrency.js';
import Nifty50 from './page/Indices/Nifty50/Nifty50.js';
import Sensex from './page/Indices/Sensex/Sensex.js';
import BankNifty from './page/Indices/BankNifty/BankNifty.js';
import Links from './page/Links/Links.js';
import Commodities from './page/Commodities/Commodities.js';
import Learn from './page/Learn/Learn.js';
import Profile from './page/User/Profile/Profile.js';
import Login from './page/User/Login/Login.js';
import Signup from './page/User/Signup/Signup.js';
import Home from './page/Home/Home.js';
import BackendTest from './components/BackendTest.js';
import Indexx from './components/indexx.js';

function App() {
  return (
    <Router>
      <div className="App">
        {/* Navbar */}
        <Navbar />

        {/* Main Content */}
        <Routes>
          {/* Home Route */}
          <Route path="/" element={<Home />} />
          
          {/* User Authentication Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          
          {/* Calculator Routes */}
          <Route path="/calculators" element={<Calculators />} />
          <Route path="/calculators/sip" element={<SipCalculator />} />
          <Route path="/calculators/compound-interest" element={<CompoundInterestCalculator />} />
          
          {/* Market Data Routes */}
          <Route path="/cryptocurrency" element={<Cryptocurrency />} />
          <Route path="/currency" element={<Currency />} />
          <Route path="/commodities" element={<Commodities />} />
          
          {/* Indices Routes */}
          <Route path="/indices/nifty50" element={<Nifty50 />} />
          <Route path="/indices/sensex" element={<Sensex />} />
          <Route path="/indices/banknifty" element={<BankNifty />} />
          <Route path="/indexx" element={<Indexx />} />
          
          {/* Other Routes */}
          <Route path="/learn" element={<Learn />} />
          <Route path="/links" element={<Links />} />
          <Route path="/backend-test" element={<BackendTest />} />
          
          {/* Tools Route */}
          <Route path="/tools" element={
            <div className="page-container">
              <h1>Tools</h1>
              <p>Additional financial tools and utilities coming soon.</p>
            </div>
          } />
          
          {/* Nifty IT and Pharma Placeholders */}
          <Route path="/indices/niftyit" element={
            <div className="page-container">
              <h1>Nifty IT</h1>
              <p>Nifty IT Index data and analysis coming soon.</p>
            </div>
          } />
          <Route path="/indices/niftypharma" element={
            <div className="page-container">
              <h1>Nifty Pharma</h1>
              <p>Nifty Pharma Index data and analysis coming soon.</p>
            </div>
          } />
          
          {/* Catch all route - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
