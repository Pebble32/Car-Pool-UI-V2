// src/components/RideOffers.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiClient from '../generated-api/src/ApiClient';
import RideOfferApi from '../generated-api/src/api/RideOfferApi';

const RideOffers = () => {
  const navigate = useNavigate();
  const apiClient = new ApiClient();
  apiClient.basePath = 'http://localhost:8088/api/v1';
  const rideOfferApi = new RideOfferApi(apiClient);

  const [rideOffers, setRideOffers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useState(() => {
    // Fetch current user information
    apiClient.callApi('/auth/check', 'GET', {}, {}, {}, {}, null, [], ['application/json'], ['application/json'], null, null, (error, data, response) => {
      if (error) {
        console.error('Error fetching current user:', error);
      } else {
        setCurrentUser(data);
      }
    });

    // Fetch ride offers
    rideOfferApi.findAllRideOffersPaginated({ page: 0, size: 10 }, (error, data, response) => {
      if (error) {
        console.error('Error fetching ride offers:', error);
      } else {
        setRideOffers(data.content);
      }
    });
  }, [rideOfferApi, apiClient]);

  const handleViewDetails = (offer) => {
    const isOwner = currentUser && currentUser.email === offer.creatorEmail;
    navigate(`/ride-offers/${offer.id}`, { state: { offer, isOwner } });
  };

  return (
    <div className="container mt-5">
      <h2>Ride Offers</h2>
      <div className="row">
        {rideOffers.map((offer) => (
          <div key={offer.id} className="col-md-4 mb-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Ride from {offer.startLocation} to {offer.endLocation}</h5>
                <p className="card-text">Departure Time: {new Date(offer.departureTime).toLocaleString()}</p>
                <p className="card-text">Available Seats: {offer.availableSeats}</p>
                <button className="btn btn-primary" onClick={() => handleViewDetails(offer)}>View Details</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RideOffers;
