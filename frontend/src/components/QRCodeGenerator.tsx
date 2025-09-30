import React from 'react';
import QRCode from 'react-qr-code';
import { Modal, Button, Card } from 'react-bootstrap';
import './QRCodeGenerator.css';

interface QRCodeGeneratorProps {
  show: boolean;
  onHide: () => void;
  ticketData: {
    ticketNumber: string;
    eventTitle: string;
    eventDate: string;
    eventTime: string;
    seatNumber?: string;
    price: number;
  };
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({
  show,
  onHide,
  ticketData
}) => {
  const qrValue = JSON.stringify({
    ticketNumber: ticketData.ticketNumber,
    eventTitle: ticketData.eventTitle,
    eventDate: ticketData.eventDate,
    eventTime: ticketData.eventTime,
    seatNumber: ticketData.seatNumber,
    price: ticketData.price,
    timestamp: new Date().toISOString()
  });

  const handleDownload = () => {
    const svg = document.getElementById('qr-code-svg');
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        const link = document.createElement('a');
        link.download = `ticket-${ticketData.ticketNumber}.png`;
        link.href = canvas.toDataURL();
        link.click();
      };
      
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="fas fa-qrcode me-2"></i>
          Bilet QR Kodu
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="qr-ticket-container">
          <Card className="qr-ticket-card">
            <Card.Body className="text-center">
              <div className="qr-code-wrapper">
                <QRCode
                  id="qr-code-svg"
                  value={qrValue}
                  size={200}
                  level="M"
                  includeMargin={true}
                />
              </div>
              
              <div className="ticket-info mt-3">
                <h5 className="ticket-title">{ticketData.eventTitle}</h5>
                <p className="ticket-details">
                  <i className="fas fa-calendar me-2"></i>
                  {new Date(ticketData.eventDate).toLocaleDateString('tr-TR')}
                </p>
                <p className="ticket-details">
                  <i className="fas fa-clock me-2"></i>
                  {ticketData.eventTime}
                </p>
                {ticketData.seatNumber && (
                  <p className="ticket-details">
                    <i className="fas fa-chair me-2"></i>
                    Koltuk: {ticketData.seatNumber}
                  </p>
                )}
                <p className="ticket-number">
                  <strong>Bilet No: {ticketData.ticketNumber}</strong>
                </p>
                <p className="ticket-price">
                  <i className="fas fa-lira-sign me-1"></i>
                  {ticketData.price.toFixed(2)}
                </p>
              </div>
            </Card.Body>
          </Card>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Kapat
        </Button>
        <Button variant="primary" onClick={handleDownload}>
          <i className="fas fa-download me-2"></i>
          QR Kodu İndir
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default QRCodeGenerator;
