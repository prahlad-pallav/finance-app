import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import SipCalculator from './page/Calculators/Pages/SipCalculator';
import CompoundInterestCalculator from './page/Calculators/Pages/CompoundInterest/CompoundInterestCalculator';
import Calculators from './page/Calculators/Calculators';
import Navbar from './page/Components/Navbar';
import Footer from './page/Components/Footer';
import Currency from './page/Currency/Currency';
import Cryptocurrency from './page/Cryptocurrency/Cryptocurrency';
import Nifty50 from './page/Indices/Nifty50/Nifty50';
import Sensex from './page/Indices/Sensex/Sensex';
import BankNifty from './page/Indices/BankNifty/BankNifty';
import Links from './page/Links/Links';
import Commodities from './page/Commodities/Commodities';
import Learn from './page/Learn/Learn';
import Profile from './page/User/Profile/Profile';
import Home from './page/Home/Home';

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
          
          {/* Other Routes */}
          <Route path="/learn" element={<Learn />} />
          <Route path="/links" element={<Links />} />
          <Route path="/profile" element={<Profile />} />
          
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
