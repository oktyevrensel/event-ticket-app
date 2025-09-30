import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:8000/api/auth/login/', {
        username: formData.email,
        password: formData.password
      });
      
      if (response.data.user) {
        localStorage.setItem('token', response.data.token || '');
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate('/');
      }
    } catch (error: any) {
      setError(error.response?.data?.error || 'Giriş yapılırken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    // Sosyal medya girişi simülasyonu
    alert(`${provider} ile giriş özelliği yakında eklenecek!`);
  };

  return (
    <div className="login-page">
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <Card className="login-card">
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <h2 className="login-title">Giriş Yap</h2>
                </div>

                {error && (
                  <Alert variant="danger" className="mb-3">
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>E-Posta</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="E-posta adresinizi girin"
                      required
                      className="form-control-custom"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Şifre</Form.Label>
                    <div className="password-input-wrapper">
                      <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Şifrenizi girin"
                        required
                        className="form-control-custom"
                      />
                      <Button
                        variant="link"
                        className="password-toggle"
                        type="button"
                      >
                        <i className="fas fa-eye"></i>
                      </Button>
                    </div>
                  </Form.Group>

                  <div className="text-end mb-3">
                    <Link to="/forgot-password" className="forgot-password-link">
                      Şifremi unuttum
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    variant="success"
                    size="lg"
                    className="w-100 login-btn"
                    disabled={loading}
                  >
                    {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
                  </Button>
                </Form>

                <div className="divider">
                  <span>VEYA</span>
                </div>

                <div className="social-login">
                  <Button
                    variant="outline-dark"
                    size="lg"
                    className="w-100 social-btn google-btn"
                    onClick={() => handleSocialLogin('Google')}
                  >
                    <i className="fab fa-google me-2"></i>
                    Google ile Giriş Yap
                  </Button>

                  <Button
                    variant="outline-dark"
                    size="lg"
                    className="w-100 social-btn apple-btn mt-2"
                    onClick={() => handleSocialLogin('Apple')}
                  >
                    <i className="fab fa-apple me-2"></i>
                    Apple ile Giriş Yap
                  </Button>
                </div>

                <div className="text-center mt-4">
                  <span className="text-muted">Hesabınız yok mu? </span>
                  <Link to="/register" className="register-link">
                    Hesap Oluştur
                  </Link>
                </div>

                <div className="success-message mt-3">
                  <i className="fas fa-check-circle text-success me-2"></i>
                  <span className="text-success">Başarılı!</span>
                </div>

                <div className="privacy-terms mt-2">
                  <small className="text-muted">
                    <i className="fas fa-shield-alt me-1"></i>
                    Gizlilik • Koşullar
                  </small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;