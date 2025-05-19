import { render, screen } from '@testing-library/react';
import App from './App';

test('renders login screen', () => {
  render(<App />);
  const loginText = screen.getByText(/로그인하여 방송을 들어보세요/i);
  expect(loginText).toBeInTheDocument();
});

test('renders radio logo', () => {
  render(<App />);
  const logoElements = screen.getAllByTitle(/radio/i);
  expect(logoElements.length).toBeGreaterThan(0);
});