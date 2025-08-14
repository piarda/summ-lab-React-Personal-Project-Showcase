import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';

// Render the LandingPage component
test('renders landing page content', () => {
  render(
    <MemoryRouter>
      <LandingPage />
    </MemoryRouter>
  );

  // Assert key text from the landing page is present
  expect(screen.getByText(/welcome to/i)).toBeInTheDocument();
});
