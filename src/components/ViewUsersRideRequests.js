// src/components/ViewUsersRideRequests.js
import React, { useEffect, useState } from 'react';
import ApiClient from '../generated-api/src/ApiClient';
import { Table, Button, Spinner, Alert, Container } from 'react-bootstrap';

const ViewUsersRideRequests = () => {
  const [rideRequests, setRideRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiClient = new ApiClient();
  apiClient.basePath = 'http://localhost:8088/api/v1';

  const fetchRideRequests = () => {
    apiClient.callApi('/ride-requests/user-requests', 'GET', {}, {}, {}, {}, null, [], ['application/json'], ['application/json'], null, null, (error, data, response) => {
      if (error) {
        console.error('Error fetching user ride requests:', error);
        setError('Failed to fetch ride requests.');
        setLoading(false);
      } else {
        try {
          const parsedData = JSON.parse(response.text);
          setRideRequests(parsedData);
        } catch (e) {
          console.error('Error parsing ride requests response:', e);
          setError('Invalid response format.');
        }
        setLoading(false);
      }
    });
  };

  const handleCancelRequest = (requestId) => {
    apiClient.callApi(`/ride-requests/${requestId}/cancel`, 'PUT', {}, {}, {}, {}, null, [], ['application/json'], ['application/json'], null, null, (error, data, response) => {
      if (error) {
        console.error('Error canceling ride request:', error);
        setError('Failed to cancel ride request.');
      } else {
        console.log('Ride request canceled successfully');
        fetchRideRequests(); // Refresh the list after cancelling
      }
    });
  };

  useEffect(() => {
    fetchRideRequests();
  }, []);

  return (
    <Container className="mt-5">
      <h2>My Ride Requests</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {loading ? (
        <Spinner animation="border" />
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Ride Offer ID</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rideRequests && rideRequests.length > 0 ? (
              rideRequests.map((request) => (
                <tr key={request.id}>
                  <td>{request.rideOfferId}</td>
                  <td>{request.requestStatus}</td>
                  <td>
                    {request.requestStatus === 'PENDING' && (
                      <Button variant="danger" size="sm" onClick={() => handleCancelRequest(request.id)}>
                        Cancel Request
                      </Button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">No ride requests found.</td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default ViewUsersRideRequests;
