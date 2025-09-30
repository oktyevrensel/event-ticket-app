import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Register.css';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    password_confirm: ''
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

    if (formData.password !== formData.password_confirm) {
      setError('Şifreler eşleşmiyor.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/auth/register/', {
        username: formData.username,
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        password: formData.password,
        password_confirm: formData.password_confirm
      });
      
      if (response.data.user) {
        localStorage.setItem('token', response.data.token || '');
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate('/');
      }
    } catch (error: any) {
      setError(error.response?.data?.error || 'Kayıt olurken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    // Sosyal medya girişi simülasyonu
    alert(`${provider} ile kayıt özelliği yakında eklenecek!`);
  };

  return (
    <div className="register-page">
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <Card className="register-card">
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <h2 className="register-title">Hesap Oluştur</h2>
                </div>

                {error && (
                  <Alert variant="danger" className="mb-3">
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Ad</Form.Label>
                        <Form.Control
                          type="text"
                          name="first_name"
                          value={formData.first_name}
                          onChange={handleChange}
                          placeholder="Adınız"
                          required
                          className="form-control-custom"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Soyad</Form.Label>
                        <Form.Control
                          type="text"
                          name="last_name"
                          value={formData.last_name}
                          onChange={handleChange}
                          placeholder="Soyadınız"
                          required
                          className="form-control-custom"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Kullanıcı Adı</Form.Label>
                    <Form.Control
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Kullanıcı adınız"
                      required
                      className="form-control-custom"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>E-Posta</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="E-posta adresiniz"
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
                        placeholder="Şifreniz"
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

                  <Form.Group className="mb-3">
                    <Form.Label>Şifre Tekrar</Form.Label>
                    <div className="password-input-wrapper">
                      <Form.Control
                        type="password"
                        name="password_confirm"
                        value={formData.password_confirm}
                        onChange={handleChange}
                        placeholder="Şifrenizi tekrar girin"
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

                  <Button
                    type="submit"
                    variant="success"
                    size="lg"
                    className="w-100 register-btn"
                    disabled={loading}
                  >
                    {loading ? 'Hesap oluşturuluyor...' : 'Hesap Oluştur'}
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
                    Google ile Kayıt Ol
                  </Button>

                  <Button
                    variant="outline-dark"
                    size="lg"
                    className="w-100 social-btn apple-btn mt-2"
                    onClick={() => handleSocialLogin('Apple')}
                  >
                    <i className="fab fa-apple me-2"></i>
                    Apple ile Kayıt Ol
                  </Button>
                </div>

                <div className="text-center mt-4">
                  <span className="text-muted">Zaten hesabınız var mı? </span>
                  <Link to="/login" className="login-link">
                    Giriş Yap
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

export default Register;