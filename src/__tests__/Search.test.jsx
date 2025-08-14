import { render, screen, fireEvent } from '@testing-library/react';
import Search from '../components/Search';

test('calls onSearchChange when typing', () => {
  const handleChange = vi.fn();
  render(<Search searchTerm="" onSearchChange={handleChange} />);
  
  const input = screen.getByPlaceholderText(/type here/i);
  fireEvent.change(input, { target: { value: 'merlot' } });
  
  expect(handleChange).toHaveBeenCalledWith('merlot');
});
