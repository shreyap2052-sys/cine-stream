import { useFavorites } from "../context/FavoritesContext";

function MovieCard({ movie }) {
  const { isFavorite, toggleFavorite } = useFavorites();

  const favorite = isFavorite(movie.id);
  const releaseYear = movie.year || "N/A";
  const rating = Number(movie.rating);

  return (
    <article className="movie-card">
      <div className="movie-poster-wrapper">
        {movie.poster ? (
          <img
            src={movie.poster}
            alt={movie.title}
            loading="lazy"
          />
        ) : (
          <div className="movie-poster-placeholder">
            <span>{movie.title}</span>
          </div>
        )}

        <button
          type="button"
          className={`favorite-button ${favorite ? "active" : ""}`}
          onClick={() => toggleFavorite(movie)}
          aria-label={
            favorite
              ? `Remove ${movie.title} from favorites`
              : `Add ${movie.title} to favorites`
          }
        >
          {favorite ? "♥" : "♡"}
        </button>
      </div>

      <div className="movie-card-info">
        <h2>{movie.title}</h2>

        <div className="movie-meta">
          <span>{releaseYear}</span>
          <span>
            ★ {Number.isFinite(rating) ? rating.toFixed(1) : "N/A"}
          </span>
        </div>
      </div>
    </article>
  );
}

export default MovieCard;