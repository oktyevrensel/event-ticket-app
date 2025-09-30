import React, { useState } from 'react';
import { Navbar, Nav, Container, Button, Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const CustomNavbar: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  return (
    <Navbar expand="lg" className="custom-navbar">
      <Container>
        <Navbar.Brand as={Link} to="/" className="navbar-brand">
          <i className="fas fa-plane me-2"></i>
          EventTicket
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/events" className="nav-link">
              Etkinlikler
            </Nav.Link>
            <Nav.Link href="#" className="nav-link">
              Kategoriler
            </Nav.Link>
          </Nav>

          <div className="navbar-search">
            <div className="search-input-wrapper">
              <i className="fas fa-search search-icon"></i>
              <input
                type="text"
                placeholder="Binlerce etkinlik ve mekan arasında aradığınızı bulun..."
                className="search-input"
              />
            </div>
          </div>

          <Nav className="ms-auto">
            <Nav.Link href="#" className="nav-link">
              Şehrinizi Keşfedin
            </Nav.Link>
            
            <div className="navbar-actions">
              <div className="language-selector me-3">
                <i className="fas fa-globe"></i>
              </div>

              {user ? (
                <Dropdown>
                  <Dropdown.Toggle variant="link" className="user-dropdown">
                    <i className="fas fa-user-circle"></i>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item as={Link} to="/profile">
                      <i className="fas fa-user me-2"></i>
                      Profilim
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/tickets">
                      <i className="fas fa-ticket-alt me-2"></i>
                      Biletlerim
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleLogout}>
                      <i className="fas fa-sign-out-alt me-2"></i>
                      Çıkış Yap
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <div className="auth-buttons">
                  <Link to="/login" className="login-btn-link">
                    <Button
                      variant="outline-primary"
                      className="login-btn"
                    >
                      Giriş Yap
                    </Button>
                  </Link>
                  <Link to="/register" className="register-btn-link">
                    <Button
                      variant="primary"
                      className="register-btn"
                    >
                      Kayıt Ol
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;