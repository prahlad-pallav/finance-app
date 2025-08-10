import React, { useState } from 'react';
import './Navbar.css';
import Logo from '../../Assests/Logo.png';

const Navbar = ({ currentPage, setCurrentPage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const navItems = [
    { name: 'Home', id: 'home' },
    { name: 'Calculators', id: 'calculators' },
    { name: 'Cryptocurrency', id: 'cryptocurrency' },
    { name: 'Nifty50', id: 'nifty50' },
    { name: 'Learn', id: 'learn' },
    { name: 'Tools', id: 'tools' }
  ];

  const dropdownItems = [
    { name: 'Currency', id: 'currency' },
    { name: 'Commodities', id: 'commodities' },
    { name: 'Links', id: 'links' }
  ];

  const handleNavClick = (pageId) => {
    setCurrentPage(pageId);
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleDropdownItemClick = (itemId) => {
    // Handle dropdown item clicks here
    setCurrentPage(itemId);
    setIsDropdownOpen(false);
  };

  return (
    <nav className="Navbar">
      <div className="Navbar__Container">
        {/* Logo Section */}
        <div className="Navbar__Logo" onClick={() => handleNavClick('home')}>
          <div className="Navbar__LogoIcon">
            <img src={Logo} alt="FinApp Logo" className="Navbar__LogoImage" />
          </div>
          <span className="Navbar__LogoText">FinApp</span>
        </div>

        {/* Desktop Navigation */}
        <div className="Navbar__Nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`Navbar__NavLink ${currentPage === item.id ? 'Navbar__NavLink--active' : ''}`}
              onClick={() => handleNavClick(item.id)}
            >
              {item.name}
            </button>
          ))}
          
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
                    key={item.id}
                    className={`Navbar__DropdownItem ${currentPage === item.id ? 'Navbar__DropdownItem--active' : ''}`}
                    onClick={() => handleDropdownItemClick(item.id)}
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
          <div className="Navbar__UserProfile" onClick={() => handleNavClick('profile')}>
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
              key={item.id}
              className={`Navbar__MobileNavLink ${currentPage === item.id ? 'Navbar__MobileNavLink--active' : ''}`}
              onClick={() => handleNavClick(item.id)}
            >
              {item.name}
            </button>
          ))}
          
          {/* Mobile Dropdown Items */}
          {dropdownItems.map((item) => (
            <button
              key={item.id}
              className={`Navbar__MobileNavLink ${currentPage === item.id ? 'Navbar__MobileNavLink--active' : ''}`}
              onClick={() => handleDropdownItemClick(item.id)}
            >
              {item.name}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
