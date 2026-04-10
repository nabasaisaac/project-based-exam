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