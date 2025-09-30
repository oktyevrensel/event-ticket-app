describe('Event Ticket App User Flow', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  it('should display home page with hero section', () => {
    cy.contains('Etkinlik Biletlerinizi Güvenle Satın Alın').should('be.visible');
    cy.contains('Etkinlikleri Görüntüle').should('be.visible');
  });

  it('should navigate to events page', () => {
    cy.contains('Etkinlikler').click();
    cy.url().should('include', '/events');
    cy.contains('Tüm Etkinlikler').should('be.visible');
  });

  it('should navigate to login page', () => {
    cy.contains('Giriş Yap').click();
    cy.url().should('include', '/login');
    cy.contains('Giriş Yap').should('be.visible');
    cy.get('input[type="email"]').should('be.visible');
    cy.get('input[type="password"]').should('be.visible');
  });

  it('should navigate to register page', () => {
    cy.contains('Kayıt Ol').click();
    cy.url().should('include', '/register');
    cy.contains('Hesap Oluştur').should('be.visible');
  });

  it('should display social login buttons', () => {
    cy.contains('Giriş Yap').click();
    cy.contains('Google ile Giriş Yap').should('be.visible');
    cy.contains('Apple ile Giriş Yap').should('be.visible');
  });

  it('should have responsive navigation', () => {
    cy.viewport(768, 1024);
    cy.get('[data-testid="navbar-toggle"]').should('be.visible');
  });

  it('should search for events', () => {
    cy.get('input[placeholder*="aradığınızı bulun"]').type('test event');
    cy.get('input[placeholder*="aradığınızı bulun"]').should('have.value', 'test event');
  });
});

describe('Event Detail Flow', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/events/1');
  });

  it('should display event details', () => {
    cy.contains('Bilet Satın Al').should('be.visible');
  });

  it('should open ticket purchase modal', () => {
    cy.contains('Bilet Satın Al').click();
    cy.contains('Bilet Satın Al').should('be.visible'); // Modal title
  });
});

describe('Admin Dashboard Flow', () => {
  beforeEach(() => {
    // Mock admin user login
    cy.window().then((win) => {
      win.localStorage.setItem('token', 'mock-admin-token');
      win.localStorage.setItem('user', JSON.stringify({
        id: 1,
        username: 'admin',
        email: 'admin@example.com',
        is_staff: true
      }));
    });
    cy.visit('http://localhost:3000/admin');
  });

  it('should display admin dashboard', () => {
    cy.contains('Admin Dashboard').should('be.visible');
    cy.contains('Genel Bakış').should('be.visible');
  });

  it('should switch between admin tabs', () => {
    cy.contains('Etkinlikler').click();
    cy.contains('Etkinlik Yönetimi').should('be.visible');
    
    cy.contains('Kullanıcılar').click();
    cy.contains('Kullanıcı Yönetimi').should('be.visible');
    
    cy.contains('Biletler').click();
    cy.contains('Bilet Yönetimi').should('be.visible');
  });
});
