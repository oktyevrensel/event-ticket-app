import React, { useState, useEffect } from 'react';
import { Modal, Button, Row, Col, Alert, Badge } from 'react-bootstrap';
import './SeatSelection.css';

interface Seat {
  id: string;
  row: string;
  number: number;
  isAvailable: boolean;
  isSelected: boolean;
  price: number;
  type: 'standard' | 'vip' | 'premium';
}

interface SeatSelectionProps {
  show: boolean;
  onHide: () => void;
  onSeatsSelected: (seats: Seat[]) => void;
  eventId: string;
  totalSeats: number;
  rows: number;
  seatsPerRow: number;
}

const SeatSelection: React.FC<SeatSelectionProps> = ({
  show,
  onHide,
  onSeatsSelected,
  eventId,
  totalSeats,
  rows,
  seatsPerRow
}) => {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show) {
      generateSeats();
    }
  }, [show, rows, seatsPerRow]);

  const generateSeats = () => {
    const newSeats: Seat[] = [];
    const rowLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    
    for (let row = 0; row < rows; row++) {
      for (let seat = 1; seat <= seatsPerRow; seat++) {
        const seatId = `${rowLetters[row]}${seat}`;
        const isAvailable = Math.random() > 0.3; // %70 available
        const type = row < 3 ? 'vip' : row < 6 ? 'premium' : 'standard';
        const price = type === 'vip' ? 500 : type === 'premium' ? 300 : 200;
        
        newSeats.push({
          id: seatId,
          row: rowLetters[row],
          number: seat,
          isAvailable,
          isSelected: false,
          price,
          type
        });
      }
    }
    
    setSeats(newSeats);
  };

  const handleSeatClick = (seatId: string) => {
    setSeats(prevSeats => 
      prevSeats.map(seat => {
        if (seat.id === seatId && seat.isAvailable) {
          const newSelected = !seat.isSelected;
          if (newSelected) {
            setSelectedSeats(prev => [...prev, { ...seat, isSelected: true }]);
          } else {
            setSelectedSeats(prev => prev.filter(s => s.id !== seatId));
          }
          return { ...seat, isSelected: newSelected };
        }
        return seat;
      })
    );
  };

  const getSeatClass = (seat: Seat) => {
    let className = 'seat';
    
    if (!seat.isAvailable) {
      className += ' seat-occupied';
    } else if (seat.isSelected) {
      className += ' seat-selected';
    } else {
      className += ` seat-${seat.type}`;
    }
    
    return className;
  };

  const getSeatPrice = (seat: Seat) => {
    return `₺${seat.price}`;
  };

  const getTotalPrice = () => {
    return selectedSeats.reduce((total, seat) => total + seat.price, 0);
  };

  const handleConfirmSelection = () => {
    onSeatsSelected(selectedSeats);
    onHide();
  };

  const renderSeatMap = () => {
    const seatMap: { [key: string]: Seat[] } = {};
    
    seats.forEach(seat => {
      if (!seatMap[seat.row]) {
        seatMap[seat.row] = [];
      }
      seatMap[seat.row].push(seat);
    });

    return Object.keys(seatMap).map(row => (
      <div key={row} className="seat-row">
        <div className="row-label">{row}</div>
        <div className="seats-in-row">
          {seatMap[row].map(seat => (
            <button
              key={seat.id}
              className={getSeatClass(seat)}
              onClick={() => handleSeatClick(seat.id)}
              disabled={!seat.isAvailable}
              title={`${seat.id} - ${getSeatPrice(seat)}`}
            >
              {seat.number}
            </button>
          ))}
        </div>
      </div>
    ));
  };

  return (
    <Modal show={show} onHide={onHide} size="xl" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="fas fa-chair me-2"></i>
          Koltuk Seçimi
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="seat-selection-container">
          {/* Stage */}
          <div className="stage">
            <i className="fas fa-music"></i>
            <span>SAHNE</span>
          </div>

          {/* Seat Map */}
          <div className="seat-map">
            {renderSeatMap()}
          </div>

          {/* Legend */}
          <div className="seat-legend">
            <div className="legend-item">
              <div className="seat seat-standard"></div>
              <span>Standart - ₺200</span>
            </div>
            <div className="legend-item">
              <div className="seat seat-premium"></div>
              <span>Premium - ₺300</span>
            </div>
            <div className="legend-item">
              <div className="seat seat-vip"></div>
              <span>VIP - ₺500</span>
            </div>
            <div className="legend-item">
              <div className="seat seat-occupied"></div>
              <span>Dolu</span>
            </div>
            <div className="legend-item">
              <div className="seat seat-selected"></div>
              <span>Seçili</span>
            </div>
          </div>

          {/* Selection Summary */}
          {selectedSeats.length > 0 && (
            <Alert variant="info" className="selection-summary">
              <h6>Seçilen Koltuklar:</h6>
              <div className="selected-seats-list">
                {selectedSeats.map(seat => (
                  <Badge key={seat.id} bg="primary" className="me-2 mb-2">
                    {seat.id} - {getSeatPrice(seat)}
                  </Badge>
                ))}
              </div>
              <div className="total-price">
                <strong>Toplam: ₺{getTotalPrice().toFixed(2)}</strong>
              </div>
            </Alert>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          İptal
        </Button>
        <Button 
          variant="primary" 
          onClick={handleConfirmSelection}
          disabled={selectedSeats.length === 0}
        >
          <i className="fas fa-check me-2"></i>
          Seçimi Onayla ({selectedSeats.length} koltuk)
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SeatSelection;
