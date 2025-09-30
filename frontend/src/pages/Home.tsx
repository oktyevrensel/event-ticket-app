import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Home.css';

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  price: number;
  image?: string;
  category: {
    name: string;
  };
}

const Home: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/');
      setEvents(response.data.results || response.data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <Container>
          <div className="hero-content">
            <h1 className="hero-title fade-in-up">
              En İyi Etkinlikleri Keşfedin
            </h1>
            <p className="hero-subtitle fade-in-up">
              Konserler, konferanslar, spor etkinlikleri ve daha fazlası. 
              Biletlerinizi güvenle satın alın.
            </p>
            <Link to="/events">
              <Button 
                variant="primary" 
                size="lg" 
                className="hero-btn fade-in-up"
              >
                Etkinlikleri Görüntüle
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* Featured Events */}
      <section className="featured-events py-5">
        <Container>
          <div className="text-center mb-5">
            <h2 className="section-title">Öne Çıkan Etkinlikler</h2>
            <p className="section-subtitle">
              En popüler ve yaklaşan etkinliklerimizi keşfedin
            </p>
          </div>

          {events.length === 0 ? (
            <div className="text-center py-5">
              <h4>Henüz etkinlik bulunmuyor</h4>
              <p className="text-muted">Yakında harika etkinlikler eklenecek!</p>
            </div>
          ) : (
            <Row>
              {events.slice(0, 3).map((event) => (
                <Col key={event.id} md={4} className="mb-4">
                  <Card className="event-card h-100">
                    <div className="event-image-container">
                      <Card.Img 
                        variant="top" 
                        src={event.image || `https://picsum.photos/400/200?random=${event.id}`}
                        className="event-image"
                        alt={event.title}
                      />
                      <div className="event-category">
                        {event.category?.name || 'Genel'}
                      </div>
                    </div>
                    <Card.Body className="d-flex flex-column">
                      <Card.Title className="event-title">
                        {event.title}
                      </Card.Title>
                      <Card.Text className="event-description">
                        {event.description.substring(0, 100)}...
                      </Card.Text>
                      <div className="event-details mt-auto">
                        <div className="event-date">
                          📅 {formatDate(event.date)} - {event.time}
                        </div>
                        <div className="event-location">
                          📍 {event.location}
                        </div>
                        <div className="event-price">
                          {formatPrice(event.price)}
                        </div>
                      </div>
                      <Link to={`/events/${event.id}`}>
                        <Button 
                          variant="primary" 
                          className="mt-3"
                        >
                          Detayları Gör
                        </Button>
                      </Link>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}

          {events.length > 3 && (
            <div className="text-center mt-4">
              <Link to="/events">
                <Button variant="outline-primary" size="lg">
                  Tüm Etkinlikleri Görüntüle
                </Button>
              </Link>
            </div>
          )}
        </Container>
      </section>
    </div>
  );
};

export default Home;
