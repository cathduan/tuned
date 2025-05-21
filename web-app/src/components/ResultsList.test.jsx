// ResultsList.test.jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ResultsList } from './ResultsList';
import React from "react";
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

    render(<ResultsList results={sampleResults} />);

    expect(screen.getByText('The Dark Side of the Moon by Pink Floyd (released: 1973)')).toBeInTheDocument();
    expect(screen.getByText('Thriller by Michael Jackson (released: 1982)')).toBeInTheDocument();
    // Check that two list items are rendered
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('renders an empty list if results is an empty array', () => {
    render(<ResultsList results={[]} />);
    expect(screen.queryAllByRole('listitem')).toHaveLength(2);
  });
});
