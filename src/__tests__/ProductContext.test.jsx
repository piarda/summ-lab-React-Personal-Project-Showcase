import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProductPage from '../pages/ProductPage';
import * as useFetchProductsModule from '../hooks/useFetchProducts';
import { vi } from 'vitest';

const mockNavigate = vi.fn();
const mockSetProducts = vi.fn();

vi.mock('../hooks/useFetchProducts');
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockWines = [
  {
    id: 1,
    name: 'Red Wine',
    type: 'Red',
    region: 'Napa',
    year: 2018,
    description: 'A nice red wine',
    price: 35.00,
  },
  {
    id: 2,
    name: 'White Wine',
    type: 'White',
    region: 'Sonoma',
    year: 2020,
    description: 'A nice white wine',
    price: 25.00,
  },
];

describe('ProductPage', () => {
  global.fetch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    useFetchProductsModule.default.mockReturnValue({
      products: mockWines,
      setProducts: mockSetProducts,
      loading: false,
      error: null,
    });
  });

  test('renders wine list and search input', () => {
    render(<ProductPage />);

    expect(screen.getByRole('heading', { name: /wine list/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/search wines/i)).toBeInTheDocument();

    // Change these to use getByRole with a specific name and heading level
    expect(screen.getByRole('heading', { name: 'Red Wine (2018)', level: 3 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'White Wine (2020)', level: 3 })).toBeInTheDocument();
  });

  test('filters wines based on search term', () => {
    render(<ProductPage />);

    const searchInput = screen.getByLabelText(/search wines/i);
    fireEvent.change(searchInput, { target: { value: 'White' } });

    // Use getByRole here as well to be more specific
    expect(screen.getByRole('heading', { name: 'White Wine (2020)', level: 3 })).toBeInTheDocument();
    
    // queryByRole is the correct variant for checking that an element is NOT present
    expect(screen.queryByRole('heading', { name: /Red Wine/i, level: 3 })).not.toBeInTheDocument();
  });

  test('delete button calls handleDelete and updates products', async () => {
    window.confirm = vi.fn(() => true);

    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    });

    render(<ProductPage />);
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    fireEvent.click(deleteButtons[0]);

    expect(global.fetch).toHaveBeenCalledWith('http://localhost:6001/products/1', {
      method: 'DELETE',
    });

    await waitFor(() => {
      expect(mockSetProducts).toHaveBeenCalledTimes(1);
      expect(mockSetProducts).toHaveBeenCalledWith(expect.any(Function));
    });
  });

  test('edit button navigates to the edit product page', () => {
    render(<ProductPage />);
    const editButtons = screen.getAllByRole('button', { name: /edit/i });

    fireEvent.click(editButtons[0]);

    expect(mockNavigate).toHaveBeenCalledWith('/edit-product/1');
  });
});