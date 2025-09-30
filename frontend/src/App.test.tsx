import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  test('renders EventTicket brand', () => {
    render(<App />);
    const linkElement = screen.getByText(/EventTicket/i);
    expect(linkElement).toBeInTheDocument();
  });
});
