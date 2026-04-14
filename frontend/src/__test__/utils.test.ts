/**
 * Tests for shared utility functions used across the frontend.
 * Validates formatting, URL generation, and edge-case handling.
 */

import {
  formatRuntime,
  formatCurrency,
  formatDate,
  ratingColor,
  posterUrl,
  backdropUrl,
} from "@/lib/utils";

describe("formatRuntime", () => {
  it("formats hours and minutes correctly", () => {
    expect(formatRuntime(148)).toBe("2h 28m");
  });

  it("formats minutes-only correctly", () => {
    expect(formatRuntime(45)).toBe("45m");
  });

  it("returns empty string for null", () => {
    expect(formatRuntime(null)).toBe("");
  });

  it("returns empty string for zero", () => {
    expect(formatRuntime(0)).toBe("");
  });
});

describe("formatCurrency", () => {
  it("formats large amounts with dollar sign", () => {
    const result = formatCurrency(200000000);
    expect(result).toContain("$");
    expect(result).toContain("200,000,000");
  });

  it("returns dash for zero", () => {
    expect(formatCurrency(0)).toBe("—");
  });
});

describe("ratingColor", () => {
  it("returns green for high ratings", () => {
    expect(ratingColor(8.5)).toBe("text-emerald-400");
  });

  it("returns amber for medium ratings", () => {
    expect(ratingColor(7.0)).toBe("text-amber-300");
  });

  it("returns orange for low-medium ratings", () => {
    expect(ratingColor(5.0)).toBe("text-orange-400");
  });

  it("returns red for low ratings", () => {
    expect(ratingColor(3.0)).toBe("text-red-400");
  });
});

describe("posterUrl", () => {
  it("builds TMDB poster URL from path", () => {
    expect(posterUrl("/abc.jpg")).toBe("https://image.tmdb.org/t/p/w500/abc.jpg");
  });

  it("supports custom sizes", () => {
    expect(posterUrl("/abc.jpg", "w185")).toBe("https://image.tmdb.org/t/p/w185/abc.jpg");
  });

  it("returns placeholder for null", () => {
    expect(posterUrl(null)).toBe("/placeholder-poster.svg");
  });

  it("passes through full URLs unchanged", () => {
    const url = "https://example.com/poster.jpg";
    expect(posterUrl(url)).toBe(url);
  });
});

describe("backdropUrl", () => {
  it("builds TMDB backdrop URL from path", () => {
    expect(backdropUrl("/bg.jpg")).toBe("https://image.tmdb.org/t/p/w1280/bg.jpg");
  });

  it("returns empty string for null", () => {
    expect(backdropUrl(null)).toBe("");
  });

  it("passes through full URLs unchanged", () => {
    const url = "https://example.com/bg.jpg";
    expect(backdropUrl(url)).toBe(url);
  });
});

describe("formatDate", () => {
  it("formats ISO date to human-readable string", () => {
    const result = formatDate("2024-03-15");
    expect(result).toContain("March");
    expect(result).toContain("15");
    expect(result).toContain("2024");
  });

  it("returns empty string for empty input", () => {
    expect(formatDate("")).toBe("");
  });
});
