import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from '../Home';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

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

describe('Home Component', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    mockedAxios.get.mockClear();
  });

  test('renders hero section', () => {
    renderWithRouter(<Home />);
    expect(screen.getByText(/etkinlik biletlerinizi güvenle satın alın/i)).toBeInTheDocument();
  });

  test('renders call to action button', () => {
    renderWithRouter(<Home />);
    expect(screen.getByText('Etkinlikleri Görüntüle')).toBeInTheDocument();
  });

  test('renders featured events section', () => {
    renderWithRouter(<Home />);
    expect(screen.getByText('Öne Çıkan Etkinlikler')).toBeInTheDocument();
  });

  test('displays loading state initially', () => {
    mockedAxios.get.mockImplementation(() => new Promise(() => {})); // Never resolves
    renderWithRouter(<Home />);
    expect(screen.getByText('Yükleniyor...')).toBeInTheDocument();
  });

  test('displays featured events when data is loaded', async () => {
    const mockEvents = [
      {
        id: 1,
        title: 'Test Event 1',
        description: 'Test Description 1',
        date: '2024-12-31',
        time: '20:00:00',
        location: 'Test Location 1',
        price: 100.00,
        category: { name: 'Music' }
      },
      {
        id: 2,
        title: 'Test Event 2',
        description: 'Test Description 2',
        date: '2024-12-30',
        time: '19:00:00',
        location: 'Test Location 2',
        price: 150.00,
        category: { name: 'Sports' }
      }
    ];

    mockedAxios.get.mockResolvedValueOnce({ data: mockEvents });

    renderWithRouter(<Home />);

    await waitFor(() => {
      expect(screen.getByText('Test Event 1')).toBeInTheDocument();
      expect(screen.getByText('Test Event 2')).toBeInTheDocument();
    });
  });

  test('displays error message when API call fails', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));

    renderWithRouter(<Home />);

    await waitFor(() => {
      expect(screen.getByText('Etkinlikler yüklenirken bir hata oluştu.')).toBeInTheDocument();
    });
  });

  test('renders view all events button', () => {
    renderWithRouter(<Home />);
    expect(screen.getByText('Tüm Etkinlikleri Görüntüle')).toBeInTheDocument();
  });

  test('displays event details correctly', async () => {
    const mockEvents = [
      {
        id: 1,
        title: 'Test Event',
        description: 'Test Description',
        date: '2024-12-31',
        time: '20:00:00',
        location: 'Test Location',
        price: 100.00,
        category: { name: 'Music' }
      }
    ];

    mockedAxios.get.mockResolvedValueOnce({ data: mockEvents });

    renderWithRouter(<Home />);

    await waitFor(() => {
      expect(screen.getByText('Test Event')).toBeInTheDocument();
      expect(screen.getByText('Test Location')).toBeInTheDocument();
      expect(screen.getByText('₺100.00')).toBeInTheDocument();
    });
  });
});
