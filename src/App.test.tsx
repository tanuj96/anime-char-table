import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import App from './App';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const global: any;

const mockCharacters = [
  { id: '1', name: 'Naruto', location: 'Konoha', health: 'Healthy', power: 1000 },
  { id: '2', name: 'Sasuke', location: 'Konoha', health: 'Injured', power: 900 },
];

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(mockCharacters),
    })
  ) as jest.Mock;
});

afterEach(() => {
  jest.clearAllMocks();
});

test('renders loading state initially', () => {
  render(<App />);
  expect(screen.getByRole('progressbar')).toBeInTheDocument();
});

test('renders table after loading', async () => {
  render(<App />);
  await waitFor(() => {
    expect(screen.getByText('Naruto')).toBeInTheDocument();
  });
});

test('filters characters by search term', async () => {
  render(<App />);
  await waitFor(() => {
    expect(screen.getByText('Naruto')).toBeInTheDocument();
  });

  const searchInput = screen.getByPlaceholderText('Search by name or location...');
  userEvent.type(searchInput, 'Sasuke');

  await waitFor(() => {
    expect(screen.getByText('Sasuke')).toBeInTheDocument();
    expect(screen.queryByText('Naruto')).not.toBeInTheDocument();
  });
});

test('logs selected IDs when marking viewed', async () => {
  const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  render(<App />);
  await waitFor(() => {
    expect(screen.getByText('Naruto')).toBeInTheDocument();
  });

  const checkboxes = screen.getAllByRole('checkbox');
  fireEvent.click(checkboxes[1]); // Select first row

  const markViewedButton = screen.getByText('Mark Viewed (1)');
  fireEvent.click(markViewedButton);

  expect(consoleSpy).toHaveBeenCalledWith('Selected Characters:', [{ id: '1', name: 'Naruto' }]);

  consoleSpy.mockRestore();
});