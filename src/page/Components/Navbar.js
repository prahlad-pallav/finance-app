import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';
import Logo from '../../Assests/Logo.png';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isIndicesDropdownOpen, setIsIndicesDropdownOpen] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Calculators', path: '/calculators' },
    { name: 'Cryptocurrency', path: '/cryptocurrency' },
    { name: 'Nifty50', path: '/indices/nifty50' },
    { name: 'Learn', path: '/learn' },
    { name: 'Tools', path: '/tools' }
  ];

  const indicesItems = [
    { name: 'Nifty 50', path: '/indices/nifty50' },
    { name: 'Sensex', path: '/indices/sensex' },
    { name: 'Bank Nifty', path: '/indices/banknifty' },
    { name: 'Nifty IT', path: '/indices/niftyit' },
    { name: 'Nifty Pharma', path: '/indices/niftypharma' }
  ];

  const dropdownItems = [
    { name: 'Currency', path: '/currency' },
    { name: 'Commodities', path: '/commodities' },
    { name: 'Links', path: '/links' }
  ];

  const handleNavClick = (path) => {
    navigate(path);
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
    setIsIndicesDropdownOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    setIsIndicesDropdownOpen(false);
  };

  const toggleIndicesDropdown = () => {
    setIsIndicesDropdownOpen(!isIndicesDropdownOpen);
    setIsDropdownOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="Navbar">
      <div className="Navbar__Container">
        {/* Logo Section */}
        <div className="Navbar__Logo" onClick={() => handleNavClick('/')}>
          <div className="Navbar__LogoIcon">
            <img src={Logo} alt="GainGuru Logo" className="Navbar__LogoImage" />
          </div>
          <span className="Navbar__LogoText">GainGuru</span>
        </div>

        {/* Desktop Navigation */}
        <div className="Navbar__Nav">
          {navItems.map((item) => (
            <button
              key={item.path}
              className={`Navbar__NavLink ${isActive(item.path) ? 'Navbar__NavLink--active' : ''}`}
              onClick={() => handleNavClick(item.path)}
            >
              {item.name}
            </button>
          ))}
          
          {/* Indices Dropdown */}
          <div className="Navbar__Dropdown">
            <button
              className={`Navbar__NavLink Navbar__DropdownToggle ${isIndicesDropdownOpen ? 'Navbar__NavLink--active' : ''}`}
              onClick={toggleIndicesDropdown}
            >
              Indices
              <svg 
                className={`Navbar__DropdownArrow ${isIndicesDropdownOpen ? 'Navbar__DropdownArrow--open' : ''}`}
                width="12" 
                height="12" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <polyline points="6,9 12,15 18,9"></polyline>
              </svg>
            </button>
            
            {isIndicesDropdownOpen && (
              <div className="Navbar__DropdownMenu">
                {indicesItems.map((item) => (
                  <button
                    key={item.path}
                    className={`Navbar__DropdownItem ${isActive(item.path) ? 'Navbar__DropdownItem--active' : ''}`}
                    onClick={() => handleNavClick(item.path)}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* More Dropdown */}
          <div className="Navbar__Dropdown">
            <button
              className={`Navbar__NavLink Navbar__DropdownToggle ${isDropdownOpen ? 'Navbar__NavLink--active' : ''}`}
              onClick={toggleDropdown}
            >
              More
              <svg 
                className={`Navbar__DropdownArrow ${isDropdownOpen ? 'Navbar__DropdownArrow--open' : ''}`}
                width="12" 
                height="12" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <polyline points="6,9 12,15 18,9"></polyline>
              </svg>
            </button>
            
            {isDropdownOpen && (
              <div className="Navbar__DropdownMenu">
                {dropdownItems.map((item) => (
                  <button
                    key={item.path}
                    className={`Navbar__DropdownItem ${isActive(item.path) ? 'Navbar__DropdownItem--active' : ''}`}
                    onClick={() => handleNavClick(item.path)}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side Icons */}
        <div className="Navbar__Actions">
          {/* Notification Bell */}
          <button className="Navbar__NotificationBtn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
            </svg>
          </button>

          {/* User Profile */}
          <div className="Navbar__UserProfile" onClick={() => handleNavClick('/profile')}>
            <div className="Navbar__ProfileAvatar">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="5" fill="#FFB6C1"/>
                <path d="M20 21C20 16.5817 16.4183 13 12 13C7.58172 13 4 16.5817 4 21" stroke="#FFB6C1" strokeWidth="2"/>
              </svg>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button className="Navbar__MobileMenuBtn" onClick={toggleMenu}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="Navbar__MobileMenu">
          {navItems.map((item) => (
            <button
              key={item.path}
              className={`Navbar__MobileNavLink ${isActive(item.path) ? 'Navbar__MobileNavLink--active' : ''}`}
              onClick={() => handleNavClick(item.path)}
            >
              {item.name}
            </button>
          ))}
          
          {/* Mobile Indices Items */}
          <div className="Navbar__MobileSection">
            <div className="Navbar__MobileSectionTitle">Indices</div>
            {indicesItems.map((item) => (
              <button
                key={item.path}
                className={`Navbar__MobileNavLink Navbar__MobileNavLink--indent ${isActive(item.path) ? 'Navbar__MobileNavLink--active' : ''}`}
                onClick={() => handleNavClick(item.path)}
              >
                {item.name}
              </button>
            ))}
          </div>
          
          {/* Mobile Dropdown Items */}
          <div className="Navbar__MobileSection">
            <div className="Navbar__MobileSectionTitle">More</div>
            {dropdownItems.map((item) => (
              <button
                key={item.path}
                className={`Navbar__MobileNavLink Navbar__MobileNavLink--indent ${isActive(item.path) ? 'Navbar__MobileNavLink--active' : ''}`}
                onClick={() => handleNavClick(item.path)}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
