# 🎫 Event Ticket Management System | Etkinlik Bilet Yönetim Sistemi

A comprehensive, production-ready event ticket management system built with Django REST Framework and React TypeScript.

Django REST Framework ve React TypeScript ile geliştirilmiş, kapsamlı ve üretim hazır etkinlik bilet yönetim sistemi.

---

## 🚀 Features | Özellikler

### 🎯 Core Features | Temel Özellikler

#### English
- **Event Management**: Create, update, and manage events with categories
- **Ticket Sales**: Secure ticket purchasing with real-time availability
- **User Authentication**: JWT-based authentication with social login support (Google, Apple)
- **Admin Dashboard**: Comprehensive analytics and management interface
- **Real-time Updates**: WebSocket-powered live ticket count updates
- **Payment Integration**: Stripe payment processing with saved payment methods
- **QR Code Tickets**: Generate and scan QR codes for ticket validation
- **Seat Selection**: Interactive seat selection for events
- **Event Recommendations**: AI-powered event recommendations
- **Responsive Design**: Mobile-first, modern UI/UX with Bootstrap 5

#### Türkçe
- **Etkinlik Yönetimi**: Kategorilerle etkinlik oluşturma, güncelleme ve yönetimi
- **Bilet Satışı**: Gerçek zamanlı müsaitlik ile güvenli bilet satın alma
- **Kullanıcı Kimlik Doğrulama**: Sosyal giriş desteği (Google, Apple) ile JWT tabanlı kimlik doğrulama
- **Admin Paneli**: Kapsamlı analitik ve yönetim arayüzü
- **Gerçek Zamanlı Güncellemeler**: WebSocket destekli canlı bilet sayısı güncellemeleri
- **Ödeme Entegrasyonu**: Kayıtlı ödeme yöntemleri ile Stripe ödeme işleme
- **QR Kod Biletler**: Bilet doğrulama için QR kod oluşturma ve tarama
- **Koltuk Seçimi**: Etkinlikler için interaktif koltuk seçimi
- **Etkinlik Önerileri**: AI destekli etkinlik önerileri
- **Duyarlı Tasarım**: Bootstrap 5 ile mobil öncelikli, modern UI/UX

### 🛠 Technical Features | Teknik Özellikler

#### English
- **Backend**: Django REST Framework with PostgreSQL
- **Frontend**: React 18 with TypeScript
- **Real-time**: WebSocket with Django Channels and Redis
- **Payments**: Stripe integration with webhooks
- **Testing**: Comprehensive test suite (Unit, Integration, E2E with Cypress)
- **Deployment**: Docker containerization with CI/CD
- **Documentation**: Auto-generated API documentation with Swagger/OpenAPI
- **Performance**: Redis caching, lazy loading, code splitting
- **Security**: JWT authentication, CORS protection, rate limiting
- **Monitoring**: Performance monitoring and web vitals

#### Türkçe
- **Backend**: PostgreSQL ile Django REST Framework
- **Frontend**: TypeScript ile React 18
- **Gerçek Zamanlı**: Redis ile Django Channels ve WebSocket
- **Ödemeler**: Webhook'lar ile Stripe entegrasyonu
- **Test**: Kapsamlı test paketi (Unit, Integration, Cypress ile E2E)
- **Deployment**: CI/CD ile Docker containerization
- **Dokümantasyon**: Swagger/OpenAPI ile otomatik API dokümantasyonu
- **Performans**: Redis önbellekleme, lazy loading, kod bölme
- **Güvenlik**: JWT kimlik doğrulama, CORS koruması, hız sınırlama
- **İzleme**: Performans izleme ve web vitals

---

## 📋 Prerequisites | Ön Gereksinimler

### English
- Python 3.11+
- Node.js 18+
- PostgreSQL 15+
- Redis 7+
- Docker & Docker Compose (optional)

### Türkçe
- Python 3.11+
- Node.js 18+
- PostgreSQL 15+
- Redis 7+
- Docker & Docker Compose (isteğe bağlı)

---

## 🚀 Quick Start | Hızlı Başlangıç

### Option 1: Docker (Recommended) | Seçenek 1: Docker (Önerilen)

#### English
```bash
# Clone the repository
git clone <repository-url>
cd event-ticket-app

# Start all services
docker-compose up -d

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# Admin Panel: http://localhost:8000/admin
# API Docs: http://localhost:8000/api/docs/
```

#### Türkçe
```bash
# Depoyu klonlayın
git clone <repository-url>
cd event-ticket-app

# Tüm servisleri başlatın
docker-compose up -d

# Uygulamaya erişin
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# Admin Paneli: http://localhost:8000/admin
# API Dokümantasyonu: http://localhost:8000/api/docs/
```

### Option 2: Local Development | Seçenek 2: Yerel Geliştirme

#### Backend Setup | Backend Kurulumu

##### English
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup database
python manage.py migrate
python manage.py createsuperuser
python manage.py create_sample_data

# Start development server
python manage.py runserver
```

##### Türkçe
```bash
cd backend

# Sanal ortam oluşturun
python -m venv venv
source venv/bin/activate  # Windows'ta: venv\Scripts\activate

# Bağımlılıkları yükleyin
pip install -r requirements.txt

# Veritabanını ayarlayın
python manage.py migrate
python manage.py createsuperuser
python manage.py create_sample_data

# Geliştirme sunucusunu başlatın
python manage.py runserver
```

#### Frontend Setup | Frontend Kurulumu

##### English
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

##### Türkçe
```bash
cd frontend

# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm start
```

---

## 🏗 Architecture | Mimari

### Backend (Django) | Backend (Django)

#### English
```
backend/
├── events/                 # Event management app
│   ├── models.py          # Event, Ticket, Category models
│   ├── views.py           # API viewsets
│   ├── serializers.py     # Data serialization
│   ├── admin_views.py     # Admin dashboard APIs
│   ├── payment_views.py   # Stripe integration
│   ├── consumers.py       # WebSocket consumers
│   ├── recommendations.py # AI recommendations
│   └── test_*.py          # Test suites
├── accounts/              # User management
│   ├── models.py          # User model extensions
│   ├── views.py           # Authentication views
│   ├── serializers.py     # User serializers
│   └── social_auth.py     # Social login
├── backend/               # Django settings
│   ├── settings.py        # Main settings
│   ├── urls.py           # URL routing
│   └── asgi.py           # ASGI configuration
└── requirements.txt       # Python dependencies
```

#### Türkçe
```
backend/
├── events/                 # Etkinlik yönetimi uygulaması
│   ├── models.py          # Event, Ticket, Category modelleri
│   ├── views.py           # API viewsets
│   ├── serializers.py     # Veri serileştirme
│   ├── admin_views.py     # Admin paneli API'leri
│   ├── payment_views.py   # Stripe entegrasyonu
│   ├── consumers.py       # WebSocket consumers
│   ├── recommendations.py # AI önerileri
│   └── test_*.py          # Test paketleri
├── accounts/              # Kullanıcı yönetimi
│   ├── models.py          # Kullanıcı model uzantıları
│   ├── views.py           # Kimlik doğrulama görünümleri
│   ├── serializers.py     # Kullanıcı serileştiricileri
│   └── social_auth.py     # Sosyal giriş
├── backend/               # Django ayarları
│   ├── settings.py        # Ana ayarlar
│   ├── urls.py           # URL yönlendirme
│   └── asgi.py           # ASGI yapılandırması
└── requirements.txt       # Python bağımlılıkları
```

### Frontend (React TypeScript) | Frontend (React TypeScript)

#### English
```
frontend/
├── src/
│   ├── components/        # Reusable components
│   │   ├── Navbar.tsx    # Navigation component
│   │   ├── QRCode.tsx    # QR code generator
│   │   ├── SeatSelector.tsx # Seat selection
│   │   ├── StripePayment.tsx # Payment integration
│   │   └── LazyWrapper.tsx # Lazy loading wrapper
│   ├── pages/            # Page components
│   │   ├── Home.tsx      # Homepage
│   │   ├── Events.tsx    # Events listing
│   │   ├── EventDetail.tsx # Event details
│   │   ├── AdminDashboard.tsx # Admin panel
│   │   └── Profile.tsx   # User profile
│   ├── hooks/            # Custom React hooks
│   │   ├── useAuth.ts    # Authentication hook
│   │   ├── useCache.ts   # Caching hook
│   │   └── usePerformance.ts # Performance monitoring
│   ├── services/         # API services
│   │   ├── api.ts        # API client
│   │   ├── authService.ts # Authentication service
│   │   └── eventService.ts # Event service
│   └── types/            # TypeScript definitions
├── cypress/              # E2E tests
├── public/               # Static assets
└── package.json          # Dependencies
```

#### Türkçe
```
frontend/
├── src/
│   ├── components/        # Yeniden kullanılabilir bileşenler
│   │   ├── Navbar.tsx    # Navigasyon bileşeni
│   │   ├── QRCode.tsx    # QR kod üretici
│   │   ├── SeatSelector.tsx # Koltuk seçimi
│   │   ├── StripePayment.tsx # Ödeme entegrasyonu
│   │   └── LazyWrapper.tsx # Lazy loading sarmalayıcı
│   ├── pages/            # Sayfa bileşenleri
│   │   ├── Home.tsx      # Ana sayfa
│   │   ├── Events.tsx    # Etkinlik listesi
│   │   ├── EventDetail.tsx # Etkinlik detayları
│   │   ├── AdminDashboard.tsx # Admin paneli
│   │   └── Profile.tsx   # Kullanıcı profili
│   ├── hooks/            # Özel React hook'ları
│   │   ├── useAuth.ts    # Kimlik doğrulama hook'u
│   │   ├── useCache.ts   # Önbellekleme hook'u
│   │   └── usePerformance.ts # Performans izleme
│   ├── services/         # API servisleri
│   │   ├── api.ts        # API istemcisi
│   │   ├── authService.ts # Kimlik doğrulama servisi
│   │   └── eventService.ts # Etkinlik servisi
│   └── types/            # TypeScript tanımları
├── cypress/              # E2E testleri
├── public/               # Statik varlıklar
└── package.json          # Bağımlılıklar
```

---

## 🔧 API Endpoints | API Uç Noktaları

### Authentication | Kimlik Doğrulama

#### English
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout
- `GET /api/auth/profile/` - User profile
- `POST /api/auth/social-login/` - Social login (Google/Apple)

#### Türkçe
- `POST /api/auth/register/` - Kullanıcı kaydı
- `POST /api/auth/login/` - Kullanıcı girişi
- `POST /api/auth/logout/` - Kullanıcı çıkışı
- `GET /api/auth/profile/` - Kullanıcı profili
- `POST /api/auth/social-login/` - Sosyal giriş (Google/Apple)

### Events | Etkinlikler

#### English
- `GET /api/` - List events
- `GET /api/{id}/` - Event details
- `GET /api/search/` - Search events
- `GET /api/categories/` - List categories
- `GET /api/recommendations/` - Get event recommendations

#### Türkçe
- `GET /api/` - Etkinlikleri listele
- `GET /api/{id}/` - Etkinlik detayları
- `GET /api/search/` - Etkinlik ara
- `GET /api/categories/` - Kategorileri listele
- `GET /api/recommendations/` - Etkinlik önerilerini al

### Tickets | Biletler

#### English
- `GET /api/tickets/` - User's tickets
- `POST /api/tickets/` - Purchase ticket
- `POST /api/tickets/{id}/cancel/` - Cancel ticket
- `POST /api/tickets/{id}/mark-used/` - Mark ticket as used
- `GET /api/tickets/{id}/qr/` - Get ticket QR code

#### Türkçe
- `GET /api/tickets/` - Kullanıcının biletleri
- `POST /api/tickets/` - Bilet satın al
- `POST /api/tickets/{id}/cancel/` - Bileti iptal et
- `POST /api/tickets/{id}/mark-used/` - Bileti kullanıldı olarak işaretle
- `GET /api/tickets/{id}/qr/` - Bilet QR kodunu al

### Payments | Ödemeler

#### English
- `POST /api/payment/create-intent/` - Create payment intent
- `POST /api/payment/confirm/` - Confirm payment
- `GET /api/payment/methods/` - Get saved payment methods
- `POST /api/payment/setup-intent/` - Create setup intent for saving cards

#### Türkçe
- `POST /api/payment/create-intent/` - Ödeme niyeti oluştur
- `POST /api/payment/confirm/` - Ödemeyi onayla
- `GET /api/payment/methods/` - Kayıtlı ödeme yöntemlerini al
- `POST /api/payment/setup-intent/` - Kart kaydetme için setup intent oluştur

### Admin | Admin

#### English
- `GET /api/admin/stats/` - Dashboard statistics
- `GET /api/admin/events-management/` - Events management
- `GET /api/admin/users-management/` - Users management
- `GET /api/admin/tickets-management/` - Tickets management
- `GET /api/admin/revenue-analytics/` - Revenue analytics

#### Türkçe
- `GET /api/admin/stats/` - Panel istatistikleri
- `GET /api/admin/events-management/` - Etkinlik yönetimi
- `GET /api/admin/users-management/` - Kullanıcı yönetimi
- `GET /api/admin/tickets-management/` - Bilet yönetimi
- `GET /api/admin/revenue-analytics/` - Gelir analitiği

---

## 🧪 Testing | Test

### Backend Tests | Backend Testleri

#### English
```bash
cd backend
python manage.py test
```

#### Türkçe
```bash
cd backend
python manage.py test
```

### Frontend Tests | Frontend Testleri

#### English
```bash
cd frontend
npm test
```

#### Türkçe
```bash
cd frontend
npm test
```

### E2E Tests | E2E Testleri

#### English
```bash
cd frontend
npm run cypress:open
```

#### Türkçe
```bash
cd frontend
npm run cypress:open
```

---

## 📊 Admin Dashboard | Admin Paneli

#### English
Access the admin dashboard at `/admin` with comprehensive features:

- **Analytics**: Real-time statistics and charts
- **Event Management**: Create, edit, and manage events
- **User Management**: View and manage user accounts
- **Ticket Management**: Monitor ticket sales and cancellations
- **Revenue Tracking**: Financial analytics and reporting
- **QR Code Management**: Generate and manage QR codes
- **Seat Management**: Configure seat layouts and availability

#### Türkçe
`/admin` adresinden kapsamlı özelliklerle admin paneline erişin:

- **Analitik**: Gerçek zamanlı istatistikler ve grafikler
- **Etkinlik Yönetimi**: Etkinlik oluşturma, düzenleme ve yönetimi
- **Kullanıcı Yönetimi**: Kullanıcı hesaplarını görüntüleme ve yönetimi
- **Bilet Yönetimi**: Bilet satışlarını ve iptalleri izleme
- **Gelir Takibi**: Finansal analitik ve raporlama
- **QR Kod Yönetimi**: QR kod oluşturma ve yönetimi
- **Koltuk Yönetimi**: Koltuk düzenlerini ve müsaitliği yapılandırma

---

## 🔒 Security Features | Güvenlik Özellikleri

#### English
- JWT token authentication
- CORS protection
- Rate limiting
- Input validation and sanitization
- SQL injection protection
- XSS protection
- CSRF protection
- Secure password hashing
- Social login security
- Payment security with Stripe

#### Türkçe
- JWT token kimlik doğrulama
- CORS koruması
- Hız sınırlama
- Giriş doğrulama ve temizleme
- SQL injection koruması
- XSS koruması
- CSRF koruması
- Güvenli şifre hashleme
- Sosyal giriş güvenliği
- Stripe ile ödeme güvenliği

---

## 🚀 Deployment | Deployment

### Production Deployment | Üretim Deployment'ı

#### English
1. **Environment Variables**:
```bash
export SECRET_KEY="your-secret-key"
export DATABASE_URL="postgresql://user:pass@host:port/db"
export REDIS_URL="redis://host:port/0"
export STRIPE_SECRET_KEY="sk_live_..."
export STRIPE_PUBLISHABLE_KEY="pk_live_..."
export STRIPE_WEBHOOK_SECRET="whsec_..."
```

2. **Docker Production**:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

3. **Manual Deployment**:
```bash
# Backend
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic
gunicorn backend.wsgi:application

# Frontend
npm run build
serve -s build
```

#### Türkçe
1. **Ortam Değişkenleri**:
```bash
export SECRET_KEY="your-secret-key"
export DATABASE_URL="postgresql://user:pass@host:port/db"
export REDIS_URL="redis://host:port/0"
export STRIPE_SECRET_KEY="sk_live_..."
export STRIPE_PUBLISHABLE_KEY="pk_live_..."
export STRIPE_WEBHOOK_SECRET="whsec_..."
```

2. **Docker Üretim**:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

3. **Manuel Deployment**:
```bash
# Backend
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic
gunicorn backend.wsgi:application

# Frontend
npm run build
serve -s build
```

---

## 📈 Performance Optimizations | Performans Optimizasyonları

#### English
- Database query optimization with select_related and prefetch_related
- Redis caching for frequently accessed data
- CDN for static files and images
- Image optimization and lazy loading
- Code splitting and dynamic imports
- Component lazy loading with React.lazy
- WebSocket connection pooling
- API response compression
- Database indexing
- Memory usage optimization

#### Türkçe
- select_related ve prefetch_related ile veritabanı sorgu optimizasyonu
- Sık erişilen veriler için Redis önbellekleme
- Statik dosyalar ve görseller için CDN
- Görsel optimizasyonu ve lazy loading
- Kod bölme ve dinamik import'lar
- React.lazy ile bileşen lazy loading
- WebSocket bağlantı havuzlama
- API yanıt sıkıştırma
- Veritabanı indeksleme
- Bellek kullanım optimizasyonu

---

## 🔧 Development Tools | Geliştirme Araçları

#### English
- **Linting**: ESLint, Prettier
- **Type Checking**: TypeScript
- **Testing**: Jest, Cypress, Django TestCase
- **API Documentation**: Swagger/OpenAPI with DRF Spectacular
- **CI/CD**: GitHub Actions
- **Containerization**: Docker, Docker Compose
- **Code Quality**: SonarQube integration
- **Performance Monitoring**: Web Vitals, Custom metrics

#### Türkçe
- **Linting**: ESLint, Prettier
- **Tip Kontrolü**: TypeScript
- **Test**: Jest, Cypress, Django TestCase
- **API Dokümantasyonu**: DRF Spectacular ile Swagger/OpenAPI
- **CI/CD**: GitHub Actions
- **Containerization**: Docker, Docker Compose
- **Kod Kalitesi**: SonarQube entegrasyonu
- **Performans İzleme**: Web Vitals, Özel metrikler

---

## 📚 API Documentation | API Dokümantasyonu

#### English
- **Swagger UI**: http://localhost:8000/api/docs/
- **ReDoc**: http://localhost:8000/api/redoc/
- **OpenAPI Schema**: http://localhost:8000/api/schema/

#### Türkçe
- **Swagger UI**: http://localhost:8000/api/docs/
- **ReDoc**: http://localhost:8000/api/redoc/
- **OpenAPI Schema**: http://localhost:8000/api/schema/

---

## 🤝 Contributing | Katkıda Bulunma

#### English
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for your changes
5. Run the test suite (`npm test` and `python manage.py test`)
6. Commit your changes (`git commit -m 'Add some amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

#### Türkçe
1. Depoyu fork edin
2. Bir özellik dalı oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi yapın
4. Değişiklikleriniz için testler ekleyin
5. Test paketini çalıştırın (`npm test` ve `python manage.py test`)
6. Değişikliklerinizi commit edin (`git commit -m 'Add some amazing feature'`)
7. Dala push edin (`git push origin feature/amazing-feature`)
8. Bir Pull Request açın

---

## 📄 License | Lisans

#### English
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

#### Türkçe
Bu proje MIT Lisansı altında lisanslanmıştır - detaylar için [LICENSE](LICENSE) dosyasına bakın.

---

#### English
This project demonstrates:

- **Full-Stack Development**: Complete Django + React application with TypeScript
- **Modern Architecture**: Microservices, REST APIs, WebSockets, Real-time features
- **Production Readiness**: Docker, CI/CD, comprehensive testing, monitoring
- **Security**: JWT authentication, social login, payment security, data protection
- **Performance**: Redis caching, lazy loading, code splitting, optimization
- **Code Quality**: TypeScript, ESLint, comprehensive testing, documentation
- **DevOps**: Containerization, deployment automation, monitoring
- **Advanced Features**: QR codes, seat selection, AI recommendations, real-time updates
- **Payment Integration**: Stripe with webhooks, saved payment methods
- **Admin Dashboard**: Analytics, management interfaces, real-time monitoring


#### Türkçe
Bu proje şunları gösterir:

- **Full-Stack Geliştirme**: TypeScript ile tam Django + React uygulaması
- **Modern Mimari**: Mikroservisler, REST API'ler, WebSocket'ler, Gerçek zamanlı özellikler
- **Üretim Hazırlığı**: Docker, CI/CD, kapsamlı test, izleme
- **Güvenlik**: JWT kimlik doğrulama, sosyal giriş, ödeme güvenliği, veri koruması
- **Performans**: Redis önbellekleme, lazy loading, kod bölme, optimizasyon
- **Kod Kalitesi**: TypeScript, ESLint, kapsamlı test, dokümantasyon
- **DevOps**: Containerization, deployment otomasyonu, izleme
- **Gelişmiş Özellikler**: QR kodlar, koltuk seçimi, AI önerileri, gerçek zamanlı güncellemeler
- **Ödeme Entegrasyonu**: Webhook'lar ile Stripe, kayıtlı ödeme yöntemleri
- **Admin Paneli**: Analitik, yönetim arayüzleri, gerçek zamanlı izleme



