/**
 * @file SearchBar.test.js
 * @description Unit tests for the SearchBar component.
 * @authors Charlie Ney, Cathy Duan
 * @date 6/9/25
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { SearchBar } from "./SearchBar";
import "@testing-library/jest-dom/vitest";

// Mock the global fetch API for all tests
global.fetch = vi.fn();

describe("SearchBar", () => {
  const mockSetResults = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    fetch.mockReset();
  });

  afterEach(() => {
    cleanup();
  });

  /**
   * Test: Renders the search input
   * Description: Verifies that the input field is rendered correctly with an empty value.
   */
  it("renders the search input correctly", () => {
    render(<SearchBar setResults={mockSetResults} />);
    const searchInput = screen.getByPlaceholderText("Type to search for an album title...");
    expect(searchInput).toBeInTheDocument();
    expect(searchInput.value).toBe("");
  });

  /**
   * Test: Fetches and filters album results
   * Description: Simulates a user typing a query and verifies that fetch is called,[] and only albums/EPs are returned to `setResults`.
   */
  it("calls fetchData and setResults with filtered and deduped releases when input changes", async () => {
    const mockResponse = {
      releases: [
        {
          id: "123",
          title: "Test Album",
          date: "2023-01-01",
          "artist-credit": [{ name: "Test Artist" }],
          "release-group": { "primary-type": "Album" },
        },
        {
          id: "124",
          title: "Test Album",
          date: "2023-01-02",
          "artist-credit": [{ name: "Test Artist" }],
          "release-group": { "primary-type": "Album" },
        },
        {
          id: "125",
          title: "Unique Album",
          date: "2022-01-01",
          "artist-credit": [{ name: "Other Artist" }],
          "release-group": { "primary-type": "EP" },
        },
        {
          id: "456",
          title: "Not an Album",
          date: "2022-01-01",
          "artist-credit": [{ name: "Other Artist" }],
          "release-group": { "primary-type": "Single" },
        },
      ],
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    render(<SearchBar setResults={mockSetResults} />);
    const searchInput = screen.getByPlaceholderText("Type to search for an album title...");
    fireEvent.change(searchInput, { target: { value: "test query" } });

    await vi.waitFor(
      () => {
        expect(mockSetResults).toHaveBeenCalledWith([
          {
            id: "123",
            title: "Test Album",
            artist: "Test Artist",
            firstReleaseDate: "2023-01-01",
            type: "Album",
          },
          {
            id: "125",
            title: "Unique Album",
            artist: "Other Artist",
            firstReleaseDate: "2022-01-01",
            type: "EP",
          },
        ]);
      },
      { timeout: 1000 } 
    );
  });
});
