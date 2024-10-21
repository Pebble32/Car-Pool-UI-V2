
// src/components/Navigation.js
import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/ride-offers">CarPool</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/ride-offers">Ride Offers</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/create-ride-offer">Create Ride Offer</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/ride-requests">My Ride Requests</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/logout">Logout</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;