import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import TicketPurchaseModal from '../components/TicketPurchaseModal';
import LoginModal from '../components/LoginModal';

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const fetchEventDetail = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/${id}/`);
      setEvent(response.data);
    } catch (error) {
      console.error('Error fetching event detail:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchEventDetail();
    }
  }, [id, fetchEventDetail]);

  // const formatPrice = (price: number) => {
  //   return new Intl.NumberFormat('tr-TR', {
  //     style: 'currency',
  //     currency: 'TRY'
  //   }).format(price);
  // };

  const handlePurchaseTicket = () => {
    setShowPurchaseModal(true);
  };

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    setShowPurchaseModal(true);
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <Spinner animation="border" />
      </div>
    );
  }

  if (!event) {
    return (
      <Container className="py-5">
        <h4>Etkinlik bulunamadı</h4>
        <Button variant="outline-primary" onClick={() => navigate('/events')}>
          Etkinliklere Dön
        </Button>
      </Container>
    );
  }

  return (
    <div className="py-5">
      <Container>
        <Row>
          <Col lg={8}>
            <Card>
              <Card.Img 
                variant="top" 
                src={`https://picsum.photos/800/400?random=${event.id}`}
                style={{ height: '400px', objectFit: 'cover' }}
              />
              <Card.Body className="p-5">
                <h1>{event.title}</h1>
                <p className="text-muted">
                  📅 {new Date(event.date).toLocaleDateString('tr-TR')} - {event.time}
                </p>
                <p className="text-muted">📍 {event.location}</p>
                <p>{event.description}</p>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4}>
            <Card className="p-4">
              <h4>Bilet Fiyatı</h4>
              <h3 className="text-success">₺{event.price}</h3>
              <Button 
                variant="primary" 
                size="lg" 
                className="w-100"
                onClick={handlePurchaseTicket}
              >
                Bilet Satın Al
              </Button>
            </Card>
          </Col>
        </Row>

        {/* Modals */}
        <TicketPurchaseModal
          show={showPurchaseModal}
          onHide={() => setShowPurchaseModal(false)}
          event={event}
          onLogin={handleLoginClick}
        />

        <LoginModal
          show={showLoginModal}
          onHide={() => setShowLoginModal(false)}
          onSuccess={handleLoginSuccess}
        />
      </Container>
    </div>
  );
};

export default EventDetail;