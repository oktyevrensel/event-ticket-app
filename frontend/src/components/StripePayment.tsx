import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { Button, Alert, Modal, Form, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import './StripePayment.css';

const stripePromise = loadStripe('pk_test_...'); // Test key

interface StripePaymentProps {
  show: boolean;
  onHide: () => void;
  event: any;
  quantity: number;
  onSuccess: (ticket: any) => void;
}

const PaymentForm: React.FC<{
  event: any;
  quantity: number;
  onSuccess: (ticket: any) => void;
  onError: (error: string) => void;
}> = ({ event, quantity, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [savedCards, setSavedCards] = useState<any[]>([]);
  const [selectedCard, setSelectedCard] = useState<string>('');

  useEffect(() => {
    fetchSavedCards();
  }, []);

  const fetchSavedCards = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/payment/methods/', {
        headers: {
          'Authorization': `Token ${token}`
        }
      });
      setSavedCards(response.data.payment_methods);
    } catch (error) {
      console.error('Error fetching saved cards:', error);
    }
  };

  const handleSubmit = async (formEvent: React.FormEvent) => {
    formEvent.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setLoading(true);

    try {
      // Payment Intent oluştur
      const response = await axios.post('http://localhost:8000/api/payment/create-intent/', {
        event_id: event.id,
        quantity: quantity
      }, {
        headers: {
          'Authorization': `Token ${localStorage.getItem('token')}`
        }
      });

      const { client_secret } = response.data;

      // Stripe ile ödeme onayla
      const { error, paymentIntent } = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        }
      });

      if (error) {
        onError(error.message || 'Ödeme sırasında bir hata oluştu');
      } else if (paymentIntent.status === 'succeeded') {
        // Ödeme başarılı, bilet oluştur
        const ticketResponse = await axios.post('http://localhost:8000/api/payment/confirm/', {
          payment_intent_id: paymentIntent.id,
          event_id: event.id,
          quantity: quantity
        }, {
          headers: {
            'Authorization': `Token ${localStorage.getItem('token')}`
          }
        });

        onSuccess(ticketResponse.data);
      }
    } catch (error: any) {
      onError(error.response?.data?.error || 'Ödeme sırasında bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col md={12}>
          <h5>Ödeme Bilgileri</h5>
          
          {savedCards.length > 0 && (
            <div className="saved-cards mb-3">
              <h6>Kayıtlı Kartlar</h6>
              {savedCards.map((card) => (
                <div key={card.id} className="saved-card">
                  <Form.Check
                    type="radio"
                    id={card.id}
                    name="savedCard"
                    value={card.id}
                    checked={selectedCard === card.id}
                    onChange={(e) => setSelectedCard(e.target.value)}
                    label={`**** **** **** ${card.card.last4} (${card.card.brand})`}
                  />
                </div>
              ))}
              <Form.Check
                type="radio"
                id="newCard"
                name="savedCard"
                value=""
                checked={selectedCard === ''}
                onChange={(e) => setSelectedCard(e.target.value)}
                label="Yeni kart kullan"
              />
            </div>
          )}

          {selectedCard === '' && (
            <div className="card-element-container">
              <CardElement options={cardElementOptions} />
            </div>
          )}

          <div className="payment-summary mt-3">
            <div className="summary-item">
              <span>Etkinlik:</span>
              <span>{event.title}</span>
            </div>
            <div className="summary-item">
              <span>Miktar:</span>
              <span>{quantity} bilet</span>
            </div>
            <div className="summary-item">
              <span>Birim Fiyat:</span>
              <span>₺{event.price}</span>
            </div>
            <div className="summary-item total">
              <span><strong>Toplam:</strong></span>
              <span><strong>₺{(event.price * quantity).toFixed(2)}</strong></span>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-100 mt-3"
            disabled={!stripe || loading}
          >
            {loading ? 'Ödeme İşleniyor...' : `₺${(event.price * quantity).toFixed(2)} Öde`}
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

const StripePayment: React.FC<StripePaymentProps> = ({
  show,
  onHide,
  event,
  quantity,
  onSuccess
}) => {
  const [error, setError] = useState('');

  const handleSuccess = (ticket: any) => {
    onSuccess(ticket);
    onHide();
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Güvenli Ödeme</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && (
          <Alert variant="danger" className="mb-3">
            {error}
          </Alert>
        )}

        <Elements stripe={stripePromise}>
          <PaymentForm
            event={event}
            quantity={quantity}
            onSuccess={handleSuccess}
            onError={handleError}
          />
        </Elements>

        <div className="payment-security mt-3">
          <small className="text-muted">
            <i className="fas fa-shield-alt me-1"></i>
            Ödeme bilgileriniz SSL ile şifrelenir ve güvenle işlenir.
          </small>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default StripePayment;
