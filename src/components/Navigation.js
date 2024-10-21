// src/components/Navigation.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import ApiClient from '../generated-api/src/ApiClient';

const Navigation = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('User');
  const apiClient = new ApiClient();
  apiClient.basePath = 'http://localhost:8088/api/v1';

  const checkLoginStatus = () => {
    apiClient.callApi('/auth/check', 'GET', {}, {}, {}, {}, null, [], ['text/plain'], ['text/plain'], null, null, (error, data, response) => {
      console.log('Full Response:', response);
      console.log('Parsed Data:', data);
      if (error || !response || !response.text) {
        console.error('Error checking current user:', error);
        setIsLoggedIn(false);
      } else {
        const userEmail = response.text;
        console.log('Current user email:', userEmail);
        setIsLoggedIn(userEmail.length > 0);
        setUserName(userEmail.split('@')[0]); // Use part of email as username
      }
    });
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const handleLogout = () => {
    apiClient.callApi('/auth/logout', 'POST', {}, {}, {}, {}, null, [], ['application/json'], ['application/json'], null, null, (error, data, response) => {
      if (error) {
        console.error('Error logging out:', error);
      } else {
        console.log('Logged out successfully');
        setIsLoggedIn(false);
        setUserName('User');
      }
    });
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/ride-offers">CarPool</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/ride-offers">Ride Offers</Nav.Link>
            <Nav.Link as={Link} to="/create-ride-offer">Create Ride Offer</Nav.Link>
            {isLoggedIn ? (
              <NavDropdown title={userName} id="user-dropdown">
                <NavDropdown.Item as={Link} to="/my-ride-requests">My Ride Requests</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/my-ride-offers">My Ride Offers</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/user-details">User Details</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
