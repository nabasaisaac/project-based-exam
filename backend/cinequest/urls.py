from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.routers import DefaultRouter
from . import views
# Instantiate a DefaultRouter to automatically generate standardized 
# CRUD endpoints for movies, genres, and people.

router = DefaultRouter()
router.register(r"list", views.MovieViewSet, basename="movie")
router.register(r"genres", views.GenreViewSet, basename="genre")
router.register(r"people", views.PersonViewSet, basename="person")


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/users/", include("users.urls")),
    path("api/movies/", include("movies.urls")),
    path("api/recommendations/", include("recommendations.urls")),
    path("search/", views.search_movies, name="search-movies"),
    path("trending/", views.trending_movies, name="trending-movies"),
    path("now-playing/", views.now_playing, name="now-playing"),
    path("top-rated/", views.top_rated, name="top-rated"),
    path("tmdb/<int:tmdb_id>/", views.movie_detail_tmdb, name="movie-detail-tmdb"),
    path("people/search/", views.search_people, name="search-people"),
    path("moods/", views.mood_list, name="mood-list"),
    path("moods/<str:mood_slug>/", views.mood_movies, name="mood-movies"),
    path("discover/", views.discover_filtered, name="discover-filtered"),
    path("compare/", views.compare_movies, name="compare-movies"),
    path("marathon/", views.marathon_themes, name="marathon-themes"),
    path("marathon/<str:theme_slug>/", views.generate_marathon, name="generate-marathon"),
    path("", include(router.urls)),
]
