/**
 * @file profile.test.jsx
 * @description Unit tests for the Profile component using Vitest and React Testing Library.
 * Tests rendering of profile info and album reviews fetched from API.
 * Covers behavior for both empty and non-empty review cases.
 * 
 * @authors 
 *   - Charlie Ney
 * @date 6/8/25
 */

import '@testing-library/jest-dom/vitest';

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import Profile from './Profile.jsx';
import { BrowserRouter } from 'react-router-dom';

// Mock jwt-decode to simulate decoding the JWT and extracting the user ID and username
vi.mock('jwt-decode', () => ({
  jwtDecode: vi.fn(() => ({ id: 1, username: 'testuser' })),
}));

// Mock fetch globally for all API calls in Profile
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Stub localStorage with a fake token
vi.stubGlobal('localStorage', {
  getItem: vi.fn(() => 'fakeToken'),
});

describe('<Profile />', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  /**
   * Test: Renders message for empty review list
   * Description: If the user has no reviews, their username and a helpful message should display.
   */
  it("renders the username and a message when no reviews are present", async () => {
    mockFetch.mockImplementation((url) => {
      if (url.includes("/profiles/1/reviews")) {
        return Promise.resolve({
          json: () => Promise.resolve([]), // No reviews returned
        });
      }
      return Promise.resolve({ json: () => Promise.resolve({}) });
    });

    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("testuser's profile")).toBeInTheDocument();
      expect(screen.getByText("You haven't reviewed any albums yet.")).toBeInTheDocument();
    });
  });

  /**
   * Test: Renders album and artist info when reviews exist
   * Description: If reviews are returned, it should fetch album details and display them correctly.
   */
  it("shows album and artist info if reviews are returned", async () => {
    mockFetch.mockImplementation((url) => {
      if (url.includes("/profiles/1/reviews")) {
        return Promise.resolve({
          json: () =>
            Promise.resolve([
              {
                id: 1,
                album_id: "abc123",
                rating: 4,
                notes: "Cool album",
                date_listened: "2024-01-01T00:00:00.000Z",
              },
            ]),
        });
      }

      if (url.includes("musicbrainz")) {
        return Promise.resolve({
          json: () =>
            Promise.resolve({
              title: "Test Album",
              date: "2024-01-01",
              "artist-credit": [{ name: "Test Artist" }],
              "release-group": { title: "Test Group" },
            }),
        });
      }

      return Promise.resolve({ json: () => Promise.resolve({}) });
    });

    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Album:")).toBeInTheDocument();
      expect(screen.getByText("Test Album")).toBeInTheDocument();
      expect(screen.getByText("Test Artist")).toBeInTheDocument();
    });
  });
});
