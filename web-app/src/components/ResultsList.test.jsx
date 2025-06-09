// ResultsList.test.jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ResultsList } from './ResultsList';
import React from "react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom/vitest";

describe('ResultsList', () => {
  it('renders a list of albums with title, artist, and release date', () => {
    const sampleResults = [
      {
        id: '1',
        title: 'The Dark Side of the Moon',
        artist: 'Pink Floyd',
        firstReleaseDate: '1973',
      },
      {
        id: '2',
        title: 'Thriller',
        artist: 'Michael Jackson',
        firstReleaseDate: '1982',
      },
    ];

    render(
      <MemoryRouter>
        <ResultsList results={sampleResults} />
      </MemoryRouter>
    );

    // Check that the titles are rendered as links
    expect(screen.getByRole('link', { name: 'The Dark Side of the Moon' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Thriller' })).toBeInTheDocument();

    // Check that the artists are rendered
    expect(screen.getByText('Pink Floyd')).toBeInTheDocument();
    expect(screen.getByText('Michael Jackson')).toBeInTheDocument();

    // Check that the release dates are rendered
    expect(screen.getByText('Released: 1973')).toBeInTheDocument();
    expect(screen.getByText('Released: 1982')).toBeInTheDocument();

    // Check that two list items are rendered
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('renders an empty list if results is an empty array', () => {
    render(
      <MemoryRouter>
        <ResultsList results={[]} />
      </MemoryRouter>
    );
    expect(screen.queryAllByRole('listitem')).toHaveLength(2);
  });
});
