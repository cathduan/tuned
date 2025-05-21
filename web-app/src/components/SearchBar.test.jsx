import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { SearchBar } from './SearchBar';
import "@testing-library/jest-dom/vitest";


// Mock fetch function
global.fetch = vi.fn();

describe('SearchBar', () => {
  const mockSetResults = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset fetch mock before each test
    fetch.mockReset();
  });
  
  afterEach(() => {
    // Clean up the DOM after each test to prevent duplicate elements
    cleanup();
  });

  it('renders the search input correctly', () => {
    render(<SearchBar setResults={mockSetResults} />);
    
    // Check if the input is rendered with the correct placeholder
    const searchInput = screen.getByPlaceholderText('Type to search for an album title...');
    expect(searchInput).toBeInTheDocument();
    expect(searchInput.value).toBe('');
  });

  it('calls fetchData and setResults with filtered releases when input changes', async () => {
    // Mock API response matching the component's expectations
    const mockResponse = {
      releases: [
        {
          id: '123',
          title: 'Test Album',
          date: '2023-01-01',
          'artist-credit': [{ name: 'Test Artist' }],
          'release-group': { 'primary-type': 'Album' }
        },
        {
          id: '456',
          title: 'Not an Album',
          date: '2022-01-01',
          'artist-credit': [{ name: 'Other Artist' }],
          'release-group': { 'primary-type': 'Single' }
        }
      ]
    };
    
    fetch.mockResolvedValueOnce({
      json: async () => mockResponse
    });

    render(<SearchBar setResults={mockSetResults} />);
    const searchInput = screen.getByPlaceholderText('Type to search for an album title...');
    fireEvent.change(searchInput, { target: { value: 'test query' } });
    expect(searchInput.value).toBe('test query');
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('test%20query'));

    await vi.waitFor(() => {
      expect(mockSetResults).toHaveBeenCalledWith([
        {
          id: '123',
          title: 'Test Album',
          artist: 'Test Artist',
          firstReleaseDate: '2023-01-01',
          type: 'Album'
        }
      ]);
    });
  });
});