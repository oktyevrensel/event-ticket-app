import React, { useState, useEffect } from 'react';
import { Alert, Badge } from 'react-bootstrap';
import { useWebSocket } from '../hooks/useWebSocket';

interface RealTimeEventDetailProps {
  eventId: string;
  onTicketCountUpdate?: (count: number, remaining: number) => void;
}

const RealTimeEventDetail: React.FC<RealTimeEventDetailProps> = ({
  eventId,
  onTicketCountUpdate
}) => {
  const [ticketCount, setTicketCount] = useState(0);
  const [remainingTickets, setRemainingTickets] = useState(0);
  const [recentPurchases, setRecentPurchases] = useState<Array<{
    user: string;
    timestamp: number;
  }>>([]);

  const { isConnected, sendMessage } = useWebSocket({
    url: `ws://localhost:8000/ws/event/${eventId}/`,
    onMessage: (message) => {
      switch (message.type) {
        case 'ticket_count':
          setTicketCount(message.ticket_count);
          setRemainingTickets(message.remaining_tickets);
          onTicketCountUpdate?.(message.ticket_count, message.remaining_tickets);
          break;
        
        case 'ticket_purchased':
          setTicketCount(message.ticket_count);
          setRemainingTickets(message.remaining_tickets);
          onTicketCountUpdate?.(message.ticket_count, message.remaining_tickets);
          
          // Add to recent purchases
          setRecentPurchases(prev => [
            {
              user: message.user,
              timestamp: Date.now()
            },
            ...prev.slice(0, 4) // Keep only last 5
          ]);
          break;
        
        case 'event_info':
          if (message.event) {
            setRemainingTickets(message.event.remaining_tickets);
          }
          break;
      }
    },
    onOpen: () => {
      // Request initial data
      sendMessage({ type: 'get_ticket_count' });
      sendMessage({ type: 'join_event' });
    }
  });

  // Clean up old recent purchases
  useEffect(() => {
    const interval = setInterval(() => {
      setRecentPurchases(prev => 
        prev.filter(purchase => Date.now() - purchase.timestamp < 30000) // 30 seconds
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="real-time-info">
      {/* Connection Status */}
      <div className="connection-status mb-3">
        <Badge bg={isConnected ? 'success' : 'danger'}>
          <i className={`fas ${isConnected ? 'fa-wifi' : 'fa-wifi-slash'} me-1`}></i>
          {isConnected ? 'Canlı Bağlantı' : 'Bağlantı Kesildi'}
        </Badge>
      </div>

      {/* Real-time Stats */}
      <div className="real-time-stats mb-3">
        <div className="stat-item">
          <span className="stat-label">Satılan Bilet:</span>
          <span className="stat-value">{ticketCount}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Kalan Bilet:</span>
          <span className={`stat-value ${remainingTickets < 10 ? 'text-danger' : ''}`}>
            {remainingTickets}
          </span>
        </div>
      </div>

      {/* Recent Purchases */}
      {recentPurchases.length > 0 && (
        <Alert variant="info" className="recent-purchases">
          <Alert.Heading>
            <i className="fas fa-bolt me-2"></i>
            Son Satın Almalar
          </Alert.Heading>
          <div className="purchase-list">
            {recentPurchases.map((purchase, index) => (
              <div key={index} className="purchase-item">
                <i className="fas fa-user-circle me-2"></i>
                <span>{purchase.user}</span>
                <small className="text-muted ms-2">
                  {Math.floor((Date.now() - purchase.timestamp) / 1000)} saniye önce
                </small>
              </div>
            ))}
          </div>
        </Alert>
      )}

      {/* Low Ticket Warning */}
      {remainingTickets < 10 && remainingTickets > 0 && (
        <Alert variant="warning" className="low-tickets-warning">
          <i className="fas fa-exclamation-triangle me-2"></i>
          <strong>Dikkat!</strong> Sadece {remainingTickets} bilet kaldı!
        </Alert>
      )}

      {/* Sold Out */}
      {remainingTickets === 0 && (
        <Alert variant="danger" className="sold-out-warning">
          <i className="fas fa-times-circle me-2"></i>
          <strong>Tükendi!</strong> Bu etkinlik için bilet kalmadı.
        </Alert>
      )}
    </div>
  );
};

export default RealTimeEventDetail;
