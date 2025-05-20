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
    const searchInput = screen.getByPlaceholderText('Type to search for albums...');
    expect(searchInput).toBeInTheDocument();
    expect(searchInput.value).toBe('');
  });

  it('calls fetchData when input changes', async () => {
    // Mock successful API response
    const mockResponse = {
      'release-groups': [
        {
          id: '123',
          title: 'Test Album',
          'artist-credit': [{ name: 'Test Artist' }],
          'first-release-date': '2023-01-01'
        }
      ]
    };
    
    fetch.mockResolvedValueOnce({
      json: async () => mockResponse
    });

    // Render the component with a different container for each test
    const { container } = render(<SearchBar setResults={mockSetResults} />);
    
    // Get the input element using the container to scope the query
    const searchInput = container.querySelector('input');
    expect(searchInput).toBeInTheDocument();
    
    // Simulate user typing in the search box
    fireEvent.change(searchInput, { target: { value: 'test query' } });
    
    // Check if the input value is updated
    expect(searchInput.value).toBe('test query');
    
    // Check if fetch was called with the right URL
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('test%20query'));
    
    // Wait for the async operation to complete
    await vi.waitFor(() => {
      // Check if setResults was called with the processed data
      expect(mockSetResults).toHaveBeenCalledWith([
        {
          id: '123',
          title: 'Test Album',
          artist: 'Test Artist',
          firstReleaseDate: '2023-01-01'
        }
      ]);
    });
  });
});