import React, { useState } from 'react';
import { Modal, Button, Form, Alert, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import './LoginModal.css';

interface LoginModalProps {
  show: boolean;
  onHide: () => void;
  onSuccess: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ show, onHide, onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
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

    try {
      if (isLogin) {
        // Giriş yap
        const response = await axios.post('http://localhost:8000/api/auth/login/', {
          username: formData.username,
          password: formData.password
        });
        
        if (response.data.user) {
          localStorage.setItem('token', response.data.token || '');
          localStorage.setItem('user', JSON.stringify(response.data.user));
          onSuccess();
          onHide();
        }
      } else {
        // Kayıt ol
        if (formData.password !== formData.password_confirm) {
          setError('Şifreler eşleşmiyor.');
          setLoading(false);
          return;
        }

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
          onSuccess();
          onHide();
        }
      }
    } catch (error: any) {
      setError(error.response?.data?.error || 'Bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    // Sosyal medya girişi simülasyonu
    alert(`${provider} ile giriş özelliği yakında eklenecek!`);
  };

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      first_name: '',
      last_name: '',
      password: '',
      password_confirm: ''
    });
    setError('');
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Sosyal Medya Girişi */}
        <div className="social-login mb-4">
          <div className="social-login-buttons">
            <Button
              variant="outline-dark"
              className="w-100 social-btn google-btn mb-2"
              onClick={() => handleSocialLogin('Google')}
            >
              <i className="fab fa-google me-2"></i>
              Google ile Giriş Yap
            </Button>
            <Button
              variant="outline-dark"
              className="w-100 social-btn apple-btn"
              onClick={() => handleSocialLogin('Apple')}
            >
              <i className="fab fa-apple me-2"></i>
              Apple ile Giriş Yap
            </Button>
          </div>
          <div className="divider">
            <span>VEYA</span>
          </div>
        </div>

        {error && (
          <Alert variant="danger" className="mb-3">
            {error}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          {!isLogin && (
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Ad</Form.Label>
                  <Form.Control
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required={!isLogin}
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
                    required={!isLogin}
                  />
                </Form.Group>
              </Col>
            </Row>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Kullanıcı Adı</Form.Label>
            <Form.Control
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {!isLogin && (
            <Form.Group className="mb-3">
              <Form.Label>E-posta</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required={!isLogin}
              />
            </Form.Group>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Şifre</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {!isLogin && (
            <Form.Group className="mb-3">
              <Form.Label>Şifre Tekrar</Form.Label>
              <Form.Control
                type="password"
                name="password_confirm"
                value={formData.password_confirm}
                onChange={handleChange}
                required={!isLogin}
              />
            </Form.Group>
          )}

          <Button
            type="submit"
            variant="primary"
            className="w-100"
            disabled={loading}
          >
            {loading ? 'İşleniyor...' : (isLogin ? 'Giriş Yap' : 'Kayıt Ol')}
          </Button>
        </Form>

        <div className="text-center mt-3">
          <Button variant="link" onClick={toggleMode}>
            {isLogin ? 'Hesabınız yok mu? Kayıt olun' : 'Zaten hesabınız var mı? Giriş yapın'}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default LoginModal;
