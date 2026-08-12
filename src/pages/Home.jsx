import { useCallback, useEffect, useRef, useState } from "react";
import MovieGrid from "../components/MovieGrid";
import SearchBar from "../components/SearchBar";
import MoodMatcher from "../components/MoodMatcher";
import useDebounce from "../hooks/useDebounce";
import useInfiniteScroll from "../hooks/useInfiniteScroll";
import { searchMovies } from "../services/omdb";
import { getMoodMovie } from "../services/mood";

function Home() {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const sentinelRef = useRef(null);
  const debouncedQuery = useDebounce(searchQuery, 500);

  const loadMovies = useCallback(async (query, moviePage = 1) => {
    const data = await searchMovies(query, moviePage);
    return data;
  }, []);

  const loadInitialMovies = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await loadMovies("movie", 1);

      setMovies(data.results);
      setPage(1);
      setHasMore(data.hasMore);
    } catch (err) {
      setError("Unable to load movies. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [loadMovies]);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      loadInitialMovies();
    }
  }, [debouncedQuery, loadInitialMovies]);

  const loadMoreMovies = useCallback(async () => {
    if (loadingMore || !hasMore || debouncedQuery.trim()) {
      return;
    }

    try {
      setLoadingMore(true);

      const nextPage = page + 1;
      const data = await loadMovies("movie", nextPage);

      setMovies((prevMovies) => [
        ...prevMovies,
        ...data.results,
      ]);

      setPage(nextPage);
      setHasMore(data.hasMore);
    } catch (err) {
      setError("Unable to load more movies.");
    } finally {
      setLoadingMore(false);
    }
  }, [
    page,
    loadingMore,
    hasMore,
    debouncedQuery,
    loadMovies,
  ]);

  useInfiniteScroll({
    target: sentinelRef,
    onIntersect: loadMoreMovies,
    enabled:
      hasMore &&
      !loading &&
      !loadingMore &&
      !debouncedQuery.trim(),
  });

  useEffect(() => {
    const query = debouncedQuery.trim();

    if (!query) {
      return;
    }

    const searchOMDb = async () => {
      try {
        setLoading(true);
        setError("");
        setPage(1);

        const data = await loadMovies(query, 1);

        setMovies(data.results);
        setHasMore(data.hasMore);
      } catch (err) {
        setError("Unable to search movies. Please try again.");
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    searchOMDb();
  }, [debouncedQuery, loadMovies]);

  const handleMovieSuggestion = async (mood) => {
    try {
      setLoading(true);
      setError("");

      const movieTitle = await getMoodMovie(mood);

      const data = await searchMovies(movieTitle, 1);

      if (data.results.length === 0) {
        setMovies([]);
        setError(
          `We couldn't find "${movieTitle}" in the movie database.`
        );
        return;
      }

      setMovies(data.results.slice(0, 1));
      setHasMore(false);
      setPage(1);
    } catch (err) {
      console.error("Mood matcher error:", err);

      setError(
        "Unable to generate a movie recommendation. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <p className="page-subtitle">
        Discover your next movie.
      </p>

      <MoodMatcher
        onMovieSuggestion={handleMovieSuggestion}
      />

      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
      />

      {loading && <p>Loading movies...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && (
        <>
          {movies.length > 0 ? (
            <MovieGrid movies={movies} />
          ) : (
            <p>No movies found.</p>
          )}

          <div
            ref={sentinelRef}
            className="scroll-sentinel"
            aria-hidden="true"
          />

          {loadingMore && (
            <p className="loading-more">
              Loading more movies...
            </p>
          )}

          {!hasMore && !debouncedQuery.trim() && (
            <p className="end-message">
              You've reached the end.
            </p>
          )}
        </>
      )}
    </main>
  );
}

export default Home;