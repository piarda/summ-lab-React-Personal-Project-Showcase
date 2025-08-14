import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import useFetchProducts from '../hooks/useFetchProducts';

describe('useFetchProducts', () => {
  // Mock the global fetch API to prevent real network requests
  const mockFetch = vi.fn();
  vi.stubGlobal('fetch', mockFetch);

  // Mock data for a successful API response
  const mockProducts = [
    { id: 1, name: 'Merlot' },
    { id: 2, name: 'Chardonnay' },
  ];

  test('should return the correct initial state', () => {
    // Set up a mock fetch call
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]),
    });

    const { result } = renderHook(() => useFetchProducts());

    // Assert the initial state is as expected
    expect(result.current.loading).toBe(true);
    expect(result.current.products).toEqual([]);
    expect(result.current.error).toBe(null);
  });

  test('should fetch products successfully and update state', async () => {
    // Mock a successful fetch response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockProducts),
    });

    const { result } = renderHook(() => useFetchProducts());

    // Wait for the asynchronous state updates and assert the final state
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.products).toEqual(mockProducts);
      expect(result.current.error).toBe(null);
    });
  });

  test('should handle a fetch error and update state', async () => {
    // Mock a failed fetch response
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    });

    const { result } = renderHook(() => useFetchProducts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.products).toEqual([]);
      expect(result.current.error).toBe('Failed to fetch products');
    });
  });
});
