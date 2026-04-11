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