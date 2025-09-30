import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <Container>
        <Row>
          <Col md={4}>
            <h5 className="footer-title">🎫 EventTicket</h5>
            <p className="footer-text">
              En iyi etkinlikleri keşfedin ve biletlerinizi güvenle satın alın.
            </p>
          </Col>
          <Col md={4}>
            <h6 className="footer-subtitle">Hızlı Linkler</h6>
            <ul className="footer-links">
              <li><a href="/">Ana Sayfa</a></li>
              <li><a href="/events">Etkinlikler</a></li>
              <li><a href="/login">Giriş Yap</a></li>
              <li><a href="/register">Kayıt Ol</a></li>
            </ul>
          </Col>
          <Col md={4}>
            <h6 className="footer-subtitle">İletişim</h6>
            <div className="footer-contact">
              <p>📧 info@eventticket.com</p>
              <p>📞 +90 (212) 555 0123</p>
              <p>📍 İstanbul, Türkiye</p>
            </div>
          </Col>
        </Row>
        <hr className="footer-divider" />
        <Row>
          <Col>
            <p className="footer-copyright">
              © 2024 EventTicket. Tüm hakları saklıdır.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
