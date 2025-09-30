import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './TicketPurchaseModal.css';

interface TicketPurchaseModalProps {
  show: boolean;
  onHide: () => void;
  event: any;
  onLogin: () => void;
}

const TicketPurchaseModal: React.FC<TicketPurchaseModalProps> = ({ 
  show, 
  onHide, 
  event, 
  onLogin 
}) => {
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const isLoggedIn = localStorage.getItem('token');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(price);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomerInfo({
      ...customerInfo,
      [e.target.name]: e.target.value
    });
  };

  const handlePurchase = async () => {
    if (!isLoggedIn) {
      // Üye olmadan satın alma
      if (!customerInfo.firstName || !customerInfo.lastName || !customerInfo.email) {
        setError('Lütfen tüm gerekli alanları doldurun.');
        return;
      }
    }

    setLoading(true);
    setError('');

    try {
      // Bilet satın alma API çağrısı burada yapılacak
      // Şimdilik simüle ediyoruz
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert('Bilet satın alma işlemi başarıyla tamamlandı!');
      onHide();
      
      // Profil sayfasına yönlendir
      if (isLoggedIn) {
        navigate('/profile');
      }
    } catch (error) {
      setError('Bilet satın alma işlemi sırasında bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = event?.price * ticketQuantity || 0;

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Bilet Satın Al</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {event && (
          <div className="event-info mb-4">
            <h5>{event.title}</h5>
            <p className="text-muted mb-2">
              📅 {new Date(event.date).toLocaleDateString('tr-TR')} - {event.time}
            </p>
            <p className="text-muted">📍 {event.location}</p>
          </div>
        )}

        {error && (
          <Alert variant="danger" className="mb-3">
            {error}
          </Alert>
        )}

        <Row>
          <Col md={6}>
            <h6>Bilet Bilgileri</h6>
            <Form.Group className="mb-3">
              <Form.Label>Bilet Sayısı</Form.Label>
              <div className="quantity-controls">
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => setTicketQuantity(Math.max(1, ticketQuantity - 1))}
                >
                  -
                </Button>
                <span className="quantity-display">{ticketQuantity}</span>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => setTicketQuantity(ticketQuantity + 1)}
                >
                  +
                </Button>
              </div>
            </Form.Group>

            <div className="price-info">
              <div className="price-item">
                <span>Birim Fiyat:</span>
                <span>{formatPrice(event?.price || 0)}</span>
              </div>
              <div className="price-item total">
                <span><strong>Toplam:</strong></span>
                <span><strong>{formatPrice(totalPrice)}</strong></span>
              </div>
            </div>
          </Col>

          <Col md={6}>
            {!isLoggedIn ? (
              <>
                <h6>Müşteri Bilgileri</h6>
                <Form.Group className="mb-3">
                  <Form.Label>Ad *</Form.Label>
                  <Form.Control
                    type="text"
                    name="firstName"
                    value={customerInfo.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Soyad *</Form.Label>
                  <Form.Control
                    type="text"
                    name="lastName"
                    value={customerInfo.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>E-posta *</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={customerInfo.email}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Telefon</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={customerInfo.phone}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </>
            ) : (
              <div className="user-info">
                <h6>Üye Bilgileri</h6>
                <p className="text-muted">Biletler hesabınıza kaydedilecektir.</p>
              </div>
            )}
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          İptal
        </Button>
        {!isLoggedIn && (
          <Button variant="outline-primary" onClick={onLogin}>
            Üye Ol / Giriş Yap
          </Button>
        )}
        <Button 
          variant="primary" 
          onClick={handlePurchase}
          disabled={loading}
        >
          {loading ? 'İşleniyor...' : 'Bilet Satın Al'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TicketPurchaseModal;
