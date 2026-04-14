/**
 * Type-level sanity tests for movie interfaces.
 * Ensures the type definitions match expected API shapes
 * and that required fields are properly enforced at build time.
 */

import type {
  MovieCompact,
  MovieDetail,
  Genre,
  WatchlistItem,
  PaginatedResponse,
} from "@/types/movie";

describe("Movie type definitions", () => {
  it("MovieCompact has all required fields", () => {
    const movie: MovieCompact = {
      id: 1,
      tmdb_id: 550,
      title: "Fight Club",
      overview: "Test",
      release_date: "1999-10-15",
      year: 1999,
      vote_average: 8.4,
      vote_count: 25000,
      popularity: 60.5,
      poster_url: "/poster.jpg",
      poster_url_small: "/poster_sm.jpg",
      genres: [],
      runtime: 139,
    };

    expect(movie.tmdb_id).toBe(550);
    expect(movie.title).toBe("Fight Club");
  });

  it("WatchlistItem has expected shape", () => {
    const item: WatchlistItem = {
      id: 1,
      movie_tmdb_id: 550,
      movie_title: "Fight Club",
      poster_path: "/poster.jpg",
      watched: false,
    };

    expect(item.watched).toBe(false);
    expect(item.movie_tmdb_id).toBe(550);
  });

  it("PaginatedResponse wraps results correctly", () => {
    const response: PaginatedResponse<MovieCompact> = {
      results: [],
      total_pages: 1,
      total_results: 0,
      page: 1,
    };

    expect(response.results).toEqual([]);
    expect(response.page).toBe(1);
  });

  it("Genre has slug for URL routing", () => {
    const genre: Genre = {
      id: 1,
      tmdb_id: 28,
      name: "Action",
      slug: "action",
    };

    expect(genre.slug).toBe("action");
  });
});
