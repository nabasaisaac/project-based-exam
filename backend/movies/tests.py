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