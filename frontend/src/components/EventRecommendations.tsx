import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './EventRecommendations.css';

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  price: number;
  category: {
    name: string;
    slug: string;
  };
  image?: string;
  remaining_tickets: number;
}

interface EventRecommendationsProps {
  currentEventId?: number;
  userId?: number;
  category?: string;
  limit?: number;
}

const EventRecommendations: React.FC<EventRecommendationsProps> = ({
  currentEventId,
  userId,
  category,
  limit = 6
}) => {
  const [recommendations, setRecommendations] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRecommendations();
  }, [currentEventId, userId, category]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      setError('');

      // Simulate different recommendation strategies
      let url = 'http://localhost:8000/api/';
      const params = new URLSearchParams();

      if (category) {
        params.append('category', category);
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await axios.get(url);
      let events = response.data;

      // Filter out current event if provided
      if (currentEventId) {
        events = events.filter((event: Event) => event.id !== currentEventId);
      }

      // Apply recommendation logic
      events = applyRecommendationLogic(events, userId);

      // Limit results
      events = events.slice(0, limit);

      setRecommendations(events);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setError('Öneriler yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const applyRecommendationLogic = (events: Event[], userId?: number) => {
    // Simple recommendation algorithm
    // In a real app, this would use ML or collaborative filtering
    
    return events
      .sort((a, b) => {
        // Prioritize events with more tickets remaining
        if (a.remaining_tickets !== b.remaining_tickets) {
          return b.remaining_tickets - a.remaining_tickets;
        }
        
        // Then by price (lower first)
        return a.price - b.price;
      })
      .map((event, index) => ({
        ...event,
        recommendationScore: calculateRecommendationScore(event, index)
      }))
      .sort((a, b) => b.recommendationScore - a.recommendationScore);
  };

  const calculateRecommendationScore = (event: Event, index: number) => {
    let score = 100 - index; // Base score decreases with position
    
    // Boost score for events with more tickets
    score += Math.min(event.remaining_tickets / 10, 20);
    
    // Boost score for lower prices
    score += Math.max(0, 50 - event.price / 10);
    
    // Boost score for events in the same category
    if (category && event.category.slug === category) {
      score += 30;
    }
    
    return Math.round(score);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  if (loading) {
    return (
      <div className="recommendations-loading">
        <Spinner animation="border" variant="primary" />
        <p>Öneriler yükleniyor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="warning">
        {error}
      </Alert>
    );
  }

  if (recommendations.length === 0) {
    return (
      <Alert variant="info">
        <i className="fas fa-info-circle me-2"></i>
        Şu anda önerilebilecek etkinlik bulunmuyor.
      </Alert>
    );
  }

  return (
    <div className="event-recommendations">
      <div className="recommendations-header">
        <h4>
          <i className="fas fa-star me-2"></i>
          Size Özel Öneriler
        </h4>
        <p className="text-muted">
          İlginizi çekebilecek etkinlikler
        </p>
      </div>

      <Row>
        {recommendations.map((event) => (
          <Col key={event.id} md={6} lg={4} className="mb-4">
            <Card className="recommendation-card h-100">
              <div className="card-image-wrapper">
                <Card.Img
                  variant="top"
                  src={event.image || `https://picsum.photos/400/200?random=${event.id}`}
                  alt={event.title}
                  className="card-image"
                />
                <div className="recommendation-badge">
                  <i className="fas fa-star"></i>
                  <span>Önerilen</span>
                </div>
                <div className="category-badge">
                  {event.category.name}
                </div>
              </div>
              
              <Card.Body className="d-flex flex-column">
                <Card.Title className="event-title">
                  {event.title}
                </Card.Title>
                
                <Card.Text className="event-description">
                  {event.description.length > 100 
                    ? `${event.description.substring(0, 100)}...`
                    : event.description
                  }
                </Card.Text>
                
                <div className="event-details">
                  <div className="detail-item">
                    <i className="fas fa-calendar-alt"></i>
                    <span>{formatDate(event.date)}</span>
                  </div>
                  <div className="detail-item">
                    <i className="fas fa-clock"></i>
                    <span>{event.time}</span>
                  </div>
                  <div className="detail-item">
                    <i className="fas fa-map-marker-alt"></i>
                    <span>{event.location}</span>
                  </div>
                </div>
                
                <div className="event-footer mt-auto">
                  <div className="price-info">
                    <span className="price">{formatPrice(event.price)}</span>
                    <span className="remaining-tickets">
                      {event.remaining_tickets} bilet kaldı
                    </span>
                  </div>
                  
                  <Button
                    as={Link}
                    to={`/events/${event.id}`}
                    variant="primary"
                    className="view-event-btn"
                  >
                    <i className="fas fa-eye me-1"></i>
                    Detayları Gör
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default EventRecommendations;
