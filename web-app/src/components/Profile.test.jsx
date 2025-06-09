// import { render, screen } from "@testing-library/react";
// import Profile from "./Profile.jsx";
// import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
// import React from "react";
// import { MemoryRouter } from "react-router-dom"; 
// import '@testing-library/jest-dom/vitest';

// // Mock jwtDecode and fetch
// vi.mock("jwt-decode", () => ({
//   jwtDecode: () => ({ id: 1, username: "testuser" }),
// }));

// global.fetch = vi.fn();

// describe("Profile", () => {
//   beforeEach(() => {
//     fetch.mockResolvedValueOnce({
//       json: async () => [
//         {
//           id: 1,
//           album_id: "abc",
//           rating: 5,
//           notes: "Great album!",
//           date_listened: "2024-01-01",
//           albumTitle: "Test Album",
//           artist: "Test Artist",
//           albumInfo: { title: "Test Album", "artist-credit": [{ name: "Test Artist" }] },
//         },
//       ],
//     });
//     localStorage.setItem("token", "fake-jwt");
//   });

//   afterEach(() => {
//     vi.clearAllMocks();
//     localStorage.clear();
//   });

//   it("renders the user's profile and reviews", async () => {
//     render(
//       <MemoryRouter>
//         <Profile />
//       </MemoryRouter>
//     );
//     expect(await screen.findByText("testuser's profile")).toBeInTheDocument();
//     expect(await screen.findByText("Test Album")).toBeInTheDocument();
//     expect(await screen.findByText("Test Artist")).toBeInTheDocument();
//     expect(await screen.findByText("Great album!")).toBeInTheDocument();
//   });


// });

// profile.test.jsx
import '@testing-library/jest-dom/vitest';

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import Profile from './Profile.jsx';
import { BrowserRouter } from 'react-router-dom';

// Mock jwt-decode
vi.mock('jwt-decode', () => ({
  jwtDecode: vi.fn(() => ({ id: 1, username: 'testuser' }))
}));

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// LocalStorage mock
vi.stubGlobal('localStorage', {
  getItem: vi.fn(() => 'fakeToken'),
});

describe('<Profile />', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('renders the username and a message when no reviews are present', async () => {
    mockFetch.mockImplementation((url) => {
      if (url.includes('/profiles/1/reviews')) {
        return Promise.resolve({
          json: () => Promise.resolve([]),
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
      expect(
        screen.getByText("You haven't reviewed any albums yet.")
      ).toBeInTheDocument();
    });
  });

  it('shows album and artist info if reviews are returned', async () => {
    mockFetch.mockImplementation((url) => {
      if (url.includes('/profiles/1/reviews')) {
        return Promise.resolve({
          json: () =>
            Promise.resolve([
              {
                id: 1,
                album_id: 'abc123',
                rating: 4,
                notes: 'Cool album',
                date_listened: '2024-01-01T00:00:00.000Z',
              },
            ]),
        });
      }
      if (url.includes('musicbrainz')) {
        return Promise.resolve({
          json: () =>
            Promise.resolve({
              title: 'Test Album',
              date: '2024-01-01',
              'artist-credit': [{ name: 'Test Artist' }],
              'release-group': { title: 'Test Group' },
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
      expect(screen.getByText('Album:')).toBeInTheDocument();
      expect(screen.getByText('Test Album')).toBeInTheDocument();
      expect(screen.getByText('Test Artist')).toBeInTheDocument();
    });
  });
});
