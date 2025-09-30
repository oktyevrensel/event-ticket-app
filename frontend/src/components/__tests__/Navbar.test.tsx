import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CustomNavbar from '../Navbar';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('CustomNavbar', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
  });

  test('renders navbar with brand name', () => {
    renderWithRouter(<CustomNavbar />);
    expect(screen.getByText('EventTicket')).toBeInTheDocument();
  });

  test('renders navigation links', () => {
    renderWithRouter(<CustomNavbar />);
    expect(screen.getByText('Etkinlikler')).toBeInTheDocument();
    expect(screen.getByText('Kategoriler')).toBeInTheDocument();
  });

  test('renders search input', () => {
    renderWithRouter(<CustomNavbar />);
    const searchInput = screen.getByPlaceholderText(/binlerce etkinlik ve mekan arasında aradığınızı bulun/i);
    expect(searchInput).toBeInTheDocument();
  });

  test('renders login and register buttons when user is not logged in', () => {
    localStorageMock.getItem.mockReturnValue(null);
    renderWithRouter(<CustomNavbar />);
    expect(screen.getByText('Giriş Yap')).toBeInTheDocument();
    expect(screen.getByText('Kayıt Ol')).toBeInTheDocument();
  });

  test('renders user dropdown when user is logged in', () => {
    const mockUser = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      first_name: 'Test',
      last_name: 'User'
    };
    
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockUser));
    renderWithRouter(<CustomNavbar />);
    
    expect(screen.getByRole('button', { name: /user/i })).toBeInTheDocument();
  });

  test('search input has correct placeholder', () => {
    renderWithRouter(<CustomNavbar />);
    const searchInput = screen.getByPlaceholderText(/binlerce etkinlik ve mekan arasında aradığınızı bulun/i);
    expect(searchInput).toHaveAttribute('placeholder', 'Binlerce etkinlik ve mekan arasında aradığınızı bulun...');
  });

  test('language selector is present', () => {
    renderWithRouter(<CustomNavbar />);
    const languageIcon = screen.getByRole('button', { name: /language/i });
    expect(languageIcon).toBeInTheDocument();
  });
});
