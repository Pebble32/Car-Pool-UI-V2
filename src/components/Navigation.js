// src/components/Navigation.js
import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import ApiClient from '../generated-api/src/ApiClient';
import { AuthContext } from '../context/AuthContext';

const Navigation = () => {
  const { isLoggedIn, setIsLoggedIn, userName, setUserName } = useContext(AuthContext);
  const apiClient = new ApiClient();
  apiClient.basePath = 'http://localhost:8088/api/v1';

  const checkLoginStatus = () => {
    apiClient.callApi('/auth/check', 'GET', {}, {}, {}, {}, null, [], ['text/plain'], ['text/plain'], null, null, (error, data, response) => {
      if (error || !response || !response.text) {
        setIsLoggedIn(false);
      } else {
        const userEmail = response.text;
        setIsLoggedIn(userEmail.length > 0);
        setUserName(userEmail.split('@')[0]);
      }
    });
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const handleLogout = () => {
    apiClient.callApi('/auth/logout', 'POST', {}, {}, {}, {}, null, [], ['application/json'], ['application/json'], null, null, (error) => {
      if (!error) {
        setIsLoggedIn(false);
        setUserName('');
      }
    });
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">CarPool</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/ride-offers">Ride Offers</Nav.Link>
            <Nav.Link as={Link} to="/create-ride-offer">Create Ride Offer</Nav.Link>
            {isLoggedIn ? (
              <NavDropdown title={userName || 'User'} id="user-dropdown">
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
