/**
 * @file ResultsList.test.jsx
 * @description Unit tests for the ResultsList component. These tests verify rendering behavior based on input props.
 * Uses React Testing Library and Vitest for test structure and DOM querying.
 * @authors 
 *   - Charlie Ney
 * @date 6/9/25
 */

import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ResultsList } from "./ResultsList";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom/vitest";

describe("ResultsList", () => {
  /**
   * Test: Renders a list of albums with title, artist, and release date
   * Description: Verifies that each result renders correctly as a list item
   * with an accessible link, artist name, and release date.
   */
  it("renders a list of albums with title, artist, and release date", () => {
    const sampleResults = [
      {
        id: "1",
        title: "The Dark Side of the Moon",
        artist: "Pink Floyd",
        firstReleaseDate: "1973",
      },
      {
        id: "2",
        title: "Thriller",
        artist: "Michael Jackson",
        firstReleaseDate: "1982",
      },
    ];

    render(
      <MemoryRouter>
        <ResultsList results={sampleResults} />
      </MemoryRouter>
    );

    // Check that the album titles are rendered as links
    expect(screen.getByRole("link", { name: "The Dark Side of the Moon" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Thriller" })).toBeInTheDocument();

    // Check that the artists are rendered
    expect(screen.getByText("Pink Floyd")).toBeInTheDocument();
    expect(screen.getByText("Michael Jackson")).toBeInTheDocument();

    // Check that the release dates are rendered
    expect(screen.getByText("Released: 1973")).toBeInTheDocument();
    expect(screen.getByText("Released: 1982")).toBeInTheDocument();

    // Verify that two list items are rendered
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  /**
   * Test: Renders an empty list
   * Description: Ensures that no list items are rendered when the input results array is empty.
   */
  it("renders an empty list if results is an empty array", () => {
    render(
      <MemoryRouter>
        <ResultsList results={[]} />
      </MemoryRouter>
    );

    // Should render no list items
    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
  });
});
