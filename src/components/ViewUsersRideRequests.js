// src/components/ViewUsersRideRequests.js
import React, { useEffect, useState } from 'react';
import ApiClient from '../generated-api/src/ApiClient';
import { Table, Button, Spinner, Alert, Container, Modal } from 'react-bootstrap';

const ViewUsersRideRequests = () => {
  const [rideRequests, setRideRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const apiClient = new ApiClient();
  apiClient.basePath = 'http://localhost:8088/api/v1';

  const fetchRideRequests = () => {
    setLoading(true);
    setError(null);
    apiClient.callApi(
      '/ride-requests/user-requests',
      'GET',
      {},
      {},
      {},
      {},
      null,
      [],
      ['application/json'],
      ['application/json'],
      null,
      null,
      (error, data, response) => {
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
      }
    );
  };

  const handleCancelRequest = (requestId) => {
    if (window.confirm('Are you sure you want to cancel this ride request?')) {
      apiClient.callApi(
        `/ride-requests/delete-request/${requestId}`,
        'DELETE',
        {},
        {},
        {},
        {},
        null,
        [],
        ['application/json'],
        ['application/json'],
        null,
        null,
        (error, data, response) => {
          if (error) {
            console.error('Error canceling ride request:', error);
            setError('Failed to cancel ride request.');
          } else {
            console.log('Ride request canceled successfully');
            fetchRideRequests(); // Refresh the list after canceling
          }
        }
      );
    }
  };

  const handleDeleteRequest = (requestId) => {
    setSelectedRequestId(requestId);
    setShowDeleteModal(true);
  };

  const confirmDeleteRequest = () => {
    if (selectedRequestId !== null) {
      apiClient.callApi(
        `/ride-requests/delete-request/${selectedRequestId}`,
        'DELETE',
        {},
        {},
        {},
        {},
        null,
        [],
        ['application/json'],
        ['application/json'],
        null,
        null,
        (error, data, response) => {
          if (error) {
            console.error('Error deleting ride request:', error);
            setError('Failed to delete ride request.');
          } else {
            console.log('Ride request deleted successfully');
            fetchRideRequests(); // Refresh the list after deleting
          }
          setShowDeleteModal(false);
          setSelectedRequestId(null);
        }
      );
    }
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedRequestId(null);
  };

  useEffect(() => {
    fetchRideRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                    {request.requestStatus !== 'CANCELLED' && (
                      <Button
                        variant="warning"
                        size="sm"
                        className="me-2"
                        onClick={() => handleCancelRequest(request.id)}
                      >
                        Cancel Request
                      </Button>
                    )}
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteRequest(request.id)}
                    >
                      Delete Request
                    </Button>
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

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Ride Request</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this ride request? This action cannot be undone.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDeleteRequest}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ViewUsersRideRequests;
