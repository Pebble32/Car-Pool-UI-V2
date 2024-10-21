// src/components/RideOffers.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiClient from '../generated-api/src/ApiClient';
import RideOfferApi from '../generated-api/src/api/RideOfferApi';
import { Button, Dropdown, ButtonGroup, Alert, Spinner } from 'react-bootstrap';

const RideOffers = () => {
  const navigate = useNavigate();
  const apiClient = new ApiClient();
  apiClient.basePath = 'http://localhost:8088/api/v1';
  const rideOfferApi = new RideOfferApi(apiClient);

  const [rideOffers, setRideOffers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [firstPage, setFirstPage] = useState(true);
  const [lastPage, setLastPage] = useState(false);

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    fetchRideOffers(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const fetchCurrentUser = () => {
    apiClient.callApi(
      '/auth/check',
      'GET',
      {},
      {},
      {},
      {},
      null,
      [],
      ['text/plain'],
      ['text/plain'],
      null,
      null,
      (error, data, response) => {
        if (error || !response.text) {
          console.error('Error checking current user:', error);
          setError('Failed to fetch current user.');
          setLoading(false);
        } else {
          setCurrentUser(response.text);
        }
      }
    );
  };

  const fetchRideOffers = (page, size) => {
    setLoading(true);
    rideOfferApi.findAllRideOffersPaginated({ page, size }, (error, data, response) => {
      if (error) {
        console.error('Error fetching ride offers:', error);
        setError('Failed to fetch ride offers.');
      } else {
        setRideOffers(data.content);
        setCurrentPage(data.number);
        setTotalPages(data.totalPages);
        setFirstPage(data.first);
        setLastPage(data.last);
      }
      setLoading(false);
    });
  };

  const handleViewDetails = (offer) => {
    const isOwner = currentUser && currentUser.toLowerCase() === offer.creatorEmail.toLowerCase();
    navigate(`/ride-offers/${offer.id}`, { state: { offer, isOwner } });
  };

  const handleRequestToJoin = (offer) => {
    const requestPayload = {
      rideOfferId: offer.id,
      requestStatus: 'PENDING',
    };
    apiClient.callApi(
      '/ride-requests/create',
      'POST',
      {},
      {},
      {},
      {},
      requestPayload,
      [],
      ['application/json'],
      ['application/json'],
      null,
      null,
      (error, data, response) => {
        if (error) {
          console.error('Error requesting to join ride offer:', error);
          setError('Failed to request to join ride offer.');
        } else {
          console.log('Request to join ride offer sent successfully');
          fetchRideOffers(currentPage, pageSize);
        }
      }
    );
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(0); // Reset to first page when page size changes
  };

  const handleFirstPage = () => {
    if (!firstPage) {
      setCurrentPage(0);
    }
  };

  const handlePreviousPage = () => {
    if (!firstPage) {
      setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
    }
  };

  const handleNextPage = () => {
    if (!lastPage) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handleLastPage = () => {
    if (!lastPage) {
      setCurrentPage(totalPages - 1);
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Ride Offers</h2>
        <Dropdown as={ButtonGroup} onSelect={(e) => handlePageSizeChange(Number(e))}>
          <Dropdown.Toggle variant="secondary" id="dropdown-basic">
            Page Size: {pageSize}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item eventKey="5">5</Dropdown.Item>
            <Dropdown.Item eventKey="10">10</Dropdown.Item>
            <Dropdown.Item eventKey="20">20</Dropdown.Item>
            <Dropdown.Item eventKey={totalPages * pageSize}>All</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      {error && <Alert variant="danger">{error}</Alert>}
      {loading ? (
        <Spinner animation="border" />
      ) : (
        <div className="list-group">
          {rideOffers.map((offer) => (
            <div key={offer.id} className="list-group-item list-group-item-action" onClick={() => handleViewDetails(offer)}>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="mb-1">Ride from {offer.startLocation} to {offer.endLocation}</h5>
                  <p className="mb-1">Departure Time: {new Date(offer.departureTime).toLocaleString()}</p>
                  <p className="mb-1">Available Seats: {offer.availableSeats}</p>
                </div>
                <div>
                  {currentUser && currentUser.toLowerCase() === offer.creatorEmail.toLowerCase() ? (
                    <>
                      <Button variant="warning" size="sm" className="me-2" onClick={(e) => { e.stopPropagation(); navigate(`/ride-offers/edit/${offer.id}`, { state: { offer } }) }}>Edit</Button>
                      <Button variant="danger" size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/ride-offers/delete/${offer.id}`, { state: { offer } }) }}>Delete</Button>
                    </>
                  ) : (
                    <Button variant="success" size="sm" onClick={(e) => { e.stopPropagation(); handleRequestToJoin(offer) }}>Request to Join</Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="d-flex justify-content-center mt-3">
        <Button variant="secondary" size="sm" className="me-2" onClick={handleFirstPage} disabled={firstPage}>&lt;&lt;</Button>
        <Button variant="secondary" size="sm" className="me-2" onClick={handlePreviousPage} disabled={firstPage}>&lt;</Button>
        {[...Array(totalPages).keys()].map(pageNumber => (
          (pageNumber === currentPage || pageNumber === currentPage - 1 || pageNumber === currentPage + 1) && (
            <Button
              key={pageNumber}
              variant={pageNumber === currentPage ? "primary" : "secondary"}
              size="sm"
              className="me-2"
              onClick={() => setCurrentPage(pageNumber)}
            >
              {pageNumber + 1}
            </Button>
          )
        ))}
        <Button variant="secondary" size="sm" className="me-2" onClick={handleNextPage} disabled={lastPage}>&gt;</Button>
        <Button variant="secondary" size="sm" onClick={handleLastPage} disabled={lastPage}>&gt;&gt;</Button>
      </div>
    </div>
  );
};

export default RideOffers;
