import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge } from 'react-bootstrap';
// Chart.js imports with error handling
let Line: any, Doughnut: any;
let ChartJS: any, CategoryScale: any, LinearScale: any, PointElement: any, LineElement: any, BarElement: any, Title: any, Tooltip: any, Legend: any, ArcElement: any;

try {
  const chartComponents = require('react-chartjs-2');
  Line = chartComponents.Line;
  Doughnut = chartComponents.Doughnut;
  
  const chartJS = require('chart.js');
  ChartJS = chartJS.Chart;
  CategoryScale = chartJS.CategoryScale;
  LinearScale = chartJS.LinearScale;
  PointElement = chartJS.PointElement;
  LineElement = chartJS.LineElement;
  BarElement = chartJS.BarElement;
  Title = chartJS.Title;
  Tooltip = chartJS.Tooltip;
  Legend = chartJS.Legend;
  ArcElement = chartJS.ArcElement;
} catch (error) {
  console.warn('Chart.js not available:', error);
}
import axios from 'axios';
import './AdminDashboard.css';

// Chart.js kayıt
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface DashboardStats {
  overview: {
    total_events: number;
    active_events: number;
    total_tickets_sold: number;
    total_revenue: number;
  };
  recent_stats: {
    events_last_30_days: number;
    tickets_last_30_days: number;
    revenue_last_30_days: number;
  };
  category_stats: Array<{
    name: string;
    event_count: number;
    ticket_count: number;
  }>;
  popular_events: Array<any>;
  monthly_revenue: Array<{
    month: string;
    revenue: number;
  }>;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [, setShowEventModal] = useState(false);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/admin/stats/', {
        headers: {
          'Authorization': `Token ${token}`
        }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
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

  // Grafik verileri
  const revenueChartData = {
    labels: stats?.monthly_revenue.map(item => item.month) || [],
    datasets: [
      {
        label: 'Aylık Gelir',
        data: stats?.monthly_revenue.map(item => item.revenue) || [],
        borderColor: 'rgb(102, 126, 234)',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const categoryChartData = {
    labels: stats?.category_stats.map(item => item.name) || [],
    datasets: [
      {
        data: stats?.category_stats.map(item => item.event_count) || [],
        backgroundColor: [
          '#667eea',
          '#764ba2',
          '#f093fb',
          '#f5576c',
          '#4facfe',
        ],
      },
    ],
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Yükleniyor...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <Container fluid>
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <div className="admin-header">
              <h1>Admin Dashboard</h1>
              <p>Etkinlik yönetim sistemi</p>
            </div>
          </Col>
        </Row>

        {/* Navigation Tabs */}
        <Row className="mb-4">
          <Col>
            <div className="admin-tabs">
              <Button
                variant={activeTab === 'overview' ? 'primary' : 'outline-primary'}
                onClick={() => setActiveTab('overview')}
                className="me-2"
              >
                Genel Bakış
              </Button>
              <Button
                variant={activeTab === 'events' ? 'primary' : 'outline-primary'}
                onClick={() => setActiveTab('events')}
                className="me-2"
              >
                Etkinlikler
              </Button>
              <Button
                variant={activeTab === 'users' ? 'primary' : 'outline-primary'}
                onClick={() => setActiveTab('users')}
                className="me-2"
              >
                Kullanıcılar
              </Button>
              <Button
                variant={activeTab === 'tickets' ? 'primary' : 'outline-primary'}
                onClick={() => setActiveTab('tickets')}
              >
                Biletler
              </Button>
            </div>
          </Col>
        </Row>

        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <>
            {/* Stats Cards */}
            <Row className="mb-4">
              <Col md={3}>
                <Card className="stats-card">
                  <Card.Body>
                    <div className="stats-icon events">
                      <i className="fas fa-calendar-alt"></i>
                    </div>
                    <h3>{stats.overview.total_events}</h3>
                    <p>Toplam Etkinlik</p>
                    <small className="text-success">
                      +{stats.recent_stats.events_last_30_days} son 30 gün
                    </small>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="stats-card">
                  <Card.Body>
                    <div className="stats-icon tickets">
                      <i className="fas fa-ticket-alt"></i>
                    </div>
                    <h3>{stats.overview.total_tickets_sold}</h3>
                    <p>Satılan Bilet</p>
                    <small className="text-success">
                      +{stats.recent_stats.tickets_last_30_days} son 30 gün
                    </small>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="stats-card">
                  <Card.Body>
                    <div className="stats-icon revenue">
                      <i className="fas fa-lira-sign"></i>
                    </div>
                    <h3>{formatPrice(stats.overview.total_revenue)}</h3>
                    <p>Toplam Gelir</p>
                    <small className="text-success">
                      +{formatPrice(stats.recent_stats.revenue_last_30_days)} son 30 gün
                    </small>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="stats-card">
                  <Card.Body>
                    <div className="stats-icon active">
                      <i className="fas fa-check-circle"></i>
                    </div>
                    <h3>{stats.overview.active_events}</h3>
                    <p>Aktif Etkinlik</p>
                    <small className="text-info">
                      {((stats.overview.active_events / stats.overview.total_events) * 100).toFixed(1)}% oran
                    </small>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Charts */}
            <Row className="mb-4">
              <Col md={8}>
                <Card>
                  <Card.Header>
                    <h5>Aylık Gelir Grafiği</h5>
                  </Card.Header>
                  <Card.Body>
                    <Line data={revenueChartData} options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: 'top',
                        },
                        title: {
                          display: true,
                          text: 'Son 12 Ay Gelir Trendi'
                        }
                      }
                    }} />
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card>
                  <Card.Header>
                    <h5>Kategori Dağılımı</h5>
                  </Card.Header>
                  <Card.Body>
                    <Doughnut data={categoryChartData} options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: 'bottom',
                        }
                      }
                    }} />
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Popular Events */}
            <Row>
              <Col>
                <Card>
                  <Card.Header>
                    <h5>En Popüler Etkinlikler</h5>
                  </Card.Header>
                  <Card.Body>
                    <Table responsive>
                      <thead>
                        <tr>
                          <th>Etkinlik</th>
                          <th>Kategori</th>
                          <th>Satılan Bilet</th>
                          <th>Gelir</th>
                          <th>Tarih</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.popular_events.map((event, index) => (
                          <tr key={index}>
                            <td>
                              <strong>{event.title}</strong>
                              <br />
                              <small className="text-muted">{event.location}</small>
                            </td>
                            <td>
                              <Badge bg="primary">{event.category?.name}</Badge>
                            </td>
                            <td>{event.ticket_count || 0}</td>
                            <td>{formatPrice((event.ticket_count || 0) * event.price)}</td>
                            <td>{formatDate(event.date)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <Row>
            <Col>
              <Card>
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <h5>Etkinlik Yönetimi</h5>
                  <Button variant="primary" onClick={() => setShowEventModal(true)}>
                    <i className="fas fa-plus me-2"></i>
                    Yeni Etkinlik
                  </Button>
                </Card.Header>
                <Card.Body>
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>Etkinlik</th>
                        <th>Kategori</th>
                        <th>Tarih</th>
                        <th>Fiyat</th>
                        <th>Durum</th>
                        <th>İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colSpan={6} className="text-center text-muted">
                          Etkinlik verileri yükleniyor...
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <Row>
            <Col>
              <Card>
                <Card.Header>
                  <h5>Kullanıcı Yönetimi</h5>
                </Card.Header>
                <Card.Body>
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>Kullanıcı</th>
                        <th>E-posta</th>
                        <th>Kayıt Tarihi</th>
                        <th>Bilet Sayısı</th>
                        <th>Toplam Harcama</th>
                        <th>Durum</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colSpan={6} className="text-center text-muted">
                          Kullanıcı verileri yükleniyor...
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        {/* Tickets Tab */}
        {activeTab === 'tickets' && (
          <Row>
            <Col>
              <Card>
                <Card.Header>
                  <h5>Bilet Yönetimi</h5>
                </Card.Header>
                <Card.Body>
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>Bilet No</th>
                        <th>Etkinlik</th>
                        <th>Kullanıcı</th>
                        <th>Miktar</th>
                        <th>Tutar</th>
                        <th>Durum</th>
                        <th>Satın Alma Tarihi</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colSpan={7} className="text-center text-muted">
                          Bilet verileri yükleniyor...
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};

export default AdminDashboard;
