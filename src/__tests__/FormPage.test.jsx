import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FormPage from '../pages/FormPage';
import { BrowserRouter } from 'react-router-dom';
import { ProductProvider } from '../context/ProductContext';

// Mock the global fetch API to simulate a successful API response.
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ id: 1, name: 'Test Wine' }),
  })
);

test('submits new product form', async () => {
  render(
    <BrowserRouter>
      <ProductProvider>
        <FormPage />
      </ProductProvider>
    </BrowserRouter>
  );

  // Simulate a user filling out the form inputs
  fireEvent.change(screen.getByPlaceholderText(/name/i), { target: { value: 'Test Wine' } });
  fireEvent.change(screen.getByPlaceholderText(/price/i), { target: { value: '20' } });
  fireEvent.change(screen.getByPlaceholderText(/type/i), { target: { value: 'Red' } });
  fireEvent.change(screen.getByPlaceholderText(/region/i), { target: { value: 'Napa' } });
  fireEvent.change(screen.getByPlaceholderText(/year/i), { target: { value: '2022' } });
  fireEvent.change(screen.getByPlaceholderText(/description/i), { target: { value: 'Delicious!' } });

  // Simulate the user clicking the submit button
  fireEvent.click(screen.getByText(/add wine/i));

  // Wait for the asynchronous fetch call to complete and the UI to update
  await waitFor(() => {
    expect(fetch).toHaveBeenCalled();
    expect(screen.getByText(/wine added successfully/i)).toBeInTheDocument();
  });
});
