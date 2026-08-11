import { useCallback, useEffect, useRef, useState } from "react";
import MovieGrid from "../components/MovieGrid";
import SearchBar from "../components/SearchBar";
import useDebounce from "../hooks/useDebounce";
import useInfiniteScroll from "../hooks/useInfiniteScroll";
import { getLocalMovies, searchLocalMovies } from "../services/movieData";

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

  const loadInitialMovies = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getLocalMovies(1);

      setMovies(data.results);
      setPage(1);
      setHasMore(data.hasMore);
    } catch (err) {
      setError("Unable to load movies. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitialMovies();
  }, [loadInitialMovies]);

  const loadMoreMovies = useCallback(async () => {
    if (loadingMore || !hasMore || debouncedQuery.trim()) {
      return;
    }

    try {
      setLoadingMore(true);

      const nextPage = page + 1;
      const data = await getLocalMovies(nextPage);

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
  }, [page, loadingMore, hasMore, debouncedQuery]);

  useInfiniteScroll({
    target: sentinelRef,
    onIntersect: loadMoreMovies,
    enabled: hasMore && !loading && !debouncedQuery.trim(),
  });

  useEffect(() => {
    const searchMovies = async () => {
      const query = debouncedQuery.trim();

      if (!query) {
        loadInitialMovies();
        return;
      }

      try {
        setLoading(true);
        setError("");

        const results = await searchLocalMovies(query);

        setMovies(results);
        setHasMore(false);
      } catch (err) {
        setError("Unable to search movies. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    searchMovies();
  }, [debouncedQuery, loadInitialMovies]);

  return (
    <main>
      <h1>Cine-Stream</h1>
      <p>Discover your next movie.</p>

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