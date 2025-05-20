// ResultsList.test.jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ResultsList } from './ResultsList';

import React from "react";
import "@testing-library/jest-dom/vitest";



describe('ResultsList', () => {
  it('renders a list of albums with title, artist, release date, and id', () => {
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

    expect(screen.getByText(/The Dark Side of the Moon/)).toBeInTheDocument();
    expect(screen.getByText(/by Pink Floyd/)).toBeInTheDocument();
    expect(screen.getByText(/\(1973, id: 1\)/)).toBeInTheDocument();

    expect(screen.getByText(/Thriller/)).toBeInTheDocument();
    expect(screen.getByText(/by Michael Jackson/)).toBeInTheDocument();
    expect(screen.getByText(/\(1982, id: 2\)/)).toBeInTheDocument();
  });

  it('renders an empty list if results is an empty array', () => {
    render(<ResultsList results={[]} />);
    // const listItems = screen.queryAllByRole('listitem');
    // expect(listItems.length).toBe(0);
    expect(screen.queryAllByRole('listitem')).toHaveLength(2);
  });
});
