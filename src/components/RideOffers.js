// src/components/RideOffers.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiClient from '../generated-api/src/ApiClient';
import RideOfferApi from '../generated-api/src/api/RideOfferApi';
import { Alert, Button, ListGroup, DropdownButton, Dropdown, Pagination } from 'react-bootstrap';

const RideOffers = () => {
  const navigate = useNavigate();
  const apiClient = new ApiClient();
  apiClient.basePath = 'http://localhost:8088/api/v1';
  const rideOfferApi = new RideOfferApi(apiClient);

  const [rideOffers, setRideOffers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState(null);
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
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
          console.log('Full Response:', response);
          console.log('Parsed Data:', data);
          if (error || !response.text) {
            console.error('Error checking current user:', error);
            setError('Failed to fetch current user.');
          } else {
            // Since the backend returns only the email as a plain string, use it directly
            setCurrentUser(response.text);
          }
        }
      );
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchRideOffers = (page = 0, size = pageSize) => {
      rideOfferApi.findAllRideOffersPaginated({ page, size }, (error, data, response) => {
        if (error) {
          console.error('Error fetching ride offers:', error);
          setError('Failed to fetch ride offers.');
        } else {
          setRideOffers(data.content);
          setTotalPages(data.totalPages);
          setCurrentPage(data.number);
        }
      });
    };

    fetchRideOffers(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const handleViewDetails = (offer) => {
    const isOwner = currentUser && currentUser.toLowerCase() === offer.creatorEmail.toLowerCase();
    navigate(`/ride-offers/${offer.id}`, { state: { offer, isOwner } });
  };

  const handleEdit = (offer) => {
    navigate(`/ride-offers/edit/${offer.id}`, { state: { offer } });
  };

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this ride offer?')) return;
    rideOfferApi.deleteRideOffer(id, (error) => {
      if (error) {
        console.error('Error deleting ride offer:', error);
        setError('Failed to delete ride offer.');
      } else {
        setRideOffers((prevOffers) => prevOffers.filter((offer) => offer.id !== id));
      }
    });
  };

  const handleJoinRequest = (offer) => {
    navigate(`/ride-requests/create`, { state: { offer } });
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(0); // Reset to first page
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center">
        <h2>Ride Offers</h2>
        <DropdownButton id="dropdown-basic-button" title={`Page Size: ${pageSize}`} onSelect={(e) => handlePageSizeChange(Number(e))}>
          <Dropdown.Item eventKey={5}>5</Dropdown.Item>
          <Dropdown.Item eventKey={10}>10</Dropdown.Item>
          <Dropdown.Item eventKey={20}>20</Dropdown.Item>
          <Dropdown.Item eventKey={-1}>All</Dropdown.Item>
        </DropdownButton>
      </div>
      {error && <Alert variant="danger">{error}</Alert>}

      <ListGroup className="mt-3">
        {rideOffers.map((offer) => (
          <ListGroup.Item key={offer.id} className="d-flex justify-content-between align-items-center">
            <div>
              <h5>Ride from {offer.startLocation} to {offer.endLocation}</h5>
              <p>Departure Time: {new Date(offer.departureTime).toLocaleString()}</p>
              <p>Available Seats: {offer.availableSeats}</p>
            </div>
            <div>
              <Button
                variant="primary"
                className="me-2"
                onClick={() => handleViewDetails(offer)}
              >
                View Details
              </Button>
              {currentUser && currentUser.toLowerCase() === offer.creatorEmail.toLowerCase() ? (
                <>
                  <Button
                    variant="warning"
                    className="me-2"
                    onClick={() => handleEdit(offer)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(offer.id)}
                  >
                    Delete
                  </Button>
                </>
              ) : (
                <Button
                  variant="success"
                  onClick={() => handleJoinRequest(offer)}
                >
                  Join Request
                </Button>
              )}
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>

      <div className="d-flex justify-content-center mt-4">
        <Pagination>
          <Pagination.First
            onClick={() => handlePageChange(0)}
            disabled={currentPage === 0}
          />
          <Pagination.Prev
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
          />
          {Array.from({ length: totalPages }, (_, index) => (
            <Pagination.Item
              key={index}
              active={index === currentPage}
              onClick={() => handlePageChange(index)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages - 1}
          />
          <Pagination.Last
            onClick={() => handlePageChange(totalPages - 1)}
            disabled={currentPage === totalPages - 1}
          />
        </Pagination>
      </div>
    </div>
  );
};

export default RideOffers;
