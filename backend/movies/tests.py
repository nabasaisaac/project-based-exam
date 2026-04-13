"""
Unit tests for the Movies app.

Covers model creation, API endpoints, serializers,
and TMDB service integration points.
"""

from datetime import date
from unittest.mock import patch, MagicMock
from django.test import TestCase, override_settings
from django.utils.text import slugify
from rest_framework.test import APIClient

from movies.models import Genre, Person, Movie, MovieCast
from movies.serializers import (
    GenreSerializer,
    MovieCompactSerializer,
    TMDBMovieSerializer,
)


class GenreModelTest(TestCase):
    """Verify Genre creation and string representation."""

    def test_create_genre(self):
        genre = Genre.objects.create(tmdb_id=28, name="Action", slug="action")
        self.assertEqual(str(genre), "Action")
        self.assertEqual(genre.tmdb_id, 28)

    def test_genre_slug_unique(self):
        Genre.objects.create(tmdb_id=28, name="Action", slug="action")
        with self.assertRaises(Exception):
            Genre.objects.create(tmdb_id=99, name="Action2", slug="action")
class MovieModelTest(TestCase):
    """Verify Movie model properties and relationships."""

    
    def setUp(self):
        self.genre = Genre.objects.create(tmdb_id=28, name="Action", slug="action")
        self.movie = Movie.objects.create(
            tmdb_id=550,
            title="Fight Club",
            overview="An insomniac office worker...",
            release_date=date(1999, 10, 15),
            vote_average=8.4,
            vote_count=25000,
            popularity=60.5,
            poster_path="/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
            backdrop_path="/fCayJrkfRaCRCTh8GqN30f8oyQF.jpg",
            trailer_key="SUXWAEX2jlg",
        )
        self.movie.genres.add(self.genre)

    def test_movie_str(self):
        self.assertEqual(str(self.movie), "Fight Club (1999)")

    def test_poster_url_property(self):
        self.assertIn("/w500/", self.movie.poster_url)

    def test_backdrop_url_property(self):
        self.assertIn("/w1280/", self.movie.backdrop_url)

    def test_trailer_url_property(self):
        self.assertIn("youtube.com/watch", self.movie.trailer_url)

    def test_trailer_embed_url_property(self):
        self.assertIn("youtube.com/embed", self.movie.trailer_embed_url)

    def test_genre_relationship(self):
        self.assertIn(self.genre, self.movie.genres.all())

class PersonModelTest(TestCase):
    """Verify Person model creation and profile URL."""

    def test_create_person(self):
        person = Person.objects.create(
            tmdb_id=819,
            name="Edward Norton",
            profile_path="/5XBzD5WuTyVQZeS4VI25z2moMeY.jpg",
            known_for_department="Acting",
        )
        self.assertEqual(str(person), "Edward Norton")
        self.assertIn("/w185/", person.profile_url)

    def test_profile_url_none_when_empty(self):
        person = Person.objects.create(tmdb_id=1, name="Unknown", profile_path="")
        self.assertIsNone(person.profile_url)


class TMDBMovieSerializerTest(TestCase):
    """Verify the raw TMDB response serializer handles edge cases."""

    def test_valid_tmdb_payload(self):
        payload = {
            "id": 550,
            "title": "Fight Club",
            "overview": "A ticking-Loss bomb...",
            "release_date": "1999-10-15",
            "vote_average": 8.4,
            "vote_count": 25000,
            "popularity": 60.5,
            "poster_path": "/poster.jpg",
            "backdrop_path": "/backdrop.jpg",
            "genre_ids": [18, 53],
        }
        serializer = TMDBMovieSerializer(payload)
        data = serializer.data
        self.assertEqual(data["id"], 550)
        self.assertEqual(data["year"], 1999)
        self.assertIn("poster_url", data)

    def test_missing_genre_ids_uses_default(self):
        """genre_ids is optional — should default to empty list."""
        payload = {
            "id": 1,
            "title": "Test",
            "overview": "",
            "release_date": "",
            "vote_average": 0,
            "vote_count": 0,
            "popularity": 0,
            "poster_path": None,
            "backdrop_path": None,
        }
        serializer = TMDBMovieSerializer(payload)
        data = serializer.data
        self.assertEqual(data["genre_ids"], [])
        self.assertIsNone(data["year"])

class SearchEndpointTest(TestCase):
    """Test the /api/movies/search/ endpoint."""

    def setUp(self):
        self.client = APIClient()

    def test_search_requires_query(self):
        response = self.client.get("/api/movies/search/")
        self.assertEqual(response.status_code, 400)
        self.assertIn("error", response.json())

    @patch("movies.views.tmdb")
    def test_search_returns_results(self, mock_tmdb):
        mock_tmdb.search_movies.return_value = {
            "results": [
                {
                    "id": 550,
                    "title": "Fight Club",
                    "overview": "Test",
                    "release_date": "1999-10-15",
                    "vote_average": 8.4,
                    "vote_count": 25000,
                    "popularity": 60.5,
                    "poster_path": "/p.jpg",
                    "backdrop_path": "/b.jpg",
                    "genre_ids": [18],
                }
            ],
            "total_pages": 1,
            "total_results": 1,
        }
        response = self.client.get("/api/movies/search/?q=fight+club")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data["results"]), 1)
        self.assertEqual(data["query"], "fight club")


class TrendingEndpointTest(TestCase):
    """Test the /api/movies/trending/ endpoint."""

    def setUp(self):
        self.client = APIClient()

    @patch("movies.views.tmdb")
    def test_trending_returns_paginated(self, mock_tmdb):
        mock_tmdb.get_trending_movies.return_value = {
            "results": [],
            "total_pages": 5,
            "total_results": 100,
        }
        response = self.client.get("/api/movies/trending/")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("results", data)
        self.assertIn("total_pages", data)

    @patch("movies.views.tmdb")
    def test_trending_accepts_window_param(self, mock_tmdb):
        mock_tmdb.get_trending_movies.return_value = {"results": [], "total_pages": 1}
        self.client.get("/api/movies/trending/?window=day")
        mock_tmdb.get_trending_movies.assert_called_with(time_window="day", page=1)        
    
class MoodEndpointTest(TestCase):
    """Test mood list and mood-filtered movie endpoints."""

    def setUp(self):
        self.client = APIClient()

    def test_mood_list(self):
        response = self.client.get("/api/movies/moods/")
        self.assertEqual(response.status_code, 200)
        moods = response.json()
        self.assertTrue(len(moods) > 0)
        self.assertIn("slug", moods[0])
        self.assertIn("label", moods[0])

    def test_unknown_mood_returns_404(self):
        response = self.client.get("/api/movies/moods/nonexistent-mood/")
        self.assertEqual(response.status_code, 404)
        
