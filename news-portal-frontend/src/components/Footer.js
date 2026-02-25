import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>About Us</h3>
          <p>News Portal is your trusted source for latest news and updates from around the world.</p>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/news">News</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Categories</h3>
          <ul>
            <li>
              <Link to="/news?category=Technology">Technology</Link>
            </li>
            <li>
              <Link to="/news?category=Business">Business</Link>
            </li>
            <li>
              <Link to="/news?category=Sports">Sports</Link>
            </li>
            <li>
              <Link to="/news?category=Entertainment">Entertainment</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contact Info</h3>
          <p>Email: info@newsportal.com</p>
          <p>Phone: +1 (555) 123-4567</p>
          <p>Address: 123 News Street, City, Country</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2024 News Portal. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
