import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { vi } from 'vitest';

// Mock the child components to test the routing in isolation
vi.mock('../pages/LandingPage', () => ({
  __esModule: true,
  default: () => <h1>Welcome to Sip Happens!</h1>,
}));

vi.mock('../pages/ProductPage', () => ({
  __esModule: true,
  default: () => <h1>Wine List</h1>,
}));

// Mock FormPage to render different headings based on the route
// Tests the routing to FormPage without its internal logic breaking the test
vi.mock('../pages/FormPage', () => ({
  __esModule: true,
  default: () => {
    const { useParams } = require('react-router-dom');
    const { id } = useParams();

    if (id) {
      return <h2>Edit a Wine</h2>;
    }
    return <h2>Add a New Wine</h2>;
  },
}));

describe('App routing', () => {

  test('renders LandingPage by default ("/")', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { name: /welcome to sip happens!/i })).toBeInTheDocument();
  });

  test('navigates to ProductPage when clicking "Browse Wines"', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    const user = userEvent.setup();
    await user.click(screen.getByRole('link', { name: /browse wines/i }));
    expect(await screen.findByRole('heading', { name: /wine list/i })).toBeInTheDocument();
  });

  test('navigates to FormPage when clicking "Admin Portal"', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    const user = userEvent.setup();
    await user.click(screen.getByRole('link', { name: /admin portal/i }));
    expect(await screen.findByRole('heading', { name: /add a new wine/i })).toBeInTheDocument();
  });
  
  test('renders FormPage for the "/edit-product/:id" route', () => {
    const editRoute = '/edit-product/123';
    render(
      <MemoryRouter initialEntries={[editRoute]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { name: /edit a wine/i })).toBeInTheDocument();
  });
});