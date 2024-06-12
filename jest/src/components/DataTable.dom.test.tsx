// __tests__/DataTable.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { DataTable } from './DataTable';
import { useQuery } from 'react-query';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
jest.mock('react-query');

const mockData = [
  { id: '1', name: 'Item 1', value: 100 },
  { id: '2', name: 'Item 2', value: 200 },
];

describe('DataTable Component', () => {
  it('displays loading state and then data', async () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: mockData,
      status: 'success',
      error: undefined,
    });

    render(<DataTable endpoint="/api/data" />);

    await waitFor(() => {
      expect(screen.getByText(/item 1/i)).toBeInTheDocument();
      expect(screen.getByText(/item 2/i)).toBeInTheDocument();
    });
  });

  it('displays error state on failed fetch', async () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: undefined,
      status: 'error',
      error: new Error('Fetch failed'),
    });

    render(<DataTable endpoint="/api/data" />);

    await waitFor(() => {
      expect(screen.getByText(/fetch failed/i)).toBeInTheDocument();
    });
  });

  it('filters data based on search input', async () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: mockData,
      status: 'success',
      error: undefined,
    });

    render(<DataTable endpoint="/api/data" />);

    const input = screen.getByPlaceholderText(/filter by name/i);
    userEvent.type(input, 'Item 1{enter}');

    await waitFor(() => {
      expect(screen.queryByText(/item 2/i)).not.toBeInTheDocument();
      expect(screen.getByText(/item 1/i)).toBeInTheDocument();
    });
  });
});