// src/components/RideOfferDetails.js
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ApiClient from '../generated-api/src/ApiClient';
import RideOfferApi from '../generated-api/src/api/RideOfferApi';

const RideOfferDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { offer } = location.state;
  const apiClient = new ApiClient();
  apiClient.basePath = 'http://localhost:8088/api/v1';
  const rideOfferApi = new RideOfferApi(apiClient);

  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    // Fetch the current user's email and compare it with the creatorEmail of the offer to determine ownership
    // Possibly change 'text/plain' to 'application/json' if the backend returns a JSON object in the future
    apiClient.callApi('/auth/check', 'GET', {}, {}, {}, {}, null, [], ['text/plain'], ['text/plain'], null, null, (error, data, response) => {
      if (error || !response.text) {
        console.error('Error checking current user:', error);
      } else {
        // Since the backend returns only the email as a plain string, use it directly
        const userEmail = response.text;
        if (userEmail.toLowerCase() === offer.creatorEmail.toLowerCase()) {
          setIsOwner(true);
        }
      }
    });
  }, [offer.creatorEmail, apiClient]);

  const handleEdit = () => {
    navigate(`/ride-offers/edit/${offer.id}`, { state: { offer } });
  };

  const handleDelete = () => {
    rideOfferApi.deleteRideOffer(offer.id, (error, data, response) => {
      if (error) {
        console.error('Error deleting ride offer:', error);
      } else {
        console.log('Ride offer deleted successfully');
        navigate('/ride-offers');
      }
    });
  };

  const handleRequestToJoin = () => {
    const requestPayload = {
      rideOfferId: offer.id,
      requestStatus: 'PENDING',
    };
    apiClient.callApi('/ride-requests/create', 'POST', {}, {}, {}, {}, requestPayload, [], ['application/json'], ['application/json'], null, null, (error, data, response) => {
      if (error) {
        console.error('Error requesting to join ride offer:', error);
      } else {
        console.log('Request to join ride offer sent successfully');
        navigate('/ride-offers');
      }
    });
  };

  return (
    <div className="container mt-5">
      <h2>Ride Offer Details</h2>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Ride from {offer.startLocation} to {offer.endLocation}</h5>
          <p className="card-text">Departure Time: {new Date(offer.departureTime).toLocaleString()}</p>
          <p className="card-text">Available Seats: {offer.availableSeats}</p>
          <p className="card-text">Status: {offer.status}</p>
          <p className="card-text">Creator Email: {offer.creatorEmail}</p>
        </div>
      </div>
      {isOwner ? (
        <div className="mt-3">
          <button className="btn btn-primary me-2" onClick={handleEdit}>Edit</button>
          <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
        </div>
      ) : (
        <div className="mt-3">
          <button className="btn btn-success" onClick={handleRequestToJoin}>Request to Join</button>
        </div>
      )}
    </div>
  );
};

export default RideOfferDetails;
