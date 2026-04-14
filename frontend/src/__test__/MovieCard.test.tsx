/**
 * Component tests for MovieCard.
 * Verifies rendering of movie data, rating badges, and link generation.
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import MovieCard, { MovieCardSkeleton } from "@/components/MovieCard";

// next/image and next/link stubs for the test environment
jest.mock("next/image", () => {
  const MockImage = (props: any) =>
    React.createElement("img", { ...props, fill: undefined });
  MockImage.displayName = "MockImage";
  return { __esModule: true, default: MockImage };
});

jest.mock("next/link", () => {
  const MockLink = ({ children, href }: any) =>
    React.createElement("a", { href }, children);
  MockLink.displayName = "MockLink";
  return { __esModule: true, default: MockLink };
});

const MOCK_MOVIE = {
  id: 1,
  tmdb_id: 550,
  title: "Fight Club",
  overview: "An insomniac office worker and a soap maker form an underground fight club.",
  release_date: "1999-10-15",
  year: 1999,
  vote_average: 8.4,
  vote_count: 25000,
  popularity: 60.5,
  poster_url: "https://image.tmdb.org/t/p/w500/poster.jpg",
  poster_url_small: "https://image.tmdb.org/t/p/w185/poster.jpg",
  genres: [{ id: 1, tmdb_id: 18, name: "Drama", slug: "drama" }],
  runtime: 139,
};

describe("MovieCard", () => {
  it("renders movie title", () => {
    render(<MovieCard movie={MOCK_MOVIE} />);
    expect(screen.getByText("Fight Club")).toBeInTheDocument();
  });

  it("renders year when available", () => {
    render(<MovieCard movie={MOCK_MOVIE} />);
    expect(screen.getByText("1999")).toBeInTheDocument();
  });

  it("renders vote average badge", () => {
    render(<MovieCard movie={MOCK_MOVIE} />);
    expect(screen.getByText("8.4")).toBeInTheDocument();
  });

  it("links to the correct movie detail page", () => {
    render(<MovieCard movie={MOCK_MOVIE} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/movie/550");
  });

  it("shows overview when showOverview is true", () => {
    render(<MovieCard movie={MOCK_MOVIE} showOverview />);
    expect(screen.getByText(/insomniac office worker/)).toBeInTheDocument();
  });

  it("hides overview by default", () => {
    render(<MovieCard movie={MOCK_MOVIE} />);
    expect(screen.queryByText(/insomniac office worker/)).not.toBeInTheDocument();
  });
});

describe("MovieCardSkeleton", () => {
  it("renders without crashing", () => {
    const { container } = render(<MovieCardSkeleton />);
    expect(container.firstChild).toBeTruthy();
  });
});
