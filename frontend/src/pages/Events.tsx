import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Events: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
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

  if (loading) {
    return (
      <div className="loading-spinner">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div className="py-5">
      <Container>
        <h1 className="text-center mb-5">Etkinlikler</h1>
        {events.length === 0 ? (
          <div className="text-center py-5">
            <h4>Henüz etkinlik bulunmuyor</h4>
          </div>
        ) : (
          <Row>
            {events.map((event) => (
              <Col key={event.id} md={4} className="mb-4">
                <Card className="event-card h-100">
                  <Card.Img 
                    variant="top" 
                    src={`https://picsum.photos/400/200?random=${event.id}`}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  <Card.Body>
                    <Card.Title>{event.title}</Card.Title>
                    <Card.Text>{event.description?.substring(0, 100)}...</Card.Text>
                    <Link to={`/events/${event.id}`}>
                      <Button variant="primary">
                        Detayları Gör
                      </Button>
                    </Link>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  );
};

export default Events;
