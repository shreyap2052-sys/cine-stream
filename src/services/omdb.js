const API_URL = "https://www.omdbapi.com/";
const API_KEY = import.meta.env.VITE_OMDB_KEY;

const normalizeMovie = (movie) => ({
  id: movie.imdbID,
  title: movie.Title,
  year: movie.Year,
  rating:
    movie.imdbRating && movie.imdbRating !== "N/A"
      ? Number(movie.imdbRating)
      : 0,
  poster: movie.Poster !== "N/A" ? movie.Poster : null,
});

const getMovieDetails = async (imdbID) => {
  const response = await fetch(
    `${API_URL}?apikey=${API_KEY}&i=${imdbID}&type=movie`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch movie details.");
  }

  const data = await response.json();

  if (data.Response === "False") {
    return null;
  }

  return normalizeMovie(data);
};

export const searchMovies = async (query, page = 1) => {
  const response = await fetch(
    `${API_URL}?apikey=${API_KEY}&s=${encodeURIComponent(
      query
    )}&type=movie&page=${page}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch movies.");
  }

  const data = await response.json();

  if (data.Response === "False") {
    return {
      results: [],
      hasMore: false,
    };
  }

  const detailedMovies = await Promise.all(
    data.Search.map((movie) => getMovieDetails(movie.imdbID))
  );

  return {
    results: detailedMovies.filter(Boolean),
    hasMore: data.Search.length === 10,
  };
};