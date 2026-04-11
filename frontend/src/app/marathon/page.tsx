"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Popcorn, Clock, Star, Film, ChevronRight,
  RotateCcw, Users, Minus, Play, Sparkles,
} from "lucide-react";
import { moviesAPI } from "@/lib/api";
import { posterUrl, formatRuntime, ratingColor } from "@/lib/utils";

interface MarathonTheme {
  slug: string;
  label: string;
  description: string;
  emoji: string;
}

interface MarathonMovie {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  release_date: string;
  overview: string;
  genre_ids: number[];
}

interface MarathonResult {
  theme: { slug: string; label: string; description: string; emoji: string };
  movies: MarathonMovie[];
  stats: {
    movie_count: number;
    total_runtime_minutes: number;
    intermission_minutes: number;
    total_evening_minutes: number;
    average_rating: number;
  };
}

const THEMES: MarathonTheme[] = [
  { slug: "classic-marathon", label: "Classic Cinema", description: "A journey through the greatest films ever made", emoji: "🎬" },
  { slug: "action-packed", label: "Action-Packed Night", description: "Non-stop thrills from start to finish", emoji: "💥" },
  { slug: "rom-com-evening", label: "Rom-Com Evening", description: "Laughs, love, and feel-good vibes", emoji: "💕" },
  { slug: "sci-fi-odyssey", label: "Sci-Fi Odyssey", description: "Explore the universe from your couch", emoji: "🚀" },
  { slug: "horror-night", label: "Horror Night", description: "Lights off, volume up — dare you", emoji: "👻" },
  { slug: "animated-adventure", label: "Animated Adventure", description: "Magical stories for the young at heart", emoji: "✨" },
  { slug: "director-spotlight", label: "Award Winners", description: "Critically acclaimed masterpieces", emoji: "🏆" },
];


export default function MarathonPage() {
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [movieCount, setMovieCount] = useState(3);
  const [marathon, setMarathon] = useState<MarathonResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"pick" | "count" | "result">("pick");

  const generateMarathon = useCallback(async () => {
    if (!selectedTheme) return;
    setLoading(true);
    try {
      const data = await moviesAPI.generateMarathon(selectedTheme, movieCount);
      setMarathon(data);
      setStep("result");
    } catch {
      setMarathon(null);
    } finally {
      setLoading(false);
    }
  }, [selectedTheme, movieCount]);

  const reset = () => {
    setSelectedTheme(null);
    setMarathon(null);
    setStep("pick");
    setMovieCount(3);
  };

  return (
    <main className="min-h-screen bg-surface-0 pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/20 text-gold text-xs font-medium mb-4">
            <Popcorn className="w-3.5 h-3.5" />
            New Feature
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-bold mb-3">
            Movie Night <span className="text-gold">Planner</span>
          </h1>
          <p className="text-white/40 text-lg max-w-lg mx-auto">
            Pick a vibe, choose how many films, and get a curated marathon
            with total runtime and intermission breaks.
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-3 mb-10">
          {["Theme", "Count", "Marathon"].map((label, i) => {
            const stepIndex = ["pick", "count", "result"].indexOf(step);
            const active = i <= stepIndex;
            return (
              <div key={label} className="flex items-center gap-3">
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium transition-all ${active ? "bg-gold/15 text-gold border border-gold/25" : "bg-white/5 text-white/25 border border-white/5"}`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${active ? "bg-gold text-surface-0" : "bg-white/10 text-white/30"}`}>
                    {i + 1}
                  </span>
                  {label}
                </div>
                {i < 2 && <ChevronRight className={`w-3.5 h-3.5 ${active ? "text-gold/40" : "text-white/10"}`} />}
              </div>
            );
          })}
        </div>

        {/* Step 1: Pick Theme */}
        {step === "pick" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
            {THEMES.map((theme) => (
              <button
                key={theme.slug}
                onClick={() => { setSelectedTheme(theme.slug); setStep("count"); }}
                className={`group relative p-6 rounded-2xl border text-left transition-all duration-300 hover:scale-[1.02] ${
                  selectedTheme === theme.slug
                    ? "bg-gold/10 border-gold/30 shadow-lg shadow-gold/5"
                    : "bg-white/[0.02] border-white/[0.06] hover:border-gold/20 hover:bg-white/[0.04]"
                }`}
              >
                <span className="text-3xl block mb-3">{theme.emoji}</span>
                <h3 className="text-white font-semibold text-lg mb-1 group-hover:text-gold transition-colors">
                  {theme.label}
                </h3>
                <p className="text-white/35 text-sm">{theme.description}</p>
                <ChevronRight className="absolute top-6 right-5 w-4 h-4 text-white/10 group-hover:text-gold/40 transition-colors" />
              </button>
            ))}
          </div>
        )}

        {/* Step 2: Pick Count */}
        {step === "count" && (
          <div className="max-w-md mx-auto text-center animate-fade-in">
            <p className="text-white/40 mb-6">How many movies for your marathon?</p>
            <div className="flex items-center justify-center gap-4 mb-8">
              {[2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => setMovieCount(n)}
                  className={`w-16 h-16 rounded-2xl text-2xl font-bold transition-all duration-200 ${
                    movieCount === n
                      ? "bg-gold text-surface-0 shadow-lg shadow-gold/20 scale-110"
                      : "bg-white/5 text-white/40 border border-white/10 hover:border-gold/20"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
            <p className="text-white/20 text-sm mb-8">
              {movieCount === 2 && "A quick double-feature — perfect for a weeknight."}
              {movieCount === 3 && "The sweet spot — a full evening of cinema."}
              {movieCount === 4 && "Ambitious! Block out 6+ hours for this one."}
              {movieCount === 5 && "Ultimate marathon mode. Snacks are mandatory."}
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setStep("pick")}
                className="px-5 py-2.5 rounded-xl bg-white/5 text-white/40 text-sm hover:bg-white/10 transition-all"
              >
                Back
              </button>
              <button
                onClick={generateMarathon}
                disabled={loading}
                className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-gold to-gold-dim text-surface-0 font-semibold text-sm hover:shadow-lg hover:shadow-gold/20 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-surface-0/30 border-t-surface-0 rounded-full animate-spin" />
                    Generating...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Generate Marathon
                  </span>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Result */}
        {step === "result" && marathon && (
          <div className="animate-fade-in">
            {/* Stats bar */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mb-10 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <StatBadge icon={Film} label="Movies" value={String(marathon.stats.movie_count)} />
              <div className="w-px h-8 bg-white/10 hidden sm:block" />
              <StatBadge icon={Clock} label="Watch Time" value={formatRuntime(marathon.stats.total_runtime_minutes)} />
              <div className="w-px h-8 bg-white/10 hidden sm:block" />
              <StatBadge icon={Minus} label="Breaks" value={`${marathon.stats.intermission_minutes}m`} />
              <div className="w-px h-8 bg-white/10 hidden sm:block" />
              <StatBadge icon={Clock} label="Total Evening" value={formatRuntime(marathon.stats.total_evening_minutes)} />
              <div className="w-px h-8 bg-white/10 hidden sm:block" />
              <StatBadge icon={Star} label="Avg Rating" value={String(marathon.stats.average_rating)} highlight />
            </div>

            {/* Timeline */}
            <div className="relative">
              {/* Vertical connector line */}
              <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-gold/40 via-gold/20 to-transparent hidden sm:block" />

              <div className="space-y-6">
                {marathon.movies.map((movie, idx) => (
                  <div key={movie.id} className="relative">
                    {/* Timeline dot */}
                    <div className="absolute left-[25px] top-8 w-[7px] h-[7px] rounded-full bg-gold shadow-sm shadow-gold/30 hidden sm:block" />

                    <div className="sm:ml-16 group">
                      <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-gold/15 hover:bg-white/[0.04] transition-all duration-300">
                        {/* Poster */}
                        <Link href={`/movie/${movie.id}`} className="shrink-0">
                          <div className="relative w-28 h-[168px] rounded-xl overflow-hidden shadow-lg shadow-black/30">
                            <Image
                              src={posterUrl(movie.poster_path, "w185")}
                              alt={movie.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            {/* Order badge */}
                            <div className="absolute top-2 left-2 w-7 h-7 rounded-lg bg-gold/90 flex items-center justify-center text-xs font-bold text-surface-0">
                              {idx + 1}
                            </div>
                          </div>
                        </Link>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div>
                              <Link href={`/movie/${movie.id}`} className="hover:text-gold transition-colors">
                                <h3 className="text-lg font-semibold text-white truncate">
                                  {movie.title}
                                </h3>
                              </Link>
                              <span className="text-white/25 text-xs">
                                {movie.release_date?.slice(0, 4)}
                              </span>
                            </div>
                            <div className={`flex items-center gap-1 text-sm font-medium ${ratingColor(movie.vote_average)}`}>
                              <Star className="w-3.5 h-3.5 fill-current" />
                              {movie.vote_average.toFixed(1)}
                            </div>
                          </div>
                          <p className="text-white/30 text-sm line-clamp-2 leading-relaxed mb-3">
                            {movie.overview}
                          </p>
                          <Link
                            href={`/movie/${movie.id}`}
                            className="inline-flex items-center gap-1.5 text-xs text-gold/60 hover:text-gold transition-colors"
                          >
                            <Play className="w-3 h-3" />
                            View Details
                          </Link>
                        </div>
                      </div>

                      {/* Intermission card */}
                      {idx < marathon.movies.length - 1 && (
                        <div className="flex items-center gap-3 py-3 pl-4 text-white/15 text-xs">
                          <div className="w-8 h-px bg-white/10" />
                          <Popcorn className="w-3.5 h-3.5" />
                          <span>15 min intermission — stretch, grab snacks</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-center gap-4 mt-10">
              <button
                onClick={reset}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 text-white/40 text-sm hover:bg-white/10 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Start Over
              </button>
              <button
                onClick={generateMarathon}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-gold to-gold-dim text-surface-0 font-semibold text-sm hover:shadow-lg hover:shadow-gold/20 transition-all disabled:opacity-50"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                {loading ? "Shuffling..." : "Shuffle Movies"}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
