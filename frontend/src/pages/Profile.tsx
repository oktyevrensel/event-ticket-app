import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Profile: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    fetchUserProfile();
  }, [navigate]);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/auth/profile/', {
        headers: {
          Authorization: `Token ${token}`
        }
      });
      setUser(response.data);
    } catch (error: any) {
      setError('Profil bilgileri yüklenirken bir hata oluştu.');
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Yükleniyor...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <div className="py-5">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="shadow">
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <div className="profile-avatar">
                    {user?.first_name?.charAt(0) || user?.username?.charAt(0) || 'U'}
                  </div>
                  <h2 className="mt-3">
                    {user?.first_name} {user?.last_name}
                  </h2>
                  <p className="text-muted">@{user?.username}</p>
                </div>

                <div className="profile-info">
                  <div className="info-item">
                    <label>E-posta:</label>
                    <span>{user?.email}</span>
                  </div>
                  
                  <div className="info-item">
                    <label>Kullanıcı Adı:</label>
                    <span>{user?.username}</span>
                  </div>
                  
                  <div className="info-item">
                    <label>Ad Soyad:</label>
                    <span>{user?.first_name} {user?.last_name}</span>
                  </div>
                </div>

                <div className="profile-actions mt-4">
                  <Button
                    variant="outline-primary"
                    className="me-2"
                    onClick={() => navigate('/events')}
                  >
                    Etkinlikleri Görüntüle
                  </Button>
                  
                  <Button
                    variant="danger"
                    onClick={handleLogout}
                  >
                    Çıkış Yap
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Profile;
